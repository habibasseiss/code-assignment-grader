import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { Config, FileUpload } from "../types";

export const handleReview = async (
  config: Config,
  templateFiles: FileUpload[],
  studentFiles: FileUpload[]
): Promise<string> => {
  const message = `Template Files:\n${templateFiles
    .map((file) => `${file.name}:\n\`\`\`${file.content}\`\`\``)
    .join("\n\n")}\n\nSubmission Files:\n${studentFiles
    .map((file) => `${file.name}:\n\`\`\`${file.content}\`\`\``)
    .join("\n\n")}`;

  if (config.provider === "openai") {
    const client = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: message },
      ],
    });

    return completion.choices[0]?.message?.content || "No response received";
  } else {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: config.systemPrompt,
    });

    const result = await model.generateContent([{ text: message }]);

    return result.response.text();
  }
};
