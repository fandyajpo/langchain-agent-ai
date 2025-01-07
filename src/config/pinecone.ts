import { config } from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
config();
export const initializePinecone = () => {
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const pc = new Pinecone({
    apiKey: pineconeApiKey ?? "",
  });
  return pc;
};
