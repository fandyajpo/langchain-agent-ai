import { config } from "dotenv";
import { Cohere, CohereEmbeddings } from "@langchain/cohere";
config();
export const initCohere = () => {
  const llm = new Cohere({
    apiKey: process.env.COHERE_API_KEY,
  });
  return llm;
};

export const cohereEmbeddings = () => {
  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0",
  });

  return embeddings;
};
