import { GeneratePodcastProps } from "@/types"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Loader } from "lucide-react"



// Custom hook for generating audio
const useGeneratePodcast = (props: GeneratePodcastProps) => {

  // logic for generating audiofile

  return {
    isGenerating: false,
    generatePodcast: () => {}
  }

}

const GeneratePodcast = (props : GeneratePodcastProps) => {

  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Insert you prompt below
        </Label>
        <Textarea 
          className="input-class font-light focus-visible:ring-offset-primaryPink-1" 
          placeholder="Your prompt goes here"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button type="submit" className="text-16 bg-primaryPink-1 py-4 font-bold text-white-1">
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