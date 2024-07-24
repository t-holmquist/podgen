import { GeneratePodcastProps } from "@/types"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Loader } from "lucide-react"
import { useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"
import { TextGenerateEffect } from "./ui/textGenerateEffect"
import { IoSparkles } from "react-icons/io5";
import { Skeleton } from "./ui/skeleton"




// Custom hook for generating audio
const useGeneratePodcast = ( {  
  setAudio, voiceType, voicePrompt, setAudioStorageId
} : GeneratePodcastProps ) => {
  // logic for generating audiofile
  const [isGenerating, setIsGenerating] = useState(false)

  // generate url from convex mutation
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)

  const { toast } = useToast();

  // extract convex podcast action created in convex/openai.ts
  const getPodcastAudio = useAction(api.openai.generateAudioAction)

  // extract convex mutation from podcasts.ts
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  // extract AI title & description suggestion and state for setting title
  const getSuggestedTitle = useAction(api.openai.suggestTitleAction)
  const [suggestedTitle, setSuggestedTitle] = useState('')
  const getSuggestedDescription = useAction(api.openai.suggestDescriptionAction)
  const [suggestedDescription, setSuggestedDescription] = useState('')



  const generatePodcast = async () => {
    // Reset audio when starting to generate
    setIsGenerating(true);
    setAudio('')

    if(!voicePrompt) {
        toast({
        title: "Please provide a voice input",
      })
      return setIsGenerating(false)
    }

    // call extracted convex action to get openai response
    try {
      const response = await getPodcastAudio({
        input: voicePrompt,
        voice: voiceType!,
      })


      // Get AI suggested title & description based on voiceprompt from openAI. Then set the state so that it can be returned.
      const suggestedTitle = await getSuggestedTitle({prompt: voicePrompt})
      setSuggestedTitle(suggestedTitle!)
      const suggestedDescription = await getSuggestedDescription({prompt: voicePrompt})
      setSuggestedDescription(suggestedDescription!)

      
      
      const blob = new Blob([response], { type: 'audio/mpeg' });
      // use the uuid library to get random id for each file
      const fileName = `podcast-${uuidv4()}.mp3`

      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      // Here is the actual upload. startupload() has access to the generated URL from convex mutation in files.ts
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId)

      // get audioUrl from convex where audio can be downloaded and played if exists and <audio/> element is rendered
      const audioUrl = await getAudioUrl({ storageId })
      setAudio(audioUrl!);
      setIsGenerating(false)
      toast({
        title: "Succesfully generated audio",
      })

    } catch (error) {
      console.log('Error generating podcast', error)
      toast({
        title: "Error creating audio file",
        variant: 'destructive',
      })
      setIsGenerating(false)
    }

    
  }

  
  return {isGenerating, generatePodcast, suggestedTitle, suggestedDescription}
}


const GeneratePodcast = (props : GeneratePodcastProps) => {

  const { isGenerating, generatePodcast, suggestedTitle, suggestedDescription } = useGeneratePodcast(props);

  

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Insert your text prompt below
        </Label>
        <p className="text-12 text-white-2">* Automatically detects and supports multiple languages</p>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-primary-1" 
          placeholder="Podcast text goes here"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button onClick={generatePodcast} type="button" className="text-16 text-white-1 hover:bg-slate-900 mx-3 rounded-2xl border border-primary-1 font-extrabold">
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2"/>
            </>
          ): (
            'Generate audio'
          )}
        </Button>
      </div>
      
      {/* Skeleton loader */}
      {isGenerating && (
        <div className="flex flex-col gap-3 mt-5">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[280px]" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      )}

      {/* If audio is generated then render AI suggested title, description and audio player */}
      {props.audio && (
        <>
          <div className="flex mt-5 gap-2 items-center">
            <h2 className="text-white-1 font-bold text-16">AI suggestions</h2>
            <IoSparkles className="text-white-1 animate-bounce"/>
          </div>
          <div className="flex flex-col mt-5 gap-5 items-center bg-primary-1 w-fit rounded-xl p-3">
            {suggestedTitle && (
            <div className="flex gap-2 items-center rounded-xl p-1">
              <p className="text-white-1 font-bold text-14">Title: </p>
              <TextGenerateEffect words={suggestedTitle} staggerAmount={0.2} />
            </div>
            )}
        </div>
        <div className="mt-5 gap-5 items-center bg-primary-1 w-fit rounded-xl p-2">
          {suggestedDescription && (
              <div className="flex flex-col gap-2 rounded-xl p-1">
                <p className="text-white-1 font-bold text-14">Description: </p>
                <TextGenerateEffect words={suggestedDescription} staggerAmount={0.1}/>
              </div>
              )}
        </div>
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5 h-10 self-start"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
          />
      </>
      )}

    </div>
  )
}

export default GeneratePodcast