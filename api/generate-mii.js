// api/generate-mii.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    console.log('🎮 Vercel Mii transformation started...');

    const prompt = `
Transform this character to look like it was created inside the Nintendo Wii Mii Maker.
Preserve all facial features, hair, clothing, expression, and background.
Only change the visual style to match the Mii art: glossy, cartoonish 3D with simple shapes and clean shadows.
`;

    // Use base64 image directly with GPT-4o vision + DALL·E prompt flow
    const visionPrompt = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a visual-to-text expert specializing in stylized character descriptions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this person so they can be reimagined in Mii avatar style."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const detailedPrompt = visionPrompt.choices[0].message.content;

    const finalPrompt = `${detailedPrompt}

Transform this character to look like they were created inside the Nintendo Wii Mii Maker.
Keep the background untouched. Use glossy cartoon-like features, round face shapes, black outline eyes, and simplified shadows — all matching the official Wii Mii style.`;

    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      n: 1,
      size: "1024x1024",
      quality: "high",
      response_format: "b64_json" // important!
    });

    const base64Image = imageResponse.data[0].b64_json;

    console.log('✅ Mii avatar generated on Vercel');
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
  }
}
