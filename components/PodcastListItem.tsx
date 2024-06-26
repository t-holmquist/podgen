import React from 'react'
import Image from 'next/image'
import { PodcastListItemProps } from '@/types'
import { useRouter } from 'next/navigation'
import { IoMdMusicalNote } from 'react-icons/io'
import { FaClock } from "react-icons/fa";
import { formatTime } from "@/lib/formatTime";

const PodcastCard = ( { imgUrl, title, description, podcastId, views, duration } : PodcastListItemProps ) => {

  const router = useRouter();
  // navigate to podcast page with specific id
  const handleViews = () => {
    // increase views
    
    router.push(`/podcasts/${podcastId}`, {
      scroll: true
    })
  }

  return (
    <div onClick={handleViews} className='flex justify-between items-center cursor-pointer hover:bg-black-1 rounded-lg border-b border-gray-1 border-opacity-30 p-2'>
      <div className='flex items-center text-white-1 gap-2'>
        <Image src={imgUrl} width={50} height={50} alt={title} />
        <div className='flex flex-col'>
            <h2 className='text-white-1 text-16 truncate max-w-[250px]'>{title}</h2>
            <p className='text-white-2 text-14 truncate max-w-[250px]'>{description}</p>
        </div>
      </div>
      <div className='flex text-white-1 items-center gap-2'>
        <IoMdMusicalNote />
        <p className='text-white-2'>{views}</p>
      </div>
      <div className='flex items-center text-white-1 gap-2'>
        <FaClock size={12}/>
        <p className='text-white-2'>{formatTime(duration)}</p>
      </div>
    </div>
  )
}

export default PodcastCard