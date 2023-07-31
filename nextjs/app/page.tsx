import axios from "axios"

export default async function Home() {
  const test = {
    data: {
      location: "\nMaldives",
      itinerary:
        "\n\nDay 1:\nArrive in Male, the capital of the Maldives. Spend the day exploring the city and its attractions, such as the Grand Friday Mosque, the National Museum, and the Sultan Park.\n\nDay 2:\nTake a day trip to the nearby island of Hulhumale. Spend the day relaxing on the beach, snorkeling, and exploring the local shops and restaurants.\n\nDay 3:\nTake a boat tour of the nearby atolls. Enjoy the stunning views of the crystal clear waters and the abundance of marine life.\n\nDay 4:\nSpend the day at a resort on one of the many islands. Enjoy the luxurious amenities, such as a spa, swimming pool, and private beach.\n\nDay 5:\nTake a day trip to the nearby island of Maafushi. Explore the local culture and cuisine, and take a tour of the island.\n\nDay 6:\nTake a boat tour of the nearby islands. Enjoy the stunning views of the crystal clear waters and the abundance of marine life.\n\nDay 7:\nSpend the day relaxing on the beach and exploring the local shops and restaurants. Enjoy the stunning views of the crystal clear waters and the abundance of marine life",
      result: {
        output:
          "The current flight price from Toronto, ON to Maldives is approximately C$ 1472.",
      },
    },
  }

  console.log(test.data)

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="z-10 w-full max-w-screen-md items-center space-y-8 justify-start flex flex-col">
        <div className="whitespace-pre-line text-xs">{test.data.location}</div>
        <div className="whitespace-pre-line text-xs">{test.data.itinerary}</div>
        <div className="whitespace-pre-line text-xs">
          {test.data.result.output}
        </div>
      </div>
    </main>
  )
}
