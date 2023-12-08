import type { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}
export default async function POST(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>,
) {
  // TODO: Check if user is logged in

  if (req.body?.prompt === null) {
    throw new Error("No prompt was provided");
  }

  const prompt = req.body.prompt;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version:
        "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: prompt, version: "v1.4", scale: 2 },
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const imageGen = await response.json();

  res.status(200).json(imageGen ? imageGen : "Failed to generate an image.");
}
