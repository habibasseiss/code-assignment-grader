import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { Config, FileUpload } from "../types";

export const handleReview = async (
  config: Config,
  templateFiles: FileUpload[],
  studentFiles: FileUpload[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  const message = `Ground truth template files:\n${templateFiles
    .map((file) => `${file.name}:\n\`\`\`${file.content}\`\`\``)
    .join("\n\n")}\n\nStudent submission files:\n${studentFiles
    .map((file) => `${file.name}:\n\`\`\`${file.content}\`\`\``)
    .join("\n\n")}`;

  if (config.provider === "openai") {
    const client = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });

    const stream = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  } else {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: config.systemPrompt,
    });

    const result = await model.generateContentStream([{ text: message }]);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onChunk(text);
      }
    }
  }
};
