// api/generate-mii.js

import OpenAI, { toFile } from 'openai';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let tempPath = null;

  try {
    // Parse request body manually for Vercel
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString('utf8');
    
    if (!rawBody) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    const { image } = JSON.parse(rawBody);
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🎮 Vercel Mii transformation started...');

    // Save uploaded base64 image to temp file
    const filename = `upload-${uuidv4()}.png`;
    tempPath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempPath, Buffer.from(image, 'base64'));

    const prompt = `Turn the character in this image into a Mii from the original Nintendo Wii.

Use only the official Wii Mii Maker parts (face, hair, eyes, mouth, etc.) — no custom elements.

Match the character's key features as closely as possible (hairstyle, skin tone, expression, etc.), but only using Wii Mii presets.

Render the Mii in the 3D glossy style used in actual Wii gameplay:

Floating head with no neck

Shiny, gradient lighting

Simple arms and legs with Wii-style shading

Plastic texture and slight body shadow

Keep the background from the original image intact. Only the character should be transformed.`;

    const edited = await openai.images.edit({
      model: "gpt-image-1",
      image: await toFile(fs.createReadStream(tempPath), filename, {
        type: "image/png"
      }),
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
    res.status(500).json({
      error: 'Image generation error',
      details: err.message || 'Unknown error occurred'
    });
  } finally {
    // Always clean up temp file
    if (tempPath) {
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('Cleanup failed:', cleanupError);
      }
    }
  }
}