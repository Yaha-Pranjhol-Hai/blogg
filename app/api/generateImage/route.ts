import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        if (!prompt || prompt.length < 10) {
            return NextResponse.json({ error: 'Please provide a more descriptive text to generate an image.' }, { status: 400 });
        }
        const imageBlob = await generateImageFromStableDiffusion(prompt);
        return new NextResponse(imageBlob, {
            status: 200,
            headers: {
                "Content-Type": "image/png",  // or "image/jpeg" based on the image type returned
            },
        });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
    }
}

async function generateImageFromStableDiffusion(prompt: string): Promise<Blob> {
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.STABLE_TOKEN}`,  // Ensure your Hugging Face token is correct
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
    });

    // Get image blob directly from the response
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image.');
    }

    const imageBlob = await response.blob();
    return imageBlob;
}
