import React from 'react'
import Image from 'next/image'
import { PodcastCardProps } from '@/types'
import { useRouter } from 'next/navigation'

const PodcastCard = ( { imgUrl, title, description, podcastId } : PodcastCardProps ) => {

  const router = useRouter();
  // navigate to podcast page with specific id
  const handleViews = () => {
    // increase views
    router.push(`/podcasts/${podcastId}`, {
      scroll: true
    })
  }

  return (
    <div key={podcastId} onClick={handleViews} className='cursor-pointer hover:bg-black-1 rounded-lg'>
      <figure className='flex flex-col gap-2 p-3'>
        <Image 
          src={imgUrl}
          width={174}
          height={174}
          alt={title}
          className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'
        />
        <div className='flex flex-col'>
          <h1 className='text-12 truncate font-bold text-white-1'>{title}</h1>
          <h2 className='text-12 truncate font-normal capitalize text-white-4'>{description}</h2>
        </div>
      </figure>
    </div>
  )
}

export default PodcastCard