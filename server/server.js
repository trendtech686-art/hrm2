const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto'); // For webhook signature verification
const { generateSmartFilename, extractEmployeeContext, wouldConflict } = require('./filename-utils');
const fetch = require('node-fetch'); // For GHTK API proxy

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.VITE_SERVER_PORT || 3001;

// Middleware - Smart CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://localhost:5174',
  'http://localhost:5175', // Backup ports
  'http://localhost:4173', // Vite preview
  'https://yourdomain.com', // Production domain
  'https://www.yourdomain.com', // Production www
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // For development, allow file:// origins and localhost
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any localhost port for development
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    const msg = `CORS policy: Origin ${origin} not allowed`;
    return callback(new Error(msg), false);
  },
  credentials: true
}));
app.use(express.json());

// Tạo thư mục uploads nếu chưa có
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const STAGING_DIR = path.join(UPLOAD_DIR, 'staging');
const PERMANENT_DIR = path.join(UPLOAD_DIR, 'permanent');
const EMPLOYEES_DIR = path.join(PERMANENT_DIR, 'employees');
const PRODUCTS_DIR = path.join(PERMANENT_DIR, 'products');
const CUSTOMERS_DIR = path.join(PERMANENT_DIR, 'customers');
const WARRANTY_DIR = path.join(PERMANENT_DIR, 'warranty');
const COMPLAINTS_DIR = path.join(PERMANENT_DIR, 'complaints');
fs.ensureDirSync(UPLOAD_DIR);
fs.ensureDirSync(STAGING_DIR);
fs.ensureDirSync(PERMANENT_DIR);
fs.ensureDirSync(EMPLOYEES_DIR);
fs.ensureDirSync(PRODUCTS_DIR);
fs.ensureDirSync(CUSTOMERS_DIR);
fs.ensureDirSync(WARRANTY_DIR);
fs.ensureDirSync(COMPLAINTS_DIR);

// Helper function để tạo đường dẫn theo ngày
const getDateBasedPath = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// Khởi tạo database SQLite và migrate schema
const db = new sqlite3.Database(path.join(__dirname, 'hrm_files.db'));

// Tạo bảng lưu metadata file (thêm staging status)
db.serialize(() => {
  // Tạo bảng mới nếu chưa có
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      document_type TEXT NOT NULL,
      document_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      filesize INTEGER NOT NULL,
      mimetype TEXT NOT NULL,
      status TEXT DEFAULT 'permanent',  -- 'staging' hoặc 'permanent'
      session_id TEXT,                  -- Session ID cho staging files
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed_at DATETIME NULL        -- Khi nào chuyển từ staging sang permanent
    )
  `);

  // Migrate existing data - thêm cột mới nếu chưa có
  db.all("PRAGMA table_info(files)", (err, columns) => {
    if (err) {
      return;
    }

    const hasStatusColumn = columns.some(col => col.name === 'status');
    const hasSessionColumn = columns.some(col => col.name === 'session_id');
    const hasConfirmedColumn = columns.some(col => col.name === 'confirmed_at');
    const hasFileSlugColumn = columns.some(col => col.name === 'file_slug');
    const hasDisplayNameColumn = columns.some(col => col.name === 'display_name');
    const hasFilenameMetadataColumn = columns.some(col => col.name === 'filename_metadata');

    if (!hasStatusColumn) {
      db.run("ALTER TABLE files ADD COLUMN status TEXT DEFAULT 'permanent'");
    }

    if (!hasSessionColumn) {
      db.run("ALTER TABLE files ADD COLUMN session_id TEXT");
    }

    if (!hasConfirmedColumn) {
      db.run("ALTER TABLE files ADD COLUMN confirmed_at DATETIME");
    }

    if (!hasFileSlugColumn) {
      db.run("ALTER TABLE files ADD COLUMN file_slug TEXT");
    }

    if (!hasDisplayNameColumn) {
      db.run("ALTER TABLE files ADD COLUMN display_name TEXT");
    }

    if (!hasFilenameMetadataColumn) {
      db.run("ALTER TABLE files ADD COLUMN filename_metadata TEXT");
    }
  });
});

// Cấu hình multer cho staging upload (không cần employee info ngay)
const stagingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // CRITICAL FIX: req.body.sessionId is undefined during multer parsing!
    // We need to reuse the same sessionId for all files in the same request
    let sessionId;
    
    if (req.stagingSessionId) {
      // Reuse from previous file in same request
      sessionId = req.stagingSessionId;
    } else {
      // First file - try to get from body (won't work) or create new
      sessionId = req.body.sessionId || uuidv4();
      req.stagingSessionId = sessionId; // Save for next files
    }
    
    const stagingPath = path.join(STAGING_DIR, sessionId);
    
    // Tạo thư mục staging nếu chưa có
    fs.ensureDirSync(stagingPath);
    
    // Lưu sessionId vào req để dùng sau
    req.sessionId = sessionId;
    cb(null, stagingPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique cho staging với micro-timestamp để tránh trùng
    const timestamp = Date.now();
    const microTime = process.hrtime()[1]; // Nanosecond precision
    const uniqueId = uuidv4().split('-')[0];
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const filename = `${timestamp}${microTime}_${uniqueId}_${cleanName}${ext}`;
    cb(null, filename);
  }
});

// Cấu hình multer cho permanent upload (khi confirm)
const permanentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { employeeId, documentType } = req.params;
    const datePath = getDateBasedPath();
    const permanentPath = path.join(PERMANENT_DIR, datePath, 'employees', employeeId, documentType);
    
    // Tạo thư mục permanent nếu chưa có
    fs.ensureDirSync(permanentPath);
    cb(null, permanentPath);
  },
  filename: (req, file, cb) => {
    // Giữ nguyên tên file từ staging hoặc tạo mới
    const timestamp = Date.now();
    const uniqueId = uuidv4().split('-')[0];
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const filename = `${timestamp}_${uniqueId}_${cleanName}${ext}`;
    cb(null, filename);
  }
});

// Validate file types và size
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
    'image/webp',
    'image/gif',
    'application/pdf'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB for images
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Chỉ hỗ trợ file PDF, hình ảnh (PNG, JPG, WEBP, GIF) và video (MP4, MOV, AVI, WebM). File "${file.originalname}" có type: ${file.mimetype}`), false);
  }
};

const stagingUpload = multer({ 
  storage: stagingStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for video files
  }
});

const permanentUpload = multer({ 
  storage: permanentStorage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for video files
  }
});

// API Routes

// Middleware to parse sessionId from FormData before multer
app.use('/api/staging/upload', (req, res, next) => {
  // Extract sessionId from query params if not in body (FormData workaround)
  if (req.query.sessionId) {
    req.stagingSessionId = req.query.sessionId;
  }
  next();
});

// Error handler for multer
app.use('/api/staging/upload', (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn. Tối đa 10MB/file.'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file. Tối đa 10 files.'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Field name không đúng. Phải là "files".'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: `Lỗi upload: ${err.message}`
    });
  }
  
  if (err) {
    console.error('❌ File filter error:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Lỗi khi kiểm tra file'
    });
  }
  
  next();
});

// 1. Upload file vào staging (chưa confirm) - với smart filename
// Test endpoint for smart filename generation
app.post('/api/test-filename', (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }
    
    const result = generateSmartFilename(filename);
    res.json({
      original: filename,
      smart: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File staging upload endpoint
app.post('/api/staging/upload', stagingUpload.array('files', 10), (req, res) => {
  try {
    const files = req.files;
    const sessionId = req.stagingSessionId || req.query.sessionId || req.body.sessionId || uuidv4();
    
    console.log('📤 Staging upload:', {
      filesCount: files?.length,
      sessionId,
      fileNames: files?.map(f => f.originalname)
    });
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có file nào được upload' 
      });
    }

    const stagingFiles = [];

    // Lưu thông tin file vào database với status = 'staging' và smart filename
    const stmt = db.prepare(`
      INSERT INTO files (id, employee_id, document_type, document_name, original_name, filename, filepath, filesize, mimetype, status, session_id, file_slug, display_name, filename_metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'staging', ?, ?, ?, ?)
    `);

    files.forEach(file => {
      const fileId = uuidv4();
      
      // Debug: Check if file exists on disk
      const diskPath = file.path;
      const fileExists = fs.existsSync(diskPath);
      
      // Tạo smart filename (không có employee info trong staging)
      const smartFilename = generateSmartFilename(file.originalname, {}, 0);
      
      // Check for duplicates in current session
      const existingFiles = db.prepare(`
        SELECT COUNT(*) as count FROM files 
        WHERE session_id = ? AND file_slug LIKE ?
      `).get(sessionId, smartFilename.slug.replace(/\.[^.]*$/, '') + '%');
      
      // Generate final filename with duplicate counter if needed
      const finalSmartFilename = generateSmartFilename(
        file.originalname, 
        {}, 
        existingFiles.count
      );
      
      const fileUrl = `/api/staging/files/${sessionId}/${file.filename}`;
      
      stmt.run([
        fileId,
        '', // Employee ID để trống trong staging
        '', // Document type để trống trong staging  
        '', // Document name để trống trong staging
        file.originalname, // Tên file gốc (tiếng Việt)
        file.filename, // Tên file hệ thống (UUID)
        file.path,
        file.size,
        file.mimetype,
        sessionId,
        finalSmartFilename.slug, // URL-safe slug
        finalSmartFilename.displayName, // Tên hiển thị cho user
        finalSmartFilename.metadata // Metadata thông minh
      ]);

      stagingFiles.push({
        id: fileId,
        name: finalSmartFilename.displayName, // Hiển thị tên thông minh
        originalName: file.originalname, // Tên gốc
        filename: file.filename, // Tên file hệ thống (cần cho preview URL)
        slug: finalSmartFilename.slug, // Slug URL-safe
        size: file.size,
        type: file.mimetype,
        path: file.path,
        url: fileUrl,
        sessionId: sessionId,
        status: 'staging',
        uploadedAt: new Date().toISOString(),
        metadata: finalSmartFilename.metadata
      });
    });

    stmt.finalize();
    
    res.json({
      success: true,
      message: `Đã tải lên ${files.length} file tạm thời với tên thông minh`,
      files: stagingFiles,
      sessionId: sessionId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload file tạm',
      error: error.message
    });
  }
});

