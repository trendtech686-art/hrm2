/**
 * Sapo Excel Parser
 * 
 * Uploads large Sapo files to server temp storage, then parses via ExcelJS streaming.
 * Uses chunked upload to avoid body size limits.
 * 
 * Server endpoint: POST /api/import-jobs/parse-excel
 */

/**
 * Parse a Sapo Excel file by uploading to server-side streaming parser.
 * Returns an array of objects keyed by column header names.
 */
export async function parseSapoExcelFile(file: File): Promise<Record<string, unknown>[]> {
  // Step 1: Upload file to temp storage using chunked uploads
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const uploadId = crypto.randomUUID()

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const res = await fetch('/api/import-jobs/parse-excel', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Upload-Id': uploadId,
        'X-Chunk-Index': String(i),
        'X-Total-Chunks': String(totalChunks),
      },
      body: chunk,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi upload chunk' }))
      throw new Error(err.error || `Lỗi upload chunk ${i + 1}/${totalChunks}`)
    }
  }

  // Step 2: Parse the uploaded file
  const response = await fetch('/api/import-jobs/parse-excel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Lỗi không xác định' }))
    throw new Error(err.error || `Lỗi server: ${response.status}`)
  }

  const data = await response.json()
  return data.rows
}
