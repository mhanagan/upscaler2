import { NextResponse } from 'next/server'
import Replicate from 'replicate'

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
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Image URL is required',
          details: 'No image URL was provided in the request'
        },
        { status: 400 }
      )
    }

    // Validate image and get format
    try {
      const inputFormat = await validateImage(imageUrl)
      
      // Use input format or fallback to jpg if format is not supported
      const outputFormat = ['jpg', 'png'].includes(inputFormat) ? inputFormat : 'jpg'

      // Proceed with upscaling
      const output = await replicate.run(
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
      )

      if (!output) {
        throw new Error('Replicate API returned no output')
      }

      return NextResponse.json({ 
        success: true, 
        url: output,
        format: outputFormat
      })

    } catch (error: any) {
      console.error('Detailed error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to validate image',
          details: {
            message: error.message,
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          }
        },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process image',
        details: {
          message: error.message,
          type: error.name,
          requirements: {
            maxTotalPixels: MAX_TOTAL_PIXELS.toLocaleString(),
            maxFileSize: '5MB',
            allowedTypes: 'image/*',
            recommendation: 'For example, a 1440x1440 image would work well'
          },
          recommendation: 'Please ensure your image meets the requirements and try again'
        }
      },
      { status: 500 }
    )
  }
} 