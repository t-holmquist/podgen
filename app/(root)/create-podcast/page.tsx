"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

// OpenAI voices
const voiceCategories = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
    }),
    })
    
const CreatePodcast = () => {

  // Choosen Voice state for audio functions
  const [voiceType, setVoiceType] = useState<string | null>(null);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // Defining a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
  <section className="mt-10 flex flex-col">
    <h1 className='text-20 font-bold text-white-1'>Create Podcast</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
          <FormField
            control={form.control}
            name="podcastTitle"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Username</FormLabel>
                <FormControl>
                  <Input className="input-class focus-visible:ring-primaryBlue-1" placeholder="Your name here" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Choose AI voice
              </Label>

              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1')}>
                  <SelectValue placeholder="Choose AI Voice" className="placeholder:text-gray-1"/>
                </SelectTrigger>
                <SelectContent className="text-16 bg-none bg-black-1 font-bold text-white-1 focus:ring-primaryBlue-1">
                  {voiceCategories.map((voice) => (
                    <SelectItem key={voice} value={voice} className="capitalize focus:bg-primaryBlue-1">
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
                {/* Autoplay a preview of the AI voice */}
                {voiceType && (
                  <audio
                  src={`/${voiceType}.mp3`}
                  autoPlay
                  className="hidden"
                  />
                )}
              </Select>
          </div>
          <FormField
            control={form.control}
            name="podcastDescription"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                <FormControl>
                  <Textarea className="input-class focus-visible:ring-primaryBlue-1" placeholder="Write a short description" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
        </div>
      </form>
  </Form>
</section>
  )
}

export default CreatePodcast;