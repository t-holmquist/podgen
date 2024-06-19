import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Loader } from "lucide-react"
import { GenerateThumbnailProps } from "@/types"
import { Input } from "./ui/input"
import Image from "next/image"
import { useToast } from "./ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUploadFiles } from "@xixixao/uploadstuff/react"

const GenerateThumbnail = ( { setImage, setImageStorageId, image, imagePrompt, setImagePrompt } : GenerateThumbnailProps ) => {

  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const { toast } = useToast();
  // mutation coming from files.ts and podcasts.ts, startUpload from uploadstuff
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl)

  // Reference for the Input/upload element to be clicked on div container
  const imageRef = useRef<HTMLInputElement>(null);

  // called in uploadImage()
  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    setImage('')

    try {
      const file = new File([blob], fileName, { type: 'image/png' });
      // startupload comes from uploadstuff
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId)
      // get url from convex mutation call created in podcasts.ts
      const imageUrl = await getImageUrl({ storageId })
      setImage(imageUrl!)
      setIsImageLoading(false)
      toast({
        title: 'Thumbnail generated successfully',
      })

    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive'})
    }
  }

  // generate image with AI
  const generateImage = async () => {
    
  }

  // Receives image, get upload URL and upload file to convex
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if(!files) return;

      const file = files[0];
      const blob = await file.arrayBuffer()
      .then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
      
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error uploading image',
        variant: 'destructive'
      })
    }
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
            onChange={(e) => {uploadImage(e)}}
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
      {/* Show image generated if exists */}
      {image && (
          <div className="flex-center w-full">
            <Image src={image} width={200} height={200} className="mt-5" alt="thumbnail"/>
          </div>
      )}
    </>
  )
}

export default GenerateThumbnail