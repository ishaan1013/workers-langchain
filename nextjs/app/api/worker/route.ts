import axios from "axios"
import { NextResponse } from "next/server"

export async function POST() {
  const res = await axios.post(
    "https://workers-langchain.ishaan1013.workers.dev/",
    {
      fromLocation: "Toronto, ON",
      description: "I want to go to a beach with white sand and great food.",
      openai: "sk-",
      serp: "9a",
    }
  )

  return NextResponse.json(res.data)
}
