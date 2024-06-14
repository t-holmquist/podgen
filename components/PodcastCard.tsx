import React from 'react'
import Image from 'next/image'

const PodcastCard = ( { imgURL, title, description, podcastId } : {imgURL: string, title: string, description: string, podcastId: number} ) => {
  return (
    <div className='cursor-pointer'>
      <figure className='flex flex-col gap-2'>
        <Image 
          src={imgURL}
          width={174}
          height={174}
          alt={title}
        />
        <div>
          <h1 className='text-16 truncate font-bold text-white-1'>{title}</h1>
          <h2 className='text-12 truncate font-normal capitalize text-white-4'>{description}</h2>
        </div>
      </figure>
    </div>
  )
}

export default PodcastCard