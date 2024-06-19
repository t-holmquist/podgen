import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Loader } from "lucide-react"
import { GenerateThumbnailProps } from "@/types"
import { Input } from "./ui/input"
import Image from "next/image"

const GenerateThumbnail = ( { setImage, setImageStorageId, image, imagePrompt, setImagePrompt } : GenerateThumbnailProps ) => {

  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  // Reference for the Input/upload element to be clicked on div container
  const imageRef = useRef<HTMLInputElement>(null);

  
  const generateImage = async () => {

  } 


  return (
    <>
      <div className="generate_thumbnail">
        <Button
        type="button"
        variant="plain"
        onClick={() => setIsAiThumbnail(true)}
        className={cn('', {'bg-black-6': isAiThumbnail})}
        >
          Generate thumbnail with AI
        </Button>
        <Button
        type="button"
        variant="plain"
        onClick={() => setIsAiThumbnail(false)}
        className={cn('', {'bg-black-6': !isAiThumbnail})}
        >
          Upload custom image
        </Button>
      </div>
      {/* If generate with AI option is chosen */}
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col mt-5 gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              Use AI to generate thumbnail
            </Label>
            <Textarea 
              className="input-class font-light focus-visible:ring-offset-primaryPink-1" 
              placeholder="Your text goes here"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              />
          </div>

          <div className="w-full max-w-[200px]">
            <Button type="submit" className="text-16 bg-primaryPink-1 py-4 font-bold text-white-1">
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2"/>
                </>
              ): (
                'Generate thumbnail'
              )}
            </Button>
          </div>
        </div>
      ) : (
        // If upload custom image is chosen
        <div onClick={() => imageRef?.current?.click()} className="image_div">
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
          />
          {/* Ready to upload image */}
          {!isImageLoading ? (
            <Image src='/icons/upload-image.svg' width={40} height={40} alt="upload"/>
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2"/>
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-primaryPink-1">
              Click to upload
            </h2>
            <p className="text-12 font-normal text-gray-1">SVG, JPG, PNG or GIF (max: 1080x1080px)</p>
          </div>
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail