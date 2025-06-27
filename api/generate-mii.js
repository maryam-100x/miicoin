// api/generate-mii.js

import OpenAI, { toFile } from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🎮 Vercel Mii transformation started...');

    // Convert base64 to buffer directly - no file system operations
    const imageBuffer = Buffer.from(image, 'base64');
    const filename = `upload-${uuidv4()}.png`;

    const prompt = `Transform this character to look like it was created inside the Nintendo Wii Mii Maker.
Preserve all facial features, hair, clothing, expression, and background.
Only change the visual style to match the Mii art: glossy, cartoonish 3D with simple shapes and clean shadows.`;

    // Use buffer directly instead of file system
    const imageFile = await toFile(imageBuffer, filename, {
      type: "image/png"
    });

    const edited = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt,
      size: "1024x1024",
      quality: "high"
    });

    const base64Image = edited.data[0].b64_json;

    console.log('✅ Vercel Mii generated successfully!');
    res.status(200).json({
      miiImage: base64Image,
      message: 'Mii-style avatar generated successfully!'
    });

  } catch (err) {
    console.error('❌ Vercel Mii generation failed:', err);
    
    // Handle specific OpenAI errors
    let errorMessage = 'Image generation error';
    let statusCode = 500;

    if (err.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded';
      statusCode = 402;
    } else if (err.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key';
      statusCode = 401;
    } else if (err.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded';
      statusCode = 429;
    } else if (err.name === 'AbortError' || err.message?.includes('timeout')) {
      errorMessage = 'Request timeout - image processing took too long';
      statusCode = 408;
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: err.message || 'Unknown error occurred'
    });
  }
}