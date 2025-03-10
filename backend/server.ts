import express, { Request, Response } from "express";
import { HfInference } from "@huggingface/inference";
import * as path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port: number = Number(process.env.PORT) || 3000;
const hf = new HfInference(process.env.HF_KEY || "");

app.use(cors());
app.use(express.json());

interface InferenceRequest {
  image: string;
}

app.post(
  "/inference",
  async (req: Request<void, void, InferenceRequest>, res: Response) => {
    try {
      const { image } = req.body;
      console.log(image);

      const chatCompletion = await hf.chatCompletion({
        model: "Qwen/Qwen2-VL-7B-Instruct",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "Identify the species in the image. Reply in JSON format: {speciesName, confidence, additionalInfo}",
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
        provider: "nebius",
        max_tokens: 128,
      });

      console.log(chatCompletion);
      console.log(chatCompletion.choices?.[0]?.message);
      res.json(chatCompletion.choices?.[0]?.message?.content || {});
    } catch (error: any) {
      console.error(`Error during inference: ${error.message}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
