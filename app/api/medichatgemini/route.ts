import { Message } from "ai/react";
import { Pinecone } from "@pinecone-database/pinecone";
import { queryPineconeVectorStore } from "@/utils";

// Initialize a client
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  console.log(reqBody);
  const message: Message[] = reqBody.messages;
  const userQuestions = message[message.length - 1].content;
  const reportData = reqBody.data.reportData;
  const searchQuery = `Patient medical report says \n ${reportData} \n\n ${userQuestions}`;
  const retrievals = await queryPineconeVectorStore(
    pc,
    "index-one",
    "Default",
    searchQuery
  );

  return new Response("dummy response", { status: 200 });

  //return result.toDataStreamResponse();
}
