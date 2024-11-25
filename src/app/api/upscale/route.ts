import { NextResponse } from 'next/server'
import Replicate from 'replicate'

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing Replicate API token')
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Using Real-ESRGAN with optimized settings
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

    return NextResponse.json({ 
      success: true, 
      url: output
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process image. Please try a smaller image or wait a moment and try again.'
      },
      { status: 500 }
    )
  }
} 