// Comment Image Upload - Quick upload for comments/chat
app.post('/api/comments/upload-image', stagingUpload.single('image'), (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có file ảnh được upload' 
      });
    }

    // Validate image types
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      fs.removeSync(file.path); // Clean up
      return res.status(400).json({ 
        success: false, 
        message: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)' 
      });
    }

    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      fs.removeSync(file.path); // Clean up
      return res.status(400).json({ 
        success: false, 
        message: file.mimetype.startsWith('video/') 
          ? 'Video quá lớn. Kích thước tối đa 50MB' 
          : 'Ảnh quá lớn. Kích thước tối đa 10MB'
      });
    }

    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    const dateBasedPath = getDateBasedPath();
    
    // Create comment images directory with date structure
    const commentsDir = path.join(STAGING_DIR, 'comments', dateBasedPath);
    fs.ensureDirSync(commentsDir);
    
    // Generate filename: comment_timestamp_uuid.ext
    const timestamp = Date.now();
    const newFilename = `comment_${timestamp}_${fileId.substring(0, 8)}${ext}`;
    const newPath = path.join(commentsDir, newFilename);
    
    // Move file to comments directory
    fs.moveSync(file.path, newPath);
    
    // Generate URL
    const url = `/api/files/staging/comments/${dateBasedPath}/${newFilename}`;
    
    // Save to database for tracking
    db.run(`
      INSERT INTO files (
        id, document_type, original_name, filename, filepath, 
        filesize, mimetype, status, session_id, created_at
      ) VALUES (?, 'comment-image', ?, ?, ?, ?, ?, 'staging', ?, datetime('now'))
    `, [
      fileId,
      file.originalname,
      newFilename,
      newPath,
      file.size,
      file.mimetype,
      'comment-' + timestamp
    ], (err) => {
      if (err) {
        console.error('❌ Database save error:', err);
        // Continue even if DB save fails, file is already uploaded
      }
    });

    console.log('✅ Comment image uploaded:', {
      fileId,
      filename: newFilename,
      size: (file.size / 1024).toFixed(2) + ' KB',
      url
    });

    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      file: {
        id: fileId,
        url: url,
        filename: newFilename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    });

  } catch (error) {
    console.error('❌ Comment image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload ảnh',
      error: error.message
    });
  }
});

// 2. Confirm staging files → permanent với smart filename (khi save form)
app.post('/api/staging/confirm/:sessionId/:employeeId/:documentType/:documentName', (req, res) => {
  try {
    const { sessionId, employeeId, documentType, documentName } = req.params;
    const { employeeData } = req.body; // Thông tin employee để tạo smart filename
    
    // Lấy tất cả staging files của session
    db.all('SELECT * FROM files WHERE session_id = ? AND status = "staging"', [sessionId], (err, stagingFiles) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!stagingFiles || stagingFiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy file tạm để confirm' 
        });
      }

      const confirmedFiles = [];
      let processedCount = 0;

      // Extract employee context for smart naming
      const employeeContext = extractEmployeeContext({
        ...employeeData,
        employeeId: employeeId,
        department: employeeData?.department || documentType
      });

      stagingFiles.forEach((file, index) => {
        // Tạo đường dẫn permanent mới
        const datePath = getDateBasedPath();
        const permanentDir = path.join(PERMANENT_DIR, datePath, 'employees', employeeId, documentType);
        fs.ensureDirSync(permanentDir);
        
        // Tạo smart filename với employee context
        // Check duplicates trong permanent directory
        const existingFiles = db.prepare(`
          SELECT COUNT(*) as count FROM files 
          WHERE employee_id = ? AND document_type = ? AND status = 'permanent'
          AND file_slug LIKE ?
        `).get(employeeId, documentType, file.file_slug.replace(/\.[^.]*$/, '') + '%');
        
        const finalSmartFilename = generateSmartFilename(
          file.original_name,
          employeeContext,
          existingFiles.count
        );
        
        // Sử dụng slug làm filename thật
        const slugFilename = finalSmartFilename.slug;
        const newFilePath = path.join(permanentDir, slugFilename);
        const newFileUrl = `/api/files/${datePath}/employees/${employeeId}/${documentType}/${slugFilename}`;

        // Di chuyển file từ staging sang permanent với tên slug
        fs.move(file.filepath, newFilePath, (moveErr) => {
          if (moveErr) {
            // Silent fail
          }

          // Cập nhật database: staging → permanent với smart filename
          db.run(`
            UPDATE files 
            SET employee_id = ?, document_type = ?, document_name = ?, 
                filepath = ?, filename = ?, status = 'permanent', confirmed_at = CURRENT_TIMESTAMP,
                file_slug = ?, display_name = ?, filename_metadata = ?
            WHERE id = ?
          `, [
            employeeId, 
            documentType, 
            decodeURIComponent(documentName), 
            newFilePath,
            slugFilename, // Filename thật sử dụng slug
            finalSmartFilename.slug,
            finalSmartFilename.displayName,
            finalSmartFilename.metadata,
            file.id
          ], function(updateErr) {
            if (updateErr) {
              // Silent fail
            }

            confirmedFiles.push({
              id: file.id,
              name: finalSmartFilename.displayName, // Hiển thị tên thông minh
              originalName: file.original_name,
              slug: finalSmartFilename.slug,
              size: file.filesize,
              type: file.mimetype,
              path: newFilePath,
              url: newFileUrl,
              uploadedAt: file.uploaded_at,
              confirmedAt: new Date().toISOString(),
              metadata: finalSmartFilename.metadata
            });

            processedCount++;
            
            // Khi xử lý xong tất cả files
            if (processedCount === stagingFiles.length) {
              // Xóa thư mục staging
              fs.remove(path.join(STAGING_DIR, sessionId), (rmErr) => {
                // Silent cleanup
              });

              res.json({
                success: true,
                message: `Đã xác nhận ${confirmedFiles.length} file với tên thông minh`,
                files: confirmedFiles
              });
            }
          });
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận file',
      error: error.message
    });
  }
});

// 2b. Confirm staging files → permanent cho Products
app.post('/api/staging/confirm/:sessionId/products/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const { productData } = req.body; // Thông tin sản phẩm
    
    // Lấy tất cả staging files của session
    db.all('SELECT * FROM files WHERE session_id = ? AND status = "staging"', [sessionId], (err, stagingFiles) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!stagingFiles || stagingFiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy file tạm để confirm' 
        });
      }

      const confirmedFiles = [];
      let processedCount = 0;

      stagingFiles.forEach((file, index) => {
        // Tạo đường dẫn permanent mới cho products
        const datePath = getDateBasedPath();
        const permanentDir = path.join(PRODUCTS_DIR, productId, 'images');
        fs.ensureDirSync(permanentDir);
        
        // Sử dụng tên file gốc đơn giản cho ảnh sản phẩm
        const timestamp = Date.now();
        const ext = path.extname(file.original_name);
        const baseFilename = path.basename(file.original_name, ext);
        const slugFilename = `${baseFilename}-${timestamp}${ext}`.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        
        const newFilePath = path.join(permanentDir, slugFilename);
        const newFileUrl = `/api/files/products/${productId}/images/${slugFilename}`;

        // Di chuyển file từ staging sang permanent
        fs.move(file.filepath, newFilePath, (moveErr) => {
          if (moveErr) {
            console.error('Move error:', moveErr);
          }

          // Cập nhật database: staging → permanent
          db.run(`
            UPDATE files 
            SET employee_id = ?, document_type = ?, document_name = ?, 
                filepath = ?, filename = ?, status = 'permanent', confirmed_at = CURRENT_TIMESTAMP,
                file_slug = ?, display_name = ?
            WHERE id = ?
          `, [
            productId, 
            'products', 
            'images', 
            newFilePath,
            slugFilename,
            slugFilename,
            file.original_name,
            file.id
          ], function(updateErr) {
            if (updateErr) {
              console.error('Update error:', updateErr);
            }

            confirmedFiles.push({
              id: file.id,
              name: file.original_name,
              originalName: file.original_name,
              slug: slugFilename,
              size: file.filesize,
              type: file.mimetype,
              path: newFilePath,
              url: newFileUrl,
              uploadedAt: file.uploaded_at,
              confirmedAt: new Date().toISOString()
            });

            processedCount++;
            
            // Khi xử lý xong tất cả files
            if (processedCount === stagingFiles.length) {
              // Xóa thư mục staging
              fs.remove(path.join(STAGING_DIR, sessionId), (rmErr) => {
                // Silent cleanup
              });

              res.json({
                success: true,
                message: `Đã xác nhận ${confirmedFiles.length} ảnh sản phẩm`,
                files: confirmedFiles
              });
            }
          });
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận ảnh sản phẩm',
      error: error.message
    });
  }
});

