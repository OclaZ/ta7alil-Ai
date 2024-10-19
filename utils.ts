import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN!);
export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  searchQuery: string
): Promise<string> {
  const hfOutput = await hf.featureExtraction({
    model: "mixedbread-ai/mxbai-embed-large-v1",
    inputs: searchQuery,
  });
  console.log(hfOutput);
  const queryEmbedding = Array.from(hfOutput);
  const index = client.Index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding as any,
    includeMetadata: true,
    includeValues: false,
  });
  //console.log(queryResponse);
  if (queryResponse.matches.length > 0) {
    const concatenatedRetrievals = queryResponse.matches
      .map(
        (match, index) =>
          `\nClinical Finding ${index + 1}: \n ${match.metadata?.chunk}`
      )
      .join(". \n\n");
    return concatenatedRetrievals;
  } else {
    return "<nomatches>";
  }
  return "";
}
