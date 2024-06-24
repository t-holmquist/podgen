'use client'

import PodcastCard from '@/components/PodcastCard'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'
import { useAudio } from "@/providers/AudioProvider";
import LoaderSpinner from '@/components/LoaderSpinner'

const Profile = ( { params: { profileId } } : { params: { profileId: string } } ) => {

  const user = useQuery(api.users.getUserById, { clerkId: profileId})
  const userPodcasts = useQuery(api.podcasts.getPodcastByAuthorId, { authorId: profileId})

  const randomPodcast = userPodcasts?.podcasts[Math.floor(Math.random() * userPodcasts.podcasts.length)]
  if(!userPodcasts || !randomPodcast || !user ) return <LoaderSpinner/>

  // Hook into global audio state from AudioProvider
  const { setAudio } = useAudio();

  const handlePlay = () => {
    setAudio({
      title: randomPodcast?.podcastTitle,
      audioUrl: randomPodcast?.audioUrl || '',
      imageUrl: randomPodcast?.imageUrl || '',
      author: randomPodcast.author,
      podcastId: randomPodcast._id
    });
  };

  return (
    <section className='flex flex-col mt-10'>
      <h1 className='text-white-1 text-xl font-bold'>Podcaster Profile</h1>
      <div className='flex sm:gap-15 mt-10 flex-wrap gap-10'>
        <Image src={user?.imageUrl!} width={200} height={200} alt='profile' className='rounded-xl'/>
        <div className='flex flex-col gap-6'>
          <div className='flex gap-3'>
            <Image src='/icons/verified.svg' width={20} height={20} alt='verified'/>
            <p className='text-white-2 text-12'>Verified user</p>
          </div>
          <h2 className='text-white-1 font-bold text-20'>{user?.name}</h2>
          <div className='flex gap-3'>
            <Image src='/icons/headphone.svg' width={18} height={18} alt='headphone'/>
            <p className='text-white-1 text-12'>{userPodcasts?.listeners}<span className='text-white-3 ml-1'>monthly listeners</span></p>
          </div>
          <Button onClick={handlePlay} className='text-16 w-full bg-primaryPink-1 font-extrabold text-white-1'>
            Play a random podcast
          </Button>
        </div>
      </div>
      <section className='mt-10'>
      <h2 className='text-white-1 font-bold text-20'>All Podcasts</h2>
        <div className='podcast_grid mt-5'>
          {userPodcasts?.podcasts?.map(({ _id, imageUrl, podcastTitle, podcastDescription}) => (
                <PodcastCard
                key={_id}
                imgUrl={imageUrl!}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
                />
              ))}
        </div>
      </section>
    </section>
  )
}

export default Profile