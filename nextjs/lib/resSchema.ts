import { z } from "zod"

export const resSchema = z.object({
  location: z.string(),
  itinerary: z.string(),
  flight: z.string(),
})
