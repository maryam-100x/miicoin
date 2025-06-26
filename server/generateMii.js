// generateMii.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import OpenAI, { toFile } from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

// Save base64 string to temp .png file
function saveBase64Image(base64, filename) {
  const filePath = path.join(__dirname, filename);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

app.post('/api/generate-mii', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🎮 Mii transformation started...');

    // Step 1: Save image to disk temporarily
    const filename = `upload-${uuidv4()}.png`;
    const filePath = saveBase64Image(image, filename);

    // Step 2: Create prompt
    const prompt = `
Transform this character to look like it was created inside the Nintendo Wii Mii Maker.
Preserve all facial features, hair, clothing, expression, and background.
Only change the visual style to match the Mii art: glossy, cartoonish 3D with simple shapes and clean shadows.
`;

    // Step 3: Send to GPT-image-1 edit endpoint
    const edited = await openai.images.edit({
  model: "gpt-image-1",
  image: await toFile(fs.createReadStream(filePath), filename, {
    type: "image/png"
  }),
  prompt,
  size: "1024x1024",
  quality: "high"
});


    // Step 4: Clean up temp file
    fs.unlinkSync(filePath);

    // Step 5: Respond with base64
    const base64Image = edited.data[0].b64_json;

    console.log('✅ Mii-style transformation complete!');
    res.json({
      miiImage: base64Image,
      message: 'Mii-style avatar generated successfully!'
    });

  } catch (err) {
    console.error('❌ Mii generation failed:', err);
    const errorResponse = {
      error: 'Image generation error',
      details: err.message || 'Unknown error occurred'
    };

    if (err.code === 'insufficient_quota') {
      errorResponse.error = 'OpenAI API quota exceeded';
    } else if (err.code === 'invalid_api_key') {
      errorResponse.error = 'Invalid OpenAI API key';
    } else if (err.code === 'rate_limit_exceeded') {
      errorResponse.error = 'Rate limit exceeded';
    }

    res.status(500).json(errorResponse);
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'Mii Generator API running',
    timestamp: new Date().toISOString(),
    configured: !!process.env.OPENAI_API_KEY
  });
});

app.get('/test-openai', async (req, res) => {
  try {
    const response = await openai.models.list();
    res.json({
      status: 'OpenAI connection OK',
      available_models: response.data.length
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed to connect to OpenAI',
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Mii Generator Server ready at http://localhost:${port}`);
});
