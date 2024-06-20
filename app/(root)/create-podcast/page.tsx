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
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { VoiceType } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

// OpenAI voices
const voiceCategories = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];


const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})
    
const CreatePodcast = () => {

  const router = useRouter();

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio and image function states
  const [voiceType, setVoiceType] = useState<VoiceType>(null);
  const [voicePrompt, setVoicePrompt] = useState('')

  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [audioDuration, setAudioDuration] = useState(0);

  const { toast } = useToast();

  const createPodcast = useMutation(api.podcasts.createPodcast);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",

    },
  })
 
  // Defining a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    
    try {
      setIsSubmitting(true)
      if(!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: 'Please generate audio and image'
        })
        setIsSubmitting(false)
        throw new Error('Please generate audio and image')
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      })
      toast({
        title: 'Succesfully submitted your creation!'
      })
      setIsSubmitting(false)
      router.push('/')
      
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error submitting your creation',
        variant: 'destructive'
      })
      setIsSubmitting(false)
    }


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
                <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                <FormControl>
                  <Input className="input-class focus-visible:ring-offset-primaryPink-1" placeholder="Your name here" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Choose AI voice
              </Label>

              <Select onValueChange={(value) => setVoiceType(value as VoiceType)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-primaryPink-1')}>
                  <SelectValue placeholder="Choose AI Voice" className="placeholder:text-gray-1"/>
                </SelectTrigger>
                <SelectContent className="text-16 bg-none bg-black-1 font-bold text-white-1 focus:ring-offset-primaryPink-1">
                  {voiceCategories.map((voice) => (
                    <SelectItem key={voice} value={voice} className="capitalize focus:bg-primaryPink-1">
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
                  <Textarea className="input-class focus-visible:ring-offset-primaryPink-1" placeholder="Write a short description" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
        </div>
        {/* AI components */}
        <div className="flex flex-col pt-10">
            <GeneratePodcast 
            setAudioStorageId={setAudioStorageId}
            setAudio={setAudioUrl}
            voiceType={voiceType}
            audio={audioUrl}
            voicePrompt={voicePrompt}
            setVoicePrompt={setVoicePrompt}
            setAudioDuration={setAudioDuration}
            />

            <GenerateThumbnail 
            setImage={setImageUrl} 
            setImageStorageId={setImageStorageId} 
            image={imageUrl}
            imagePrompt={imagePrompt} 
            setImagePrompt={setImagePrompt}
            />

            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-primaryPink-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2"/>
                  </>
                ): (
                  'Publish your creation!'
                )}
              </Button>
            </div>
        </div>
      </form>
  </Form>
</section>
  )
}

export default CreatePodcast;