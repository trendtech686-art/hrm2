/**
 * Barcode & QR Code Generation API
 * GET /api/print/barcode?code=xxx&height=50 → PNG barcode image
 * GET /api/print/qr?text=xxx&size=100 → PNG QR code image
 * 
 * Thay thế external APIs (barcodeapi.org, quickchart.io) bằng local generation
 */

import { NextRequest, NextResponse } from 'next/server'
import bwipjs from 'bwip-js'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'barcode'
  
  if (type === 'qr') {
    return handleQR(searchParams)
  }
  return handleBarcode(searchParams)
}

async function handleBarcode(params: URLSearchParams) {
  const code = params.get('code')
  if (!code) {
    return new NextResponse('Missing code parameter', { status: 400 })
  }
  
  const height = Math.min(Number(params.get('height')) || 50, 200)
  
  try {
    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: code,
      scale: 2,
      height: Math.round(height / 3),
      includetext: false,
    })
    
    return new NextResponse(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch {
    // Fallback: return a simple text image
    return new NextResponse(`Barcode: ${code}`, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

async function handleQR(params: URLSearchParams) {
  const text = params.get('text')
  if (!text) {
    return new NextResponse('Missing text parameter', { status: 400 })
  }
  
  const size = Math.min(Number(params.get('size')) || 100, 500)
  
  try {
    const buffer = await QRCode.toBuffer(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch {
    return new NextResponse(`QR: ${text}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