// 2c. Confirm staging files → permanent cho Customers
app.post('/api/staging/confirm/:sessionId/customers/:customerId', (req, res) => {
  try {
    const { sessionId, customerId } = req.params;
    const { customerData } = req.body; // Thông tin khách hàng
    
    // Lấy tất cả staging files của session
    db.all('SELECT * FROM files WHERE session_id = ? AND status = "staging"', [sessionId], (err, stagingFiles) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!stagingFiles || stagingFiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy file tạm để confirm' 
        });
      }

      const confirmedFiles = [];
      let processedCount = 0;

      stagingFiles.forEach((file, index) => {
        // Tạo đường dẫn permanent mới cho customers
        const datePath = getDateBasedPath();
        const permanentDir = path.join(CUSTOMERS_DIR, customerId, 'images');
        fs.ensureDirSync(permanentDir);
        
        // Sử dụng tên file gọn cho ảnh khách hàng
        const timestamp = Date.now();
        const ext = path.extname(file.original_name);
        const baseFilename = path.basename(file.original_name, ext);
        const slugFilename = `${baseFilename}-${timestamp}${ext}`.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        
        const newFilePath = path.join(permanentDir, slugFilename);
        const newFileUrl = `/api/files/customers/${customerId}/images/${slugFilename}`;

        // Di chuyển file từ staging sang permanent
        fs.move(file.filepath, newFilePath, (moveErr) => {
          if (moveErr) {
            console.error('Move error:', moveErr);
          }

          // Cập nhật database: staging → permanent
          db.run(`
            UPDATE files 
            SET employee_id = ?, document_type = ?, document_name = ?, 
                filepath = ?, filename = ?, status = 'permanent', confirmed_at = CURRENT_TIMESTAMP,
                file_slug = ?, display_name = ?
            WHERE id = ?
          `, [
            customerId, 
            'customers', 
            'images', 
            newFilePath,
            slugFilename,
            slugFilename,
            file.original_name,
            file.id
          ], function(updateErr) {
            if (updateErr) {
              console.error('Update error:', updateErr);
            }

            confirmedFiles.push({
              id: file.id,
              name: file.original_name,
              originalName: file.original_name,
              slug: slugFilename,
              size: file.filesize,
              type: file.mimetype,
              path: newFilePath,
              url: newFileUrl,
              uploadedAt: file.uploaded_at,
              confirmedAt: new Date().toISOString()
            });

            processedCount++;
            
            // Khi xử lý xong tất cả files
            if (processedCount === stagingFiles.length) {
              // Xóa thư mục staging
              fs.remove(path.join(STAGING_DIR, sessionId), (rmErr) => {
                // Silent cleanup
              });

              res.json({
                success: true,
                message: `Đã xác nhận ${confirmedFiles.length} ảnh khách hàng`,
                files: confirmedFiles
              });
            }
          });
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận ảnh khách hàng',
      error: error.message
    });
  }
});

// 2d. Confirm staging files → permanent cho Warranty
app.post('/api/staging/confirm/:sessionId/warranty/:warrantyId/:imageType', (req, res) => {
  try {
    const { sessionId, warrantyId, imageType } = req.params; // imageType: 'received' hoặc 'processed'
    const { warrantyData } = req.body;
    
    // Lấy tất cả staging files của session
    db.all('SELECT * FROM files WHERE session_id = ? AND status = "staging"', [sessionId], (err, stagingFiles) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!stagingFiles || stagingFiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy file tạm để confirm' 
        });
      }

      const confirmedFiles = [];
      let processedCount = 0;

      // Tạo thư mục permanent cho warranty
      const PERMANENT_DIR = path.join(__dirname, 'uploads', 'permanent');
      const WARRANTY_DIR = path.join(PERMANENT_DIR, 'warranty');
      const warrantyDir = path.join(WARRANTY_DIR, warrantyId, imageType);
      fs.ensureDirSync(warrantyDir);

      stagingFiles.forEach((file, index) => {
        // Tạo tên file mới
        const timestamp = Date.now();
        const ext = path.extname(file.original_name);
        const baseFilename = path.basename(file.original_name, ext);
        const slugFilename = `${baseFilename}-${timestamp}${ext}`.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        
        const newFilePath = path.join(warrantyDir, slugFilename);
        const newFileUrl = `/api/files/warranty/${warrantyId}/${imageType}/${slugFilename}`;

        // Di chuyển file từ staging sang permanent
        fs.move(file.filepath, newFilePath, (moveErr) => {
          if (moveErr) {
            console.error('Move error:', moveErr);
          }

          // Cập nhật database: staging → permanent
          db.run(`
            UPDATE files 
            SET employee_id = ?, document_type = ?, document_name = ?, 
                filepath = ?, filename = ?, status = 'permanent', confirmed_at = CURRENT_TIMESTAMP,
                file_slug = ?, display_name = ?
            WHERE id = ?
          `, [
            warrantyId, 
            'warranty', 
            imageType, 
            newFilePath,
            slugFilename,
            slugFilename,
            file.original_name,
            file.id
          ], function(updateErr) {
            if (updateErr) {
              console.error('Update error:', updateErr);
            }

            confirmedFiles.push({
              id: file.id,
              name: file.original_name,
              originalName: file.original_name,
              slug: slugFilename,
              filename: slugFilename,
              size: file.filesize,
              type: file.mimetype,
              path: newFilePath,
              url: newFileUrl,
              uploadedAt: file.uploaded_at,
              confirmedAt: new Date().toISOString()
            });

            processedCount++;
            
            // Khi xử lý xong tất cả files
            if (processedCount === stagingFiles.length) {
              // Xóa thư mục staging
              fs.remove(path.join(STAGING_DIR, sessionId), (rmErr) => {
                // Silent cleanup
              });

              res.json({
                success: true,
                message: `Đã xác nhận ${confirmedFiles.length} ảnh bảo hành (${imageType})`,
                files: confirmedFiles
              });
            }
          });
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận ảnh bảo hành',
      error: error.message
    });
  }
});

