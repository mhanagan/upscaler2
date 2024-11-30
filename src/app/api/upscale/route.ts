import { NextResponse } from 'next/server'
import Replicate from 'replicate'

// Add type for Replicate output
type ReplicateOutput = string | null

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing Replicate API token')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Constants for image constraints
const MAX_TOTAL_PIXELS = 2_096_704 // maximum total pixels based on GPU memory
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

async function validateImage(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.')
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit')
    }

    // Load image to check dimensions
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Use sharp to get image dimensions
    const sharp = (await import('sharp')).default
    const metadata = await sharp(buffer).metadata()
    
    if (metadata.width && metadata.height) {
      const totalPixels = metadata.width * metadata.height
      if (totalPixels > MAX_TOTAL_PIXELS) {
        throw new Error(
          `Image dimensions (${metadata.width}x${metadata.height}) exceed the maximum allowed pixel count. ` +
          `Total pixels: ${totalPixels.toLocaleString()}, Maximum allowed: ${MAX_TOTAL_PIXELS.toLocaleString()}. ` +
          `Please resize your image to smaller dimensions.`
        )
      }
    }

    // Extract format from content-type (e.g., 'image/jpeg' -> 'jpeg')
    const format = contentType.split('/')[1] || 'jpeg'
    // Normalize format names
    return format === 'jpeg' ? 'jpg' : format
  } catch (error: any) {
    console.error('Image validation error:', error)
    throw new Error(`Failed to validate image: ${error.message}`)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imageUrl, userAgent, platform } = body

    // Log request details
    console.log('Processing request:', {
      userAgent,
      platform,
      imageUrl: imageUrl?.substring(0, 50) + '...'
    })

    if (!imageUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Image URL is required',
          details: 'No image URL was provided in the request'
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept'
          }
        }
      )
    }

    try {
      // Pre-fetch the image to verify it's accessible
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
      }

      const inputFormat = await validateImage(imageUrl)
      const outputFormat = ['jpg', 'png'].includes(inputFormat) ? inputFormat : 'jpg'

      console.log('Starting Replicate processing')  // Debug log
      let output: ReplicateOutput
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 45000) // 45 second timeout (shorter than Vercel's 60s)
        })
        
        const replicatePromise = replicate.run(
          "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
          {
            input: {
              image: imageUrl,
              scale: 2,
              face_enhance: false,
              tile: 0,
              output_format: outputFormat
            }
          }
        ) as unknown as ReplicateOutput

        output = await Promise.race([replicatePromise, timeoutPromise]) as ReplicateOutput
      } catch (error: any) {
        if (error.message === 'Request timeout') {
          throw new Error('Processing timed out. Please try a smaller image or try again.')
        }
        throw error
      }
      console.log('Replicate processing complete:', output?.substring(0, 50) + '...')

      if (!output) {
        throw new Error('Replicate API returned no output')
      }

      return NextResponse.json({ 
        success: true, 
        url: output,
        format: outputFormat
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      })

    } catch (error: any) {
      console.error('Processing error:', error)  // Debug log
      const errorMessage = error.message.replace('Failed to validate image: ', '')
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: {
            message: errorMessage,
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          }
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      )
    }
  } catch (error: any) {
    console.error('Request error:', error)  // Debug log
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process image',
        details: {
          message: error.message,
          type: error.name
        }
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
} 