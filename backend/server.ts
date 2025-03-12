import express, { Request, Response } from "express";
import OpenAI from "openai";
import * as path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port: number = Number(process.env.PORT) || 3000;
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));

interface InferenceRequest {
  image: string;
}

app.post(
  "/inference",
  async (req: Request<void, void, InferenceRequest>, res: Response) => {
    try {
      const { image } = req.body;
      console.log(image);

      const response = await openai.chat.completions.create({
        model: "qwen2.5-vl-3b-instruct",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `Identify the species in the image. Reply in JSON format: {commonName, scientificName, habitat, additionalInfo}. 
                IMPORTANT: Do not wrap it in markdown code block. Just wrap it in curly brackets`,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      console.log(response);
      const answer = response.choices?.[0]?.message?.content;
      console.log(answer);
      try {
        const parsedResponse = JSON.parse(answer || "");
        res.status(200).json(parsedResponse);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        console.error("Response:", answer);
        res.status(500).json({ error: "Invalid JSON response", answer });
      }
    } catch (error: any) {
      console.error(`Error during inference: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
