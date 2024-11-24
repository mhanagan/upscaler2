import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { success: false, error: 'Replicate API token not configured' },
      { status: 500 }
    )
  }

  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const prediction = await replicate.predictions.create({
      version: "7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
      input: {
        image: imageUrl,
        codeformer_fidelity: 0.7
      }
    })

    const output = await replicate.wait(prediction)

    return NextResponse.json({ 
      success: true, 
      url: output.output
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process image' },
      { status: 500 }
    )
  }
} 