// 2b. Confirm complaints images (staging → permanent)
app.post('/api/staging/confirm/:sessionId/complaints/:complaintId/:imageType', (req, res) => {
  try {
    const { sessionId, complaintId, imageType } = req.params;
    const complaintData = req.body.complaintData || {};
    
    console.log('=== Confirm Complaints Images ===');
    console.log('Session ID:', sessionId);
    console.log('Complaint ID:', complaintId);
    console.log('Image Type:', imageType);
    console.log('Complaint Data:', complaintData);

    // Query staging files by sessionId
    db.all(
      'SELECT * FROM files WHERE session_id = ? AND status = "staging"',
      [sessionId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi truy vấn staging files',
            error: err.message
          });
        }

        console.log('Found staging files:', rows?.length || 0);

        if (!rows || rows.length === 0) {
          return res.json({
            success: true,
            files: [],
            message: 'Không có staging files để confirm'
          });
        }

        // Create permanent directory structure
        const COMPLAINTS_DIR = path.join(PERMANENT_DIR, 'complaints');
        const complaintDir = path.join(COMPLAINTS_DIR, complaintId.toString(), imageType);
        
        console.log('Creating complaint directory:', complaintDir);
        fs.ensureDirSync(complaintDir);

        const confirmedFiles = [];
        let processedCount = 0;

        rows.forEach((file, index) => {
          const ext = path.extname(file.original_name);
          
          // Generate smart filename with complaint metadata
          const slugName = slugify(
            `${complaintData.customerName || 'unknown'}-${complaintData.orderCode || 'no-code'}-${Date.now()}-${index}`,
            { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }
          );
          const newFilename = `${slugName}${ext}`;
          
          const oldPath = file.filepath;
          const newPath = path.join(complaintDir, newFilename);

          console.log(`Moving file ${index + 1}:`, {
            from: oldPath,
            to: newPath
          });

          // Move file from staging to permanent
          try {
            fs.moveSync(oldPath, newPath, { overwrite: true });
            console.log(`✓ File moved successfully: ${newFilename}`);
          } catch (moveErr) {
            console.error(`✗ Error moving file ${file.original_name}:`, moveErr);
            return; // Skip this file
          }

          // Update database: staging → permanent
          db.run(
            `UPDATE files SET
              employee_id = ?,
              document_type = 'complaint',
              document_name = ?,
              filename = ?,
              filepath = ?,
              file_slug = ?,
              display_name = ?,
              status = 'permanent',
              confirmed_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
              complaintId,
              imageType,
              newFilename,
              newPath,
              slugName,
              complaintData.customerName || file.original_name,
              file.id
            ],
            function(updateErr) {
              if (updateErr) {
                console.error('Error updating DB for file:', file.id, updateErr);
              } else {
                console.log(`✓ DB updated for file: ${file.id}`);
              }
            }
          );

          // Build permanent URL
          const permanentUrl = `/api/files/complaints/${complaintId}/${imageType}/${newFilename}`;
          
          confirmedFiles.push({
            id: file.id,
            name: complaintData.customerName || file.original_name,
            originalName: file.original_name,
            filename: newFilename,
            slug: slugName,
            url: permanentUrl,
            size: file.filesize,
            type: file.mimetype,
            status: 'permanent',
            uploadedAt: file.uploaded_at,
            confirmedAt: new Date().toISOString()
          });

          processedCount++;

          // When all files processed, cleanup staging and respond
          if (processedCount === rows.length) {
            // Cleanup staging directory
            const stagingDir = path.join(STAGING_DIR, sessionId);
            fs.remove(stagingDir, (cleanupErr) => {
              if (cleanupErr) {
                console.error('Error cleaning up staging dir:', cleanupErr);
              } else {
                console.log('✓ Staging directory cleaned up');
              }
            });

            console.log('=== Confirm Complete ===');
            console.log('Confirmed files:', confirmedFiles.length);
            
            res.json({
              success: true,
              files: confirmedFiles,
              message: `Đã confirm ${confirmedFiles.length} file(s) cho complaint ${complaintId}`
            });
          }
        });
      }
    );

  } catch (error) {
    console.error('=== Confirm Complaints Error ===', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xác nhận ảnh khiếu nại',
      error: error.message
    });
  }
});

// 3. Lấy staging files theo session
app.get('/api/staging/files/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  db.all('SELECT * FROM files WHERE session_id = ? AND status = "staging" ORDER BY uploaded_at DESC', [sessionId], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const files = rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      name: row.original_name,
      filename: row.filename,
      size: row.filesize,
      type: row.mimetype,
      url: `/api/staging/files/${sessionId}/${row.filename}`,
      status: row.status,
      uploadedAt: row.uploaded_at
    }));

    res.json({ success: true, files });
  });
});

// 4. Serve staging files
app.get('/api/staging/files/:sessionId/:filename', (req, res) => {
  const { sessionId, filename } = req.params;
  const filePath = path.join(STAGING_DIR, sessionId, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File tạm không tồn tại hoặc đã hết hạn' 
    });
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải file tạm' });
    }
  });
});

// 5. Xóa staging files (cancel)
app.delete('/api/staging/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // Xóa files trong database
  db.run('DELETE FROM files WHERE session_id = ? AND status = "staging"', [sessionId], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    // Xóa thư mục staging
    const stagingPath = path.join(STAGING_DIR, sessionId);
    fs.remove(stagingPath, (fsErr) => {
      // Silent cleanup
      
      res.json({ 
        success: true, 
        message: 'Đã xóa tất cả file tạm',
        deletedRows: this.changes 
      });
    });
  });
});

// 6. Upload file(s) (legacy - giữ cho tương thích)
app.post('/api/upload/:employeeId/:documentType/:documentName', permanentUpload.array('files', 5), (req, res) => {
  try {
    const { employeeId, documentType, documentName } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không có file nào được upload' 
      });
    }

    const uploadedFiles = [];

    // Lưu thông tin từng file vào database với status = 'permanent'
    const stmt = db.prepare(`
      INSERT INTO files (id, employee_id, document_type, document_name, original_name, filename, filepath, filesize, mimetype, status, confirmed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'permanent', CURRENT_TIMESTAMP)
    `);

    files.forEach(file => {
      const fileId = uuidv4();
      const datePath = getDateBasedPath();
      const fileUrl = `/api/files/${datePath}/employees/${employeeId}/${documentType}/${file.filename}`;
      
      stmt.run([
        fileId,
        employeeId,
        documentType,
        decodeURIComponent(documentName),
        file.originalname,
        file.filename,
        file.path,
        file.size,
        file.mimetype
      ]);

      uploadedFiles.push({
        id: fileId,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      });
    });

    stmt.finalize();
    
    res.json({
      success: true,
      message: `Đã upload ${files.length} file thành công`,
      files: uploadedFiles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload file',
      error: error.message
    });
  }
});

// 7. Lấy danh sách file theo employee và document type (chỉ permanent)
app.get('/api/files/:employeeId/:documentType?', (req, res) => {
  const { employeeId, documentType } = req.params;
  
  let query = 'SELECT * FROM files WHERE employee_id = ? AND status = "permanent"';
  let params = [employeeId];
  
  if (documentType) {
    query += ' AND document_type = ?';
    params.push(documentType);
  }
  
  query += ' ORDER BY confirmed_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const files = rows.map(row => {
      let url;
      if (row.filepath) {
        // Convert Windows path to URL: D:\hrm2\server\uploads\permanent\2025\10\23\employees\NV00000027\legal\file.png
        // To: /api/files/2025/10/23/employees/NV00000027/legal/file.png
        const normalizedPath = row.filepath.replace(/\\/g, '/');
        
        // More flexible pattern matching
        const permanentMatch = normalizedPath.match(/uploads\/permanent\/(.+)/) || 
                              normalizedPath.match(/permanent\/(.+)/);
        
        if (permanentMatch) {
          url = `/api/files/${permanentMatch[1]}`;
        } else {
          // Fallback to legacy format
          url = `/api/files/${row.employee_id}/${row.document_type}/${row.filename}`;
        }
      } else {
        url = `/api/files/${row.employee_id}/${row.document_type}/${row.filename}`;
      }
      
      return {
        id: row.id,
        employeeId: row.employee_id,
        documentType: row.document_type,
        documentName: row.document_name,
        name: row.original_name,
        filename: row.filename,
        size: row.filesize,
        type: row.mimetype,
        url,
        uploadedAt: row.uploaded_at,
        confirmedAt: row.confirmed_at
      };
    });

    res.json({ success: true, files });
  });
});

// 3. Serve files (download/view) - Date-based structure
app.get('/api/files/:year/:month/:day/employees/:employeeId/:documentType/:filename', (req, res) => {
  const { year, month, day, employeeId, documentType, filename } = req.params;
  const filePath = path.join(PERMANENT_DIR, year, month, day, 'employees', employeeId, documentType, filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File không tồn tại' 
    });
  }

  // Serve file với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải file' });
    }
  });
});

// 3b. Serve files (legacy format - cho backward compatibility)
app.get('/api/files/:employeeId/:documentType/:filename', (req, res) => {
  const { employeeId, documentType, filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, employeeId, documentType, filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'File không tồn tại' 
    });
  }

  // Serve file với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải file' });
    }
  });
});

// 3c. Serve product images
app.get('/api/files/products/:productId/images/:filename', (req, res) => {
  const { productId, filename } = req.params;
  const filePath = path.join(PRODUCTS_DIR, productId, 'images', filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Ảnh sản phẩm không tồn tại' 
    });
  }

  // Serve image với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh' });
    }
  });
});

// 3d. Serve customer images
app.get('/api/files/customers/:customerId/images/:filename', (req, res) => {
  const { customerId, filename } = req.params;
  const filePath = path.join(CUSTOMERS_DIR, customerId, 'images', filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Ảnh khách hàng không tồn tại' 
    });
  }

  // Serve image với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh khách hàng' });
    }
  });
});

// 3e. Serve warranty images
app.get('/api/files/warranty/:warrantyId/:imageType/:filename', (req, res) => {
  const { warrantyId, imageType, filename } = req.params;
  const PERMANENT_DIR = path.join(__dirname, 'uploads', 'permanent');
  const WARRANTY_DIR = path.join(PERMANENT_DIR, 'warranty');
  const filePath = path.join(WARRANTY_DIR, warrantyId, imageType, filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Ảnh bảo hành không tồn tại' 
    });
  }

  // Serve image với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh bảo hành' });
    }
  });
});

// 3f. Serve complaints images
app.get('/api/files/complaints/:complaintId/:imageType/:filename', (req, res) => {
  const { complaintId, imageType, filename } = req.params;
  const PERMANENT_DIR = path.join(__dirname, 'uploads', 'permanent');
  const COMPLAINTS_DIR = path.join(PERMANENT_DIR, 'complaints');
  const filePath = path.join(COMPLAINTS_DIR, complaintId, imageType, filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Ảnh khiếu nại không tồn tại' 
    });
  }

  // Serve image với proper headers
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh khiếu nại' });
    }
  });
});

// 4. Xóa file
app.delete('/api/files/:fileId', (req, res) => {
  const { fileId } = req.params;
  
  // Lấy thông tin file từ database
  db.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ success: false, message: 'File không tồn tại' });
    }

    // Xóa file vật lý
    fs.remove(row.filepath, (fsErr) => {
      // Silent cleanup
      
      // Xóa record trong database (dù file vật lý có lỗi)
      db.run('DELETE FROM files WHERE id = ?', [fileId], function(dbErr) {
        if (dbErr) {
          return res.status(500).json({ success: false, error: dbErr.message });
        }
        
        res.json({ 
          success: true, 
          message: 'Đã xóa file thành công',
          deletedRows: this.changes 
        });
      });
    });
  });
});

// 5. Thống kê storage
app.get('/api/storage/info', (req, res) => {
  db.all('SELECT COUNT(*) as totalFiles, SUM(filesize) as totalSize FROM files', (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const stats = result[0];
    res.json({
      success: true,
      stats: {
        totalFiles: stats.totalFiles || 0,
        totalSize: stats.totalSize || 0,
        totalSizeMB: Math.round((stats.totalSize || 0) / 1024 / 1024 * 100) / 100
      }
    });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File quá lớn (tối đa 10MB)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Quá nhiều file (tối đa 5 file)'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Lỗi server không xác định'
  });
});

// Cleanup functions
function cleanupOldStagingFiles() {
  // Xóa staging files cũ hơn 24 giờ
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  db.all('SELECT DISTINCT session_id FROM files WHERE status = "staging" AND uploaded_at < ?', [cutoffTime], (err, rows) => {
    if (err) {
      return;
    }
    
    if (rows.length === 0) {
      return;
    }
    
    rows.forEach(row => {
      const sessionId = row.session_id;
      
      // Xóa files trong database
      db.run('DELETE FROM files WHERE session_id = ? AND status = "staging"', [sessionId], function(dbErr) {
        // Silent cleanup
      });
      
      // Xóa thư mục staging
      const stagingPath = path.join(STAGING_DIR, sessionId);
      fs.remove(stagingPath, (fsErr) => {
        // Silent cleanup
      });
    });
  });
}

// =======================
// DELETE EMPLOYEE FILES
// =======================
app.delete('/api/files/employee/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  
  try {
    // Get all files for this employee from database
    db.all('SELECT * FROM files WHERE employee_id = ?', [employeeId], (err, files) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Database error',
          details: err.message 
        });
      }
      
      let deletedFilesCount = 0;
      let deletedFoldersCount = 0;
      const errors = [];
      
      // Delete all physical files
      files.forEach(file => {
        try {
          const filePath = path.join(__dirname, file.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deletedFilesCount++;
          }
        } catch (fileErr) {
          errors.push({ file: file.filename, error: fileErr.message });
        }
      });
      
      // Delete employee folders from permanent storage
      try {
        const employeeDir = path.join(PERMANENT_DIR, 'employees', employeeId);
        if (fs.existsSync(employeeDir)) {
          fs.removeSync(employeeDir);
          deletedFoldersCount++;
        }
        
        // Also check in date-based structure
        const permanentFiles = fs.readdirSync(PERMANENT_DIR);
        permanentFiles.forEach(dateFolder => {
          const datePath = path.join(PERMANENT_DIR, dateFolder);
          if (fs.statSync(datePath).isDirectory()) {
            const employeesPath = path.join(datePath, 'employees', employeeId);
            if (fs.existsSync(employeesPath)) {
              fs.removeSync(employeesPath);
              deletedFoldersCount++;
            }
          }
        });
      } catch (folderErr) {
        errors.push({ folder: employeeId, error: folderErr.message });
      }
      
      // Delete from database
      db.run('DELETE FROM files WHERE employee_id = ?', [employeeId], function(dbErr) {
        if (dbErr) {
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to delete from database',
            details: dbErr.message 
          });
        }
        
        res.json({
          success: true,
          message: `Deleted all data for employee ${employeeId}`,
          stats: {
            filesDeleted: deletedFilesCount,
            foldersDeleted: deletedFoldersCount,
            databaseRecords: this.changes,
            errors: errors.length
          },
          errors: errors.length > 0 ? errors : undefined
        });
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

function startupCleanup() {
  cleanupOldStagingFiles();
}

// ============================================
// GHTK API PROXY ENDPOINTS
// ============================================

/**
 * POST /api/shipping/ghtk/calculate-fee
 * Proxy to calculate GHTK shipping fee
 */
app.post('/api/shipping/ghtk/calculate-fee', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { apiToken, partnerCode, ...params } = req.body;

    console.log(`[GHTK-${requestId}] 📥 Calculate fee request started:`, {
      timestamp: new Date().toISOString(),
      hasToken: !!apiToken,
      partnerCode,
      params: {
        ...params,
        // Mask sensitive data
        apiToken: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing'
      }
    });

    if (!apiToken) {
      console.log(`[GHTK-${requestId}] ❌ Missing API Token`);
      return res.status(400).json({ error: 'API Token is required' });
    }

    // ✅ Weight should already be in GRAMS from frontend
    // Just validate, no conversion needed
    if (params.weight !== undefined) {
      console.log(`[GHTK-${requestId}] 📦 Weight: ${params.weight} grams`);
      
      // ✅ Validate weight (GHTK max is around 30kg = 30000g)
      if (params.weight > 30000) {
        console.log(`[GHTK-${requestId}] ❌ Weight too large: ${params.weight}g (max 30000g)`);
        return res.status(400).json({ 
          error: 'Weight exceeds maximum limit',
          maxWeight: '30kg (30000 grams)',
          receivedWeight: `${params.weight}g`
        });
      }
    }

    // ❌ IMPORTANT: Remove 'tags' parameter - GHTK calculate fee API does NOT support it
    // Tags are only for order creation (/services/shipment/order), not fee calculation
    const { tags, subTags, ...cleanParams } = params;
    
    if (tags || subTags) {
      console.log(`[GHTK-${requestId}] ⚠️  Removed unsupported params:`, { 
        tags, 
        subTags,
        note: 'Tags only work in order creation API, not fee calculation'
      });
    }

    // Build query string (without tags)
    const url = new URL('https://services.giaohangtietkiem.vn/services/shipment/fee');
    Object.entries(cleanParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // ✅ Special handling for arrays - append each item separately
        if (Array.isArray(value)) {
          value.forEach(item => {
            url.searchParams.append(key, String(item));
          });
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    console.log(`[GHTK-${requestId}] 🌐 Making API request to:`, {
      url: url.toString(),
      fullURL: url.href,
      params: Object.fromEntries(url.searchParams),
      headers: {
        Token: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing',
        'X-Client-Source': partnerCode || ''
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
    });

    // Get response as text first to handle HTML errors
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // GHTK returned HTML error page
      console.error(`[GHTK-${requestId}] ❌ GHTK returned HTML error:`, {
        status: response.status,
        statusText: response.statusText,
        htmlPreview: responseText.substring(0, 500)
      });
      
      return res.status(500).json({ 
        error: 'GHTK API error',
        status: response.status,
        message: 'GHTK returned HTML error page instead of JSON',
        htmlPreview: responseText.substring(0, 500),
        requestUrl: url.toString()
      });
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-${requestId}] 📤 Calculate fee response (${duration}ms):`, {
      status: response.status,
      success: data.success,
      hasData: !!data.data,
      dataType: typeof data.data,
      errorMessage: data.message,
      requestWeight: params.weight,
      responseFee: data.fee?.fee,
      fullResponse: data
    });

    // ✅ Log response GHTK trả về (giữ nguyên format)
    if (data.success && data.fee) {
      console.log(`[GHTK-${requestId}] 📊 GHTK Fee Response:`, data.fee);
      
      // ⚠️ Log cảnh báo nếu không có delivery_type
      if (!data.fee.delivery_type) {
        console.warn(`[GHTK-${requestId}] ⚠️  WARNING: Response không có delivery_type! Có thể gây lỗi khi tạo đơn.`);
      }
    } else if (!data.success) {
      console.error(`[GHTK-${requestId}] ❌ Tính phí thất bại:`, {
        message: data.message,
        errorCode: data.error_code,
        fullError: data
      });
    }

    res.json(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-${requestId}] ❌ Calculate fee error (${duration}ms):`, {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/shipping/ghtk/solutions
 * Get GAM solutions list
 */
app.get('/api/shipping/ghtk/solutions', async (req, res) => {
  try {
    const { apiToken, partnerCode } = req.query;

    console.log('[GHTK Proxy] Get solutions request:', {
      hasToken: !!apiToken,
      partnerCode
    });

    if (!apiToken) {
      return res.status(400).json({ error: 'API Token is required' });
    }

    // Try different base URLs for GHTK API
    const urls = [
      'https://services.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
      'https://khachhang.giaohangtietkiem.vn/open/api/v1/shop/solution/list',
      'https://api.ghtk.vn/open/api/v1/shop/solution/list'
    ];

    let lastError = null;
    
    for (const url of urls) {
      try {
        console.log(`[GHTK Proxy] Trying URL: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Token': apiToken,
            'X-Client-Source': partnerCode || 'GHTK',
            'Content-Type': 'application/json',
          },
        });

        // Get response text first to check if it's JSON
        const responseText = await response.text();
        console.log('[GHTK Proxy] Raw response:', {
          url,
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          bodyPreview: responseText.substring(0, 200)
        });

        // If 404, try next URL
        if (response.status === 404) {
          console.log('[GHTK Proxy] 404 - trying next URL...');
          continue;
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('[GHTK Proxy] JSON parse error:', parseError.message);
          lastError = {
            error: 'Invalid response from GHTK API',
            details: responseText.substring(0, 500),
            status: response.status,
            url
          };
          continue;
        }
        
        console.log('[GHTK Proxy] Get solutions SUCCESS:', {
          url,
          success: data.success,
          solutionsCount: data.data?.length || 0
        });

        return res.json(data);
        
      } catch (error) {
        console.error(`[GHTK Proxy] Error with ${url}:`, error.message);
        lastError = { error: error.message, url };
      }
    }
    
    // If we get here, all URLs failed
    return res.status(500).json({
      error: 'All GHTK API endpoints failed',
      lastError,
      triedUrls: urls
    });
  } catch (error) {
    console.error('[GHTK Proxy] Get solutions error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/shipping/ghtk/create-order
 * Proxy to create GHTK order
 */
app.post('/api/shipping/ghtk/create-order', async (req, res) => {
  try {
    const { apiToken, partnerCode, ...orderData } = req.body;

    if (!apiToken) {
      return res.status(400).json({ error: 'API Token is required' });
    }

    console.log('[GHTK Proxy] Create order request:', {
      hasToken: !!apiToken,
      partnerCode,
      pickAddress: orderData.pick_address?.address,
      toAddress: orderData.pick_address?.address
    });

    const response = await fetch('https://services.giaohangtietkiem.vn/services/shipment/order/?ver=1.5', {
      method: 'POST',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    console.log('[GHTK Proxy] Create order response:', {
      status: response.status,
      success: data.success,
      order: data.order?.label
    });

    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/shipping/ghtk/submit-order
 * Alternative endpoint for submit order (same as create-order but different naming)
 */
app.post('/api/shipping/ghtk/submit-order', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { apiToken, partnerCode, ...orderParams } = req.body;

    console.log(`[GHTK-SUBMIT-${requestId}] 📥 Submit order request:`, {
      timestamp: new Date().toISOString(),
      hasToken: !!apiToken,
      partnerCode,
      orderId: orderParams.id,
      productsCount: orderParams.products?.length,
      pickProvince: orderParams.pick_province,
      pickDistrict: orderParams.pick_district,
      pickAddressId: orderParams.pick_address_id,
      deliveryProvince: orderParams.province,
      deliveryDistrict: orderParams.district,
      deliveryWard: orderParams.ward,
      hamlet: orderParams.hamlet,
      street: orderParams.street,
      transport: orderParams.transport,
      pickDate: orderParams.pick_date,
      deliverDate: orderParams.deliver_date,
      pickWorkShift: orderParams.pick_work_shift,
      deliverWorkShift: orderParams.deliver_work_shift,
      totalBox: orderParams.total_box,
      tags: orderParams.tags,
      weight: orderParams.products?.reduce((sum, p) => sum + (p.weight * p.quantity), 0),
      fullParams: orderParams
    });

    if (!apiToken) {
      console.log(`[GHTK-SUBMIT-${requestId}] ❌ Missing API Token`);
      return res.status(400).json({ 
        success: false,
        error: 'API Token is required' 
      });
    }

    if (!partnerCode) {
      console.log(`[GHTK-SUBMIT-${requestId}] ⚠️  Missing Partner Code`);
    }

    // ⚠️ IMPORTANT: GHTK Submit Order API uses KG, not GRAM!
    // Frontend sends weight in GRAM, we must convert to KG
    const productsInKg = (orderParams.products || []).map(p => ({
      ...p,
      weight: p.weight / 1000 // Convert gram to KG
    }));
    
    // Calculate total weight in KG from user input (if provided)
    const totalWeightKg = orderParams.total_weight ? (orderParams.total_weight / 1000) : null;
    
    // Build order payload according to GHTK API spec
    const orderPayload = {
      products: productsInKg, // ✅ Weight in KG for submit order API
      order: {
        id: orderParams.id,
        
        // ✅ CONDITIONAL PICKUP INFO - Only include fields with values
        ...(orderParams.pick_address_id ? { pick_address_id: orderParams.pick_address_id } : {}),
        ...(orderParams.pick_name ? { pick_name: orderParams.pick_name } : {}),
        ...(orderParams.pick_address ? { pick_address: orderParams.pick_address } : {}),
        ...(orderParams.pick_province ? { pick_province: orderParams.pick_province } : {}),
        ...(orderParams.pick_district ? { pick_district: orderParams.pick_district } : {}),
        ...(orderParams.pick_ward ? { pick_ward: orderParams.pick_ward } : {}),
        ...(orderParams.pick_street ? { pick_street: orderParams.pick_street } : {}),
        ...(orderParams.pick_tel ? { pick_tel: orderParams.pick_tel } : {}),
        
        // Customer delivery info
        tel: orderParams.tel,
        name: orderParams.name,
        address: orderParams.address,
        province: orderParams.province,
        district: orderParams.district,
        ward: orderParams.ward,
        street: orderParams.street, // ✅ Customer street (if no hamlet)
        hamlet: orderParams.hamlet || 'Khác', // ✅ Specific address or "Khác"
        
        // Payment & Value
        is_freeship: orderParams.is_freeship !== undefined ? orderParams.is_freeship : 1,
        pick_money: orderParams.pick_money || 0,
        value: orderParams.value || 0,
        
        // ✅ Tag 19: not_delivered_fee (0 < value <= 20,000,000)
        ...(orderParams.tags?.includes(19) && orderParams.not_delivered_fee ? {
          not_delivered_fee: orderParams.not_delivered_fee
        } : {}),
        
        // Shipping options
        note: orderParams.note || '',
        total_weight: totalWeightKg, // ✅ Total weight from user input (in KG)
        total_box: orderParams.total_box, // ✅ Total number of boxes
        transport: orderParams.transport || 'road',
        pick_option: orderParams.pick_option || 'post',
        pick_session: orderParams.pick_session || 0,
        
        // ✅ Dates & shifts
        pick_date: orderParams.pick_date, // YYYY-MM-DD
        deliver_date: orderParams.deliver_date, // YYYY-MM-DD
        pick_work_shift: orderParams.pick_work_shift, // 1=sáng, 2=chiều
        deliver_work_shift: orderParams.deliver_work_shift, // 1=sáng, 2=chiều
        
        // Tags
        tags: orderParams.tags || [],
        
        // ✅ CONDITIONAL RETURN ADDRESS - Only include if provided
        ...(orderParams.return_name || orderParams.pick_name ? { 
          return_name: orderParams.return_name || orderParams.pick_name 
        } : {}),
        ...(orderParams.return_address || orderParams.pick_address ? { 
          return_address: orderParams.return_address || orderParams.pick_address 
        } : {}),
        ...(orderParams.return_province || orderParams.pick_province ? { 
          return_province: orderParams.return_province || orderParams.pick_province 
        } : {}),
        ...(orderParams.return_district || orderParams.pick_district ? { 
          return_district: orderParams.return_district || orderParams.pick_district 
        } : {}),
        ...(orderParams.return_ward || orderParams.pick_ward ? { 
          return_ward: orderParams.return_ward || orderParams.pick_ward 
        } : {}),
        ...(orderParams.return_tel || orderParams.pick_tel ? { 
          return_tel: orderParams.return_tel || orderParams.pick_tel 
        } : {}),
      }
    };

    console.log(`[GHTK-SUBMIT-${requestId}] 🌐 Calling GHTK API:`, {
      url: 'https://services.giaohangtietkiem.vn/services/shipment/order/?ver=1.5',
      method: 'POST',
      productsCount: orderPayload.products.length,
      orderId: orderPayload.order.id,
      totalWeightKg: orderPayload.order.total_weight,
      totalBox: orderPayload.order.total_box,
      transport: orderPayload.order.transport,
      pickDate: orderPayload.order.pick_date,
      deliverDate: orderPayload.order.deliver_date,
      pickWorkShift: orderPayload.order.pick_work_shift,
      deliverWorkShift: orderPayload.order.deliver_work_shift,
      hamlet: orderPayload.order.hamlet,
      street: orderPayload.order.street,
      tags: orderPayload.order.tags,
      pickAddressId: orderPayload.order.pick_address_id,
      fullPayload: orderPayload
    });
    
    console.log(`[GHTK-SUBMIT-${requestId}] 📋 Full JSON Payload:`, JSON.stringify(orderPayload, null, 2));

    const response = await fetch('https://services.giaohangtietkiem.vn/services/shipment/order/?ver=1.5', {
      method: 'POST',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    // Get response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[GHTK-SUBMIT-${requestId}] ❌ JSON parse error:`, {
        error: parseError.message,
        responsePreview: responseText.substring(0, 500)
      });
      
      return res.status(500).json({ 
        success: false,
        error: 'GHTK API returned invalid response',
        details: responseText.substring(0, 500)
      });
    }
    
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-SUBMIT-${requestId}] ✅ Submit order response (${duration}ms):`, {
      httpStatus: response.status,
      success: data.success,
      message: data.message,
      hasOrder: !!data.order,
      order: data.order ? {
        label: data.order.label,
        partner_id: data.order.partner_id,
        tracking_id: data.order.tracking_id,
        area: data.order.area,
        fee: data.order.fee,
        insurance_fee: data.order.insurance_fee,
        estimated_pick_time: data.order.estimated_pick_time,
        estimated_deliver_time: data.order.estimated_deliver_time,
        status_id: data.order.status_id
      } : null,
      error: data.error,
      fullResponse: data
    });
    
    // Also log as formatted JSON for easy copy-paste
    console.log(`[GHTK-SUBMIT-${requestId}] 📋 Full Response JSON:`);
    console.log(JSON.stringify(data, null, 2));

    // Return response from GHTK
    res.json(data);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-SUBMIT-${requestId}] ❌ Submit order error (${duration}ms):`, {
      errorType: error.constructor.name,
      errorMessage: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Check server logs for full error details'
    });
  }
});

/**
 * GET /api/shipping/ghtk/list-pick-addresses
 * Proxy to get list of registered pickup addresses from GHTK
 */
app.get('/api/shipping/ghtk/list-pick-addresses', async (req, res) => {
  try {
    const { apiToken, partnerCode } = req.query;

    console.log('[GHTK Proxy] 📥 Get pick addresses list request:', {
      hasToken: !!apiToken,
      tokenPreview: apiToken ? `${apiToken.substring(0, 10)}...` : 'MISSING',
      partnerCode: partnerCode || 'NONE'
    });

    if (!apiToken) {
      console.log('[GHTK Proxy] ❌ Missing API Token');
      return res.status(400).json({ 
        success: false,
        error: 'API Token is required' 
      });
    }

    const url = 'https://services.giaohangtietkiem.vn/services/shipment/list_pick_add';
    console.log('[GHTK Proxy] 🌐 Calling GHTK:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json'
      },
    });

    console.log('[GHTK Proxy] 📡 GHTK response status:', response.status);

    const data = await response.json();
    
    console.log('[GHTK Proxy] 📦 GHTK response data:', {
      success: data.success,
      message: data.message || 'No message',
      dataExists: !!data.data,
      isArray: Array.isArray(data.data),
      count: data.data?.length || 0,
      firstItem: data.data?.[0]
    });

    // Always return the response from GHTK
    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] ❌ Get pick addresses error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/shipping/ghtk/get-specific-addresses
 * Get specific addresses (street level) from GHTK
 * Query params: province, district, ward_street, apiToken
 */
app.get('/api/shipping/ghtk/get-specific-addresses', async (req, res) => {
  try {
    const { province, district, ward_street, apiToken } = req.query;

    console.log('[GHTK Proxy] 📥 Get specific addresses request:', {
      province,
      district,
      ward_street,
      hasToken: !!apiToken
    });

    if (!province || !district || !ward_street) {
      return res.status(400).json({ 
        success: false,
        error: 'Province, district, and ward_street are required' 
      });
    }

    if (!apiToken) {
      return res.status(400).json({ 
        success: false,
        error: 'API Token is required' 
      });
    }

    const url = `https://services.giaohangtietkiem.vn/services/address/getAddressLevel4?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&ward_street=${encodeURIComponent(ward_street)}`;
    console.log('[GHTK Proxy] 🌐 Calling GHTK:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'Content-Type': 'application/json'
      },
    });

    console.log('[GHTK Proxy] 📡 GHTK response status:', response.status);

    const data = await response.json();
    
    console.log('[GHTK Proxy] 📦 GHTK response data:', {
      success: data.success,
      message: data.message || 'No message',
      dataExists: !!data.data,
      isArray: Array.isArray(data.data),
      count: data.data?.length || 0
    });

    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] ❌ Get specific addresses error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/shipping/ghtk/order-status/:trackingCode
 * Proxy to get GHTK order status
 */
app.get('/api/shipping/ghtk/order-status/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const { apiToken, partnerCode } = req.query;

    if (!apiToken) {
      return res.status(400).json({ error: 'API Token is required' });
    }

    console.log('[GHTK Proxy] Get order status:', trackingCode);

    const response = await fetch(`https://services.giaohangtietkiem.vn/services/shipment/v2/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log('[GHTK Proxy] Order status response:', {
      status: response.status,
      success: data.success,
      orderStatus: data.order?.status
    });

    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] Get order status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/shipping/ghtk/track/:trackingCode
 * Simplified tracking endpoint (uses default GHTK credentials from env)
 * Used by auto-sync service
 */
app.get('/api/shipping/ghtk/track/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    
    // Use default GHTK credentials from environment
    const apiToken = process.env.GHTK_API_TOKEN;
    const partnerCode = process.env.GHTK_PARTNER_CODE;

    if (!apiToken) {
      return res.status(500).json({ 
        success: false,
        error: 'GHTK API Token not configured in server environment' 
      });
    }

    console.log('[GHTK Track] Tracking:', trackingCode);

    const response = await fetch(`https://services.giaohangtietkiem.vn/services/shipment/v2/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log('[GHTK Track] Response:', {
      status: response.status,
      success: data.success,
      orderStatus: data.order?.status
    });

    res.json(data);
  } catch (error) {
    console.error('[GHTK Track] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/shipping/ghtk/print-label/:trackingCode
 * Proxy to get GHTK shipping label (returns PDF URL or base64)
 */
app.get('/api/shipping/ghtk/print-label/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const { apiToken, partnerCode } = req.query;

    if (!apiToken) {
      return res.status(400).json({ error: 'API Token is required' });
    }

    console.log('[GHTK Proxy] Print label:', trackingCode);

    const response = await fetch(`https://services.giaohangtietkiem.vn/services/label/${trackingCode}`, {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log('[GHTK Proxy] Print label response:', {
      status: response.status,
      success: data.success,
      hasLabel: !!data.label
    });

    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] Print label error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/shipping/ghtk/cancel-order
 * Proxy to cancel GHTK shipment order
 * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
 */
app.post('/api/shipping/ghtk/cancel-order', async (req, res) => {
  try {
    const { trackingCode, apiToken, partnerCode } = req.body;

    // ✅ Client sẽ gửi token lên (lấy từ shipping_partners_config trong localStorage)
    if (!apiToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.' 
      });
    }

    if (!trackingCode) {
      return res.status(400).json({ 
        success: false,
        message: 'Mã vận đơn không được để trống' 
      });
    }

    console.log('[GHTK Proxy] Cancel order:', trackingCode);

    const response = await fetch(`https://services.giaohangtietkiem.vn/services/shipment/cancel/${trackingCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log('[GHTK Proxy] Cancel order response:', {
      status: response.status,
      success: data.success,
      message: data.message
    });

    // ✅ Trả về response từ GHTK (bao gồm cả success: false)
    res.json(data);
  } catch (error) {
    console.error('[GHTK Proxy] Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ============================================
// GHTK ERROR CODE HANDLER
// ============================================

/**
 * Map GHTK error codes to Vietnamese messages
 */
function getGHTKErrorMessage(errorCode) {
  const errorMessages = {
    'ERROR_ADDRESS': 'Địa chỉ không hợp lệ hoặc nằm ngoài vùng phục vụ',
    'ERROR_PICK_ADDRESS': 'Địa chỉ lấy hàng không hợp lệ',
    'ERROR_WEIGHT': 'Khối lượng đơn hàng không hợp lệ',
    'ERROR_VALUE': 'Giá trị đơn hàng không hợp lệ',
    'ERROR_ORDER_EXISTED': 'Mã đơn hàng đã tồn tại trên hệ thống',
    'ERROR_TOKEN': 'Token không hợp lệ hoặc đã hết hạn',
    'ERROR_PERMISSION': 'Không có quyền thực hiện thao tác này',
    'ERROR_ORDER_NOT_FOUND': 'Không tìm thấy đơn hàng',
    'ERROR_CANCEL_TIMEOUT': 'Không thể hủy đơn (đơn đã được lấy hàng)',
    'ERROR_PROVINCE': 'Tỉnh/Thành phố không hợp lệ',
    'ERROR_DISTRICT': 'Quận/Huyện không hợp lệ',
    'ERROR_WARD': 'Phường/Xã không hợp lệ',
    'ERROR_PICK_SHIFT': 'Ca lấy hàng không hợp lệ',
    'ERROR_DELIVER_SHIFT': 'Ca giao hàng không hợp lệ',
    'ERROR_COD': 'Số tiền thu hộ vượt quá giới hạn',
  };

  return errorMessages[errorCode] || 'Lỗi không xác định từ GHTK';
}

/**
 * GET /api/shipping/ghtk/test-connection
 * Test GHTK API connection with token
 */
app.get('/api/shipping/ghtk/test-connection', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  try {
    const { apiToken, partnerCode } = req.query;

    console.log(`[GHTK-TEST-${requestId}] 🔍 Testing connection:`, {
      timestamp: new Date().toISOString(),
      hasToken: !!apiToken,
      partnerCode,
      tokenPreview: apiToken ? `${apiToken.substring(0, 8)}...` : 'missing'
    });

    if (!apiToken) {
      console.log(`[GHTK-TEST-${requestId}] ❌ Missing API Token`);
      return res.status(400).json({ error: 'API Token is required' });
    }

    console.log(`[GHTK-TEST-${requestId}] 🌐 Making test request to GHTK list_pick_add`);

    // Test với endpoint đơn giản nhất - list pick addresses
    const response = await fetch('https://services.giaohangtietkiem.vn/services/shipment/list_pick_add', {
      method: 'GET',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    const duration = Date.now() - startTime;
    
    console.log(`[GHTK-TEST-${requestId}] 📤 Test connection response (${duration}ms):`, {
      status: response.status,
      success: data.success,
      message: data.message || 'OK',
      dataStructure: typeof data.data,
      dataIsArray: Array.isArray(data.data),
      dataLength: data.data?.length,
      fullData: data
    });

    if (response.ok && data.success !== false) {
      // GHTK trả về data là array trực tiếp
      res.json({
        success: true,
        message: 'Kết nối GHTK thành công',
        status: response.status,
        data: {
          pickAddresses: data.data || [], // data.data là array địa chỉ
          pickAddressCount: data.data?.length || 0,
          apiBase: 'https://services.giaohangtietkiem.vn'
        }
      });
    } else {
      console.log(`[GHTK-TEST-${requestId}] ❌ Connection failed:`, {
        status: response.status,
        message: data.message,
        data: data
      });
      res.status(response.status || 400).json({
        success: false,
        message: data.message || 'Kết nối thất bại',
        status: response.status,
        error: data
      });
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GHTK-TEST-${requestId}] ❌ Connection test error (${duration}ms):`, {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối: ' + error.message,
      error: error.message
    });
  }
});

/**
 * POST /api/shipping/ghtk/parse-error
 * Helper endpoint to parse GHTK error responses
 */
app.post('/api/shipping/ghtk/parse-error', (req, res) => {
  try {
    const { error } = req.body;
    
    if (!error) {
      return res.json({ message: 'Không có lỗi' });
    }

    const errorCode = error.code || error.error || 'UNKNOWN';
    const message = getGHTKErrorMessage(errorCode);

    res.json({
      code: errorCode,
      message: message,
      originalError: error
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GHTK WEBHOOK ENDPOINT
// ============================================

/**
 * Verify GHTK Webhook Signature
 * Security layer to prevent fake webhook attacks
 * 
 * GHTK signature format (if they provide one):
 * - Header: X-GHTK-Signature or X-Hub-Signature-256
 * - Algorithm: HMAC-SHA256
 * - Payload: JSON stringified request body
 * 
 * NOTE: As of Nov 2025, GHTK doesn't officially document webhook signatures.
 * This is a defensive implementation that can be activated when they add it.
 */
function verifyGHTKWebhookSignature(req) {
  try {
    const WEBHOOK_SECRET = process.env.GHTK_WEBHOOK_SECRET;
    
    // If no secret is configured, skip verification (development mode)
    if (!WEBHOOK_SECRET) {
      console.warn('[GHTK Webhook Security] ⚠️ No GHTK_WEBHOOK_SECRET configured - skipping signature verification');
      return true;
    }
    
    // Check for signature in headers (multiple possible header names)
    const signature = req.headers['x-ghtk-signature'] || 
                      req.headers['x-hub-signature-256'] ||
                      req.headers['x-webhook-signature'];
    
    if (!signature) {
      console.error('[GHTK Webhook Security] ❌ No signature header found');
      return false;
    }
    
    // Compute HMAC-SHA256 of request body
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(payload);
    const expectedSignature = 'sha256=' + hmac.digest('hex');
    
    // Compare signatures (constant-time comparison to prevent timing attacks)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    
    if (!isValid) {
      console.error('[GHTK Webhook Security] ❌ Invalid signature:', {
        received: signature.substring(0, 20) + '...',
        expected: expectedSignature.substring(0, 20) + '...'
      });
    } else {
      console.log('[GHTK Webhook Security] ✅ Signature verified');
    }
    
    return isValid;
  } catch (error) {
    console.error('[GHTK Webhook Security] ❌ Signature verification error:', error.message);
    return false;
  }
}

/**
 * Check if request is from GHTK IP whitelist
 * Additional security layer (optional)
 * 
 * GHTK official IPs (update this list from GHTK documentation):
 * - 103.x.x.x (example - get actual IPs from GHTK)
 * - 118.x.x.x
 */
function isGHTKIP(req) {
  const GHTK_IPS = process.env.GHTK_WHITELIST_IPS?.split(',') || [];
  
  // If no whitelist configured, allow all (development mode)
  if (GHTK_IPS.length === 0) {
    return true;
  }
  
  const clientIP = req.ip || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.connection.remoteAddress;
  
  const isAllowed = GHTK_IPS.includes(clientIP);
  
  if (!isAllowed) {
    console.warn('[GHTK Webhook Security] ⚠️ Request from non-whitelisted IP:', clientIP);
  }
  
  return isAllowed;
}

/**
 * Rate limiting for webhook endpoint
 * Prevent spam/DDoS attacks
 */
const webhookRateLimiter = (() => {
  const requests = new Map(); // trackingCode -> timestamp[]
  const MAX_REQUESTS_PER_MINUTE = 10;
  const CLEANUP_INTERVAL = 60000; // 1 minute
  
  // Cleanup old entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests.entries()) {
      const recent = timestamps.filter(t => now - t < CLEANUP_INTERVAL);
      if (recent.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, recent);
      }
    }
  }, CLEANUP_INTERVAL);
  
  return {
    isAllowed(trackingCode) {
      const now = Date.now();
      const timestamps = requests.get(trackingCode) || [];
      const recentRequests = timestamps.filter(t => now - t < CLEANUP_INTERVAL);
      
      if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
        console.warn('[GHTK Webhook Security] ⚠️ Rate limit exceeded for:', trackingCode);
        return false;
      }
      
      recentRequests.push(now);
      requests.set(trackingCode, recentRequests);
      return true;
    }
  };
})();

/**
 * POST /api/shipping/ghtk/webhook
 * Receive status updates from GHTK
 * 
 * GHTK will POST to this endpoint when order status changes
 * Must return HTTP 200 for GHTK to mark as successful delivery
 * 
 * Security features:
 * - Webhook signature verification (HMAC-SHA256)
 * - IP whitelist validation (optional)
 * - Rate limiting (10 requests/min per tracking code)
 */
app.post('/api/shipping/ghtk/webhook', (req, res) => {
  try {
    console.log('[GHTK Webhook] Received update:', JSON.stringify(req.body, null, 2));
    
    const {
      label_id,          // GHTK tracking code
      partner_id,        // Our order ID
      status_id,         // Status code (1-21, etc.)
      action_time,       // ISO timestamp
      reason_code,       // Reason code (100-144)
      reason,            // Reason text
      weight,            // Actual weight (kg)
      fee,               // Actual shipping fee
      pick_money,        // COD amount
      return_part_package // 0 or 1
    } = req.body;
    
    // ============================================
    // SECURITY LAYER 1: Validate Required Fields
    // ============================================
    if (!label_id || status_id === undefined) {
      console.error('[GHTK Webhook] ❌ Missing required fields:', { label_id, status_id });
      // Still return 200 to prevent GHTK from retrying
      return res.status(200).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // ============================================
    // SECURITY LAYER 2: Rate Limiting
    // ============================================
    if (!webhookRateLimiter.isAllowed(label_id)) {
      console.warn('[GHTK Webhook] ⚠️ Rate limit exceeded for:', label_id);
      return res.status(429).json({ 
        success: false, 
        message: 'Too many requests' 
      });
    }
    
    // ============================================
    // SECURITY LAYER 3: IP Whitelist (Optional)
    // ============================================
    if (!isGHTKIP(req)) {
      console.error('[GHTK Webhook] ❌ Request from non-whitelisted IP');
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden' 
      });
    }
    
    // ============================================
    // SECURITY LAYER 4: Webhook Signature Verification
    // ============================================
    // Enable this in production by setting GHTK_WEBHOOK_SECRET
    const ENABLE_SIGNATURE_CHECK = process.env.GHTK_WEBHOOK_SECRET ? true : false;
    
    if (ENABLE_SIGNATURE_CHECK) {
      if (!verifyGHTKWebhookSignature(req)) {
        console.error('[GHTK Webhook] ❌ Invalid signature');
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid signature' 
        });
      }
    }
    
    // ============================================
    // PROCESS WEBHOOK
    // ============================================
    console.log('[GHTK Webhook] ✅ Security checks passed. Processing:', {
      trackingCode: label_id,
      orderId: partner_id,
      statusId: status_id,
      reasonCode: reason_code,
      actionTime: action_time
    });
    
    // Store webhook payload for frontend to fetch
    // In production, this would go to database or message queue
    if (!global.ghtkWebhookQueue) {
      global.ghtkWebhookQueue = [];
    }
    
    global.ghtkWebhookQueue.push({
      label_id,
      partner_id,
      status_id: parseInt(status_id),
      action_time,
      reason_code,
      reason,
      weight: weight ? parseFloat(weight) : undefined,
      fee: fee ? parseInt(fee) : undefined,
      pick_money: pick_money ? parseInt(pick_money) : undefined,
      return_part_package: return_part_package ? parseInt(return_part_package) : 0,
      receivedAt: new Date().toISOString()
    });
    
    // Keep only last 100 webhooks in memory
    if (global.ghtkWebhookQueue.length > 100) {
      global.ghtkWebhookQueue.shift();
    }
    
    console.log('[GHTK Webhook] ✅ Stored in queue. Queue size:', global.ghtkWebhookQueue.length);
    
    // CRITICAL: Must return HTTP 200 for GHTK to mark as successful
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully' 
    });
    
  } catch (error) {
    console.error('[GHTK Webhook] Error processing webhook:', error);
    
    // Still return 200 to prevent infinite retries
    res.status(200).json({ 
      success: false, 
      message: 'Error processing webhook',
      error: error.message 
    });
  }
});

