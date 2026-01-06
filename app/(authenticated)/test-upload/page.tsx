'use client'

// ═══════════════════════════════════════════════════════════════
// TEST FILE UPLOAD PAGE
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/components/shared/file-upload'
import { AvatarUpload } from '@/components/shared/avatar-upload'
import { UploadedFile } from '@/hooks/use-file-upload'

export default function TestUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  const handleUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files])
  }
  
  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Test File Upload</h1>
      <p className="text-muted-foreground">
        Test các chức năng upload file trong Next.js API Routes
      </p>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Upload File</TabsTrigger>
          <TabsTrigger value="image">Upload Ảnh</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>
        
        {/* General File Upload */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Upload File Tổng Quát</CardTitle>
              <CardDescription>
                Hỗ trợ: PDF, Word, Excel, Text, CSV và ảnh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                entityType="general"
                multiple
                maxFiles={5}
                onUpload={handleUpload}
                onError={(err) => console.error(err)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Image Upload */}
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Upload Ảnh</CardTitle>
              <CardDescription>
                Tự động optimize và tạo thumbnail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                entityType="products"
                entityId="test-product-001"
                isImage
                multiple
                maxFiles={10}
                thumbnail
                resize="large"
                onUpload={handleUpload}
                onError={(err) => console.error(err)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Avatar Upload */}
        <TabsContent value="avatar">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Upload</CardTitle>
              <CardDescription>
                Upload ảnh đại diện cho nhân viên/khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Size: sm</p>
                  <AvatarUpload
                    entityType="employees"
                    entityId="test-emp-001"
                    currentUrl={avatarUrl}
                    name="Nguyễn Văn A"
                    size="sm"
                    onChange={setAvatarUrl}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Size: md</p>
                  <AvatarUpload
                    entityType="employees"
                    entityId="test-emp-001"
                    currentUrl={avatarUrl}
                    name="Nguyễn Văn A"
                    size="md"
                    onChange={setAvatarUrl}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Size: lg</p>
                  <AvatarUpload
                    entityType="employees"
                    entityId="test-emp-001"
                    currentUrl={avatarUrl}
                    name="Nguyễn Văn A"
                    size="lg"
                    onChange={setAvatarUrl}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Size: xl</p>
                  <AvatarUpload
                    entityType="employees"
                    entityId="test-emp-001"
                    currentUrl={avatarUrl}
                    name="Nguyễn Văn A"
                    size="xl"
                    onChange={setAvatarUrl}
                  />
                </div>
              </div>
              
              {avatarUrl && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Avatar URL:</p>
                  <code className="text-xs break-all">{avatarUrl}</code>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Files Đã Upload ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {file.mimeType.startsWith('image/') && file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.originalName}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-background flex items-center justify-center">
                        📄
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{file.originalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.mimeType} • {(file.fileSize / 1024).toFixed(1)} KB
                        {file.width && file.height && ` • ${file.width}×${file.height}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Xem
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
