import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatItinerary(itinerary: string) {
  while (itinerary.slice(0, 2) === "\n") {
    itinerary = itinerary.slice(2)
  }
  return itinerary
}
