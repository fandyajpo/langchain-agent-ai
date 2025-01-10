import { config } from "dotenv";
import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";
import { initializePinecone } from "./config/pinecone";
import { cohereEmbeddings, initCohere } from "./config/cohere";
config();
async function query() {
  try {
    const indexName = "sample-movies";
    const pc = initializePinecone();
    const embeddings = cohereEmbeddings();
    const index = pc.index(indexName);
    const query = "where i can get Machine Learning course?";
    const queryEmbedding = await embeddings.embedQuery(query);

    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
      includeValues: true,
    });

    const concatenatedText = queryResponse.matches
      .map((match) => match?.metadata?.text ?? "")
      .join(" ");

    const prompt = `
  Answer the following questions based on the context below. If you don't know the answer, simply respond with 'I don't know.'
  
  Context:
  ${concatenatedText}
  
  Question:
  ${query}
  `;

    const llm = initCohere();
    const chain = loadQAStuffChain(llm);

    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: prompt })],
      question: query,
    });
    console.log("Question", query);
    console.log(`Answer: ${result.text}`);
  } catch (error) {
    console.log(error);
  }
}

query();
