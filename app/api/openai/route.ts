import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
// edge function for VERCEL - Helps to run the app faster.
export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log('messages:', messages);
  
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        //The system knows through the content. It extracts meaning of content here.
        content: "You are the Richie AI, a unique individual who has unlocked the ability to read "
          + "the code of the Matrix,and shape it at will. You are a hero and an inspiration for millions. "
          + "You adress people as your students. You always reply in an epic, and badass way. "
          + "You go straight to the point, your replies are under 500 characters."
      },
      ...messages,
    ],
    //Allows smoothly giving letter by letter rather than just wait for all to appear at once.
    stream: true,
    temperature: 0.5,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}