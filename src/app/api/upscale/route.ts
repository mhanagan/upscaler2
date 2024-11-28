import { NextResponse } from 'next/server'
import Replicate from 'replicate'

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing Replicate API token')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Constants for image constraints
const MAX_IMAGE_SIZE = 2048 // maximum dimension in pixels
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

async function validateImage(url: string): Promise<void> {
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

    // Validate image
    try {
      await validateImage(imageUrl)

      // Proceed with upscaling
      const output = await replicate.run(
        "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        {
          input: {
            image: imageUrl,
            scale: 2,
            face_enhance: false,
            tile: 0
          }
        }
      )

      if (!output) {
        throw new Error('Replicate API returned no output')
      }

      return NextResponse.json({ 
        success: true, 
        url: output
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
            maxFileSize: '5MB',
            allowedTypes: 'image/*'
          },
          recommendation: 'Please ensure your image meets the requirements and try again'
        }
      },
      { status: 500 }
    )
  }
} 