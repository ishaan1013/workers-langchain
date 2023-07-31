import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  const { fromLocation, description, openai, serp } = body

  const res = await axios.post(
    "https://workers-langchain.ishaan1013.workers.dev/",
    {
      fromLocation,
      description,
      openai,
      serp,
    }
  )

  return NextResponse.json(res.data)
}
