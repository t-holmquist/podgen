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

  return {isGenerating, generatePodcast}
}

const GeneratePodcast = (props : GeneratePodcastProps) => {

  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Insert you text prompt below
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

      {props.audio && (
        <audio
        controls
        src={props.audio}
        autoPlay
        className="mt-5"
        onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}

    </div>
  )
}

export default GeneratePodcast