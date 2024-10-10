import { Pinecone } from "@pinecone-database/pinecone";

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  searchQuery: string
): Promise<string> {
  return "";
}
