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

  try {
    // 🛠️ Parse raw JSON body (Vercel doesn't do this automatically!)
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString('utf8');
    let parsed;
    try {
      parsed = JSON.parse(rawBody);
    } catch (e) {
      console.error("❌ Failed to parse JSON body:", e);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    const { image } = parsed;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🎮 [Vercel] Mii transformation started...');

    // Save image to temp file
    const filename = `upload-${uuidv4()}.png`;
    const tempPath = path.join(os.tmpdir(), filename);
    fs.writeFileSync(tempPath, Buffer.from(image, 'base64'));

    // Prompt for GPT-Image
    const prompt = `
Transform this character to look like it was created inside the Nintendo Wii Mii Maker.
Preserve all facial features, hair, clothing, expression, and background.
Only change the visual style to match the Mii art: glossy, cartoonish 3D with simple shapes and clean shadows.
`;

    const edited = await openai.images.edit({
      model: "gpt-image-1",
      image: await toFile(fs.createReadStream(tempPath), filename, {
        type: "image/png"
      }),
      prompt,
      size: "1024x1024",
      quality: "high"
    });

    fs.unlinkSync(tempPath); // Cleanup temp file

    const base64Image = edited.data[0].b64_json;

    console.log('✅ [Vercel] Mii generated successfully!');
    res.status(200).json({
      miiImage: base64Image,
      message: 'Mii-style avatar generated successfully!'
    });
  } catch (err) {
    console.error('❌ Mii generation failed:', err);
    res.status(500).json({
      error: 'Image generation error',
      details: err.message || 'Unknown error occurred'
    });
  }
}
