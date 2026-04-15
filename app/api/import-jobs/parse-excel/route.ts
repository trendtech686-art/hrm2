import { requireAuth, apiError } from '@/lib/api-utils'
import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import fs from 'fs/promises'
import path from 'path'

// Allow up to 60s for parsing large files
export const maxDuration = 60

const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp')

function getTempFilePath(uploadId: string): string {
  // Sanitize uploadId to prevent path traversal
  const safeId = uploadId.replace(/[^a-zA-Z0-9-]/g, '')
  if (!safeId || safeId.length < 10) throw new Error('Invalid uploadId')
  return path.join(TEMP_DIR, `parse-${safeId}.xlsx`)
}

/**
 * PUT /api/import-jobs/parse-excel
 * 
 * Receives a file chunk and appends it to a temp file.
 * Headers: X-Upload-Id, X-Chunk-Index, X-Total-Chunks
 */
export async function PUT(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const uploadId = request.headers.get('x-upload-id')
    const chunkIndex = parseInt(request.headers.get('x-chunk-index') || '', 10)
    const totalChunks = parseInt(request.headers.get('x-total-chunks') || '', 10)

    if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return apiError('Missing upload headers', 400)
    }

    await fs.mkdir(TEMP_DIR, { recursive: true })
    const filePath = getTempFilePath(uploadId)

    // Read chunk from request body
    const arrayBuffer = await request.arrayBuffer()
    const chunkBuffer = Buffer.from(arrayBuffer)

    // For first chunk, create file; for subsequent chunks, append
    if (chunkIndex === 0) {
      await fs.writeFile(filePath, chunkBuffer)
    } else {
      await fs.appendFile(filePath, chunkBuffer)
    }

    return NextResponse.json({ 
      ok: true, 
      chunk: chunkIndex + 1, 
      total: totalChunks 
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định'
    return apiError(`Lỗi upload chunk: ${message}`, 500)
  }
}

/**
 * POST /api/import-jobs/parse-excel
 * 
 * Parses an uploaded Excel file using ExcelJS streaming reader.
 * Body: JSON { uploadId }
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  let tempFilePath: string | null = null

  try {
    const { uploadId } = await request.json()
    if (!uploadId) return apiError('Missing uploadId', 400)

    tempFilePath = getTempFilePath(uploadId)
    
    // Verify file exists
    const stat = await fs.stat(tempFilePath).catch(() => null)
    if (!stat) return apiError('File không tồn tại. Vui lòng upload lại.', 400)

    // Use file-path based streaming reader (handles 45MB+ files)
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(tempFilePath, {})
    
    let headerRowNum = -1
    const headers: string[] = []
    const rows: Record<string, unknown>[] = []
    
    for await (const worksheet of workbookReader) {
      for await (const row of worksheet) {
        const rowNumber = row.number
        
        // Auto-detect header row: look for 'STT' + a known ID column
        if (headerRowNum === -1) {
          const values: string[] = []
          row.eachCell({ includeEmpty: false }, (cell) => {
            values.push(String(getCellValue(cell.value)).trim())
          })
          
          const hasKnownIdCol = values.includes('Mã ĐH') || values.includes('Mã đơn nhập hàng')
          if (values.includes('STT') && hasKnownIdCol) {
            headerRowNum = rowNumber
            const headerCount: Record<string, number> = {}
            row.eachCell({ includeEmpty: true }, (cell, colNum) => {
              let h = String(getCellValue(cell.value)).trim()
              // Deduplicate header names by appending _2, _3 etc.
              if (headerCount[h]) {
                headerCount[h]++
                h = `${h}_${headerCount[h]}`
              } else {
                headerCount[h] = 1
              }
              headers[colNum] = h
            })
          }
          continue
        }
        
        // Parse data rows
        if (rowNumber <= headerRowNum) continue
        
        const rowData: Record<string, unknown> = {}
        let hasData = false
        
        row.eachCell({ includeEmpty: false }, (cell, colNum) => {
          const header = headers[colNum]
          if (!header) return
          
          let value = getCellValue(cell.value)
          
          // Format dates
          if (value instanceof Date) {
            value = formatDate(value)
          }
          
          rowData[header] = value
          hasData = true
        })
        
        if (hasData) {
          rows.push(rowData)
        }
      }
      break // Only process first worksheet
    }
    
    if (headerRowNum === -1) {
      return apiError('Không tìm thấy dòng tiêu đề (STT, Mã ĐH / Mã đơn nhập hàng) trong file', 400)
    }

    return NextResponse.json({ rows, rowCount: rows.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định'
    return apiError(`Lỗi đọc file Excel: ${message}`, 500)
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      fs.unlink(tempFilePath).catch(() => {})
    }
  }
}

function getCellValue(value: ExcelJS.CellValue): unknown {
  if (value === null || value === undefined) return ''
  
  // Handle rich text
  if (typeof value === 'object' && 'richText' in value) {
    return (value as { richText: Array<{ text: string }> }).richText
      .map(rt => rt.text)
      .join('')
  }
  
  // Handle formula results
  if (typeof value === 'object' && 'result' in value) {
    return (value as { result: unknown }).result
  }
  
  // Handle hyperlinks
  if (typeof value === 'object' && 'hyperlink' in value) {
    return (value as { text: string }).text
  }
  
  return value
}

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
