import { config } from "dotenv";
import { initializePinecone } from "./config/pinecone";

config();
async function clear() {
  try {
    const indexName = "sample-movies";
    const pc = initializePinecone();
    const index = pc.index(indexName);
    await index.deleteAll();
    console.log("Chunks are deleted.");
  } catch (error) {
    console.error(error);
  }
}

clear();
