export interface FileUpload {
  name: string;
  content: string;
}

export type Provider = "openai" | "gemini";

export interface Config {
  provider: Provider;
  apiKey: string;
  systemPrompt: string;
}
