import { z } from "zod"

export const formSchema = z.object({
  fromLocation: z.string().min(1).max(50),
  description: z.string().min(10).max(100),
  openai: z.string().nonempty(),
  serp: z.string().nonempty(),
})
