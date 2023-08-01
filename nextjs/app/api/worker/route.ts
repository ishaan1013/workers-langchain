import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  const body = await request.json()

  const { fromLocation, description, openai, serp } = body

  try {
    const res = await fetch(
      "https://workers-langchain.ishaan1013.workers.dev/",
      {
        method: "POST",
        body: JSON.stringify({
          fromLocation,
          description,
          openai,
          serp,
        }),
      }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
