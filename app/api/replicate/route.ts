import { NextResponse } from 'next/server';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

//2 API calls.
//1 for image to be generated.
export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  console.log('req.body:', req.body);
  const { prompt } = await req.json();

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        //OPENAI API
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      //The model that you are using.
      body: JSON.stringify({
        // See https://replicate.com/stability-ai/sdxl
        //Version - stable diffusion model
        version: "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
        //Our prompt
        input: { prompt: prompt },
      }),
    });

    if (response.status !== 201) {
      let error = await response.json();
      throw new Error(`HTTP error! status: ${response.status} | detail: ${error.detail}`);
    }

    let prediction = await response.json();
    console.log('first prediction:', prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await new Promise(resolve => { setTimeout(resolve, 1000); }); //1 second.
      //Another API call.
      try {
        //Now we have a specific ID from above.
        const response = await fetch(
          "https://api.replicate.com/v1/predictions/" + prediction.id,
          {
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        //Error
        if (response.status !== 200) {
          let error = await response.json();
          throw new Error(`HTTP error! status: ${response.status} | detail: ${error.detail}`);
        }
  
        prediction = await response.json();
        console.log('loop prediction:', prediction);
      } catch (error) {
        console.log(error);
      }
    }
    //Access the output and get last prediction that was generated.
    const imageUrl = prediction.output[prediction.output.length - 1];
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error(error);
    return new Response(error?.message || error?.toString(), {
      status: 500,
    })
  }
};