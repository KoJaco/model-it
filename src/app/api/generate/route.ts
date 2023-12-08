import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import Replicate from "replicate";
import { env } from "~/env";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(25, "1440 m"),
});

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  // TODO: Assert that user is authenticated

  const identifier = "api-route";
  const result = await ratelimit.limit(identifier);

  if (!result.success) {
    return NextResponse.json("No generations remaining.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": result?.limit,
        "X-RateLimit-Remaining": result?.remaining,
      },
    });
  }

  const { prompt } = await request.json();

  try {
    const output = await replicate.run(
      // This is the ID of the replicate model you are running
      "doriandarko/sdxl-hiroshinagai:563a66acc0b39e5308e8372bed42504731b7fec3bc21f2fcbea413398690f3ec",
      {
        input: {
          prompt: "In the style of HISGH. " + prompt,
          // ... other model parameters
        },
      },
    );

    return NextResponse.json(output, {
      headers: {
        "X-RateLimit-Limit": result?.limit,
        "X-RateLimit-Remaining": result?.remaining,
      },
    });
  } catch (error) {
    // TODO: log error to service
    console.log(error);
    return NextResponse.json("An error occurred. Please try again later.", {
      status: 500,
    });
  }
}
