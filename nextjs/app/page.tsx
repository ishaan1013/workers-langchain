"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"

const formSchema = z.object({
  fromLocation: z.string().min(1).max(50),
  description: z.string().min(10).max(50),
  openai: z.string().nonempty(),
  serp: z.string().nonempty(),
})

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromLocation: "",
      description: "",
      openai: "",
      serp: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values)
    const { fromLocation, description, openai, serp } = values

    const data = await axios.post("/api/worker", {
      fromLocation,
      description,
      openai,
      serp,
    })

    console.log(data.data)
  }

  return (
    <div className="w-full">
      <h1 className="sm:text-3xl text-2xl mt-4 mb-8 font-semibold">
        AI Agent Travel Assistant
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="fromLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where are you travelling from?</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Toronto, ON" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Description</FormLabel>
                <FormControl>
                  <Input placeholder="I want to go to..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OpenAI Key</FormLabel>
                <FormControl>
                  <Input placeholder="Your API key" {...field} />
                </FormControl>
                <FormDescription>
                  Creat an OpenAI account, then find your key at{" "}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                  >
                    <Button variant="link" className="p-0 ml-0.5 text-xs">
                      https://platform.openai.com/account/api-keys
                    </Button>
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SerpApi Key</FormLabel>
                <FormControl>
                  <Input placeholder="Your API key" {...field} />
                </FormControl>
                <FormDescription>
                  Creat a SerpApi account, then find your key at{" "}
                  <a href="https://serpapi.com/manage-api-key" target="_blank">
                    <Button variant="link" className="p-0 ml-0.5 text-xs">
                      https://serpapi.com/manage-api-key
                    </Button>
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
