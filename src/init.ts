import { config } from "dotenv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { initializePinecone } from "./config/pinecone";
import { cohereEmbeddings } from "./config/cohere";
import fs from "fs/promises";
config();
async function init() {
  try {
    const indexName = "sample-movies";
    const pc = initializePinecone();
    const embeddings = cohereEmbeddings();
    const filePath = "./content/content.txt";
    const fileContent = await fs.readFile(filePath, "utf-8");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const chunks = await splitter.splitText(fileContent);

    console.log(`Number of chunks: ${chunks.length}`);

    const chunkEmbeddings = await embeddings.embedDocuments(chunks);
    const scheduleVectors = chunkEmbeddings.map((embedding, i) => ({
      id: `chunk-${i}`,
      values: embedding,
      metadata: {
        text: chunks[i],
      },
    }));

    const index = pc.index(indexName);
    await index.upsert(scheduleVectors);

    console.log("Chunks stored in Pinecone.");
  } catch (error) {
    console.error(error);
  }
}

init();