/**
 * GET /api/shipping/ghtk/webhook/poll
 * Frontend polls this endpoint to get webhook updates
 * Returns and removes webhooks from queue
 */
app.get('/api/shipping/ghtk/webhook/poll', (req, res) => {
  try {
    if (!global.ghtkWebhookQueue || global.ghtkWebhookQueue.length === 0) {
      return res.json({ 
        success: true, 
        updates: [] 
      });
    }
    
    // Return all pending webhooks and clear queue
    const updates = [...global.ghtkWebhookQueue];
    global.ghtkWebhookQueue = [];
    
    console.log('[GHTK Webhook] Polled updates, returning', updates.length, 'items');
    
    res.json({ 
      success: true, 
      updates 
    });
    
  } catch (error) {
    console.error('[GHTK Webhook] Error polling webhooks:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// STATIC FILES & TEST PAGE
// ============================================

// Serve test page
app.get('/api-test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'api-test.html'));
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  console.log(`[HEALTH] Health check requested - Server uptime: ${Math.floor(uptime)}s`);
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
    },
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    apis: {
      ghtk: {
        calculateFee: '/api/shipping/ghtk/calculate-fee',
        testConnection: '/api/shipping/ghtk/test-connection',
        createOrder: '/api/shipping/ghtk/create-order'
      }
    }
  });
});

// ============================================
// START SERVER
// ============================================

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  console.log(`🚀 GHTK API Proxy enabled`);
  
  // Run startup cleanup
  startupCleanup();
  
  // Schedule periodic cleanup (every 6 hours)
  setInterval(cleanupOldStagingFiles, 6 * 60 * 60 * 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      // Silent
    }
    process.exit(0);
  });
});