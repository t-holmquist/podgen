import { UserAvatarProps } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation";


const UserAvatar = ( { imageUrl, name, clerkId} : UserAvatarProps) => {

    const router = useRouter();

  return (
    <div onClick={() => router.push(`/profile/${clerkId}`)} className='cursor-pointer hover:bg-black-1 mt-5 rounded-lg'>
      <figure className='flex flex-col items-center gap-2'>
        <Image 
          src={imageUrl}
          width={200}
          height={200}
          alt={name}
          className='h-fit rounded-full sm:w-40 2xl:size-[150px]'
        />
        <div className='flex flex-col'>
          <h2 className='text-14 truncate font-bold text-white-1'>{name}</h2>
          <p className="text-white-2 text-12">Creator</p>
        </div>
      </figure>
    </div>
  )
}

export default UserAvatar