'use client'

import PodcastCard from '@/components/PodcastCard'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'
import { useAudio } from "@/providers/AudioProvider";
import LoaderSpinner from '@/components/LoaderSpinner'
import { MovingBorderButton } from '@/components/ui/movingBorder'
import { GiAchievement } from "react-icons/gi";

const Profile = ( { params: { profileId } } : { params: { profileId: string } } ) => {

  const user = useQuery(api.users.getUserById, { clerkId: profileId})
  const userPodcasts = useQuery(api.podcasts.getPodcastByAuthorId, { authorId: profileId})

  // Hook into global audio state from AudioProvider
  const { setAudio } = useAudio();

  const randomPodcast = userPodcasts?.podcasts[Math.floor(Math.random() * userPodcasts.podcasts.length)]
  if(!userPodcasts || !randomPodcast || !user ) return <LoaderSpinner/>

  

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
    <section className='flex flex-col mt-10 mb-20 sm:mb-10'>
      <h1 className='text-white-1 text-xl font-bold'>{`${user?.name}s Profile`}</h1>
      <div className='flex flex-col  sm:flex-row sm:gap-14 mt-10 lg:flex-nowrap gap-4'>
        <Image src={user?.imageUrl!} width={200} height={200} alt='profile' className='hidden sm:block rounded-xl'/>
        <Image src={user?.imageUrl!} width={300} height={200} alt='profile' className='sm:hidden rounded-xl'/>
        <div className='flex flex-col gap-6 mt-10 sm:mt-0'>
          <div className='flex gap-3'>
            <Image src='/icons/verified.svg' width={20} height={20} alt='verified'/>
            <p className='text-white-2 text-12'>Verified user</p>
          </div>
          <h2 className='text-white-1 font-bold text-20'>{user?.name}</h2>
          <div className='flex gap-3'>
            <Image src='/icons/headphone.svg' width={18} height={18} alt='headphone'/>
            <p className='text-white-1 text-12'>{userPodcasts?.listeners}<span className='text-white-3 ml-1'>monthly listeners</span></p>
          </div>
          <Button onClick={handlePlay} className='text-16 w-full max-w-[250px] border border-primary-1 font-extrabold rounded-2xl text-white-1 hover:bg-accent-2'>
            Play a random podcast
          </Button>
        </div>
        {/* Non dynamic achievements */}
        <div className='w-full max-w-[330px] mt-10 sm:mt-0'>
          <div className='flex justify-start sm:justify-center gap-2'>
            <GiAchievement className='text-white-1 bg-primary-1 rounded-full p-[2px]'/>
            <h2 className='text-white-2 text-12'>Achievements</h2>
          </div>
          <MovingBorderButton
          duration={11000}
          >
            <div className='flex justify-center flex-wrap gap-2 p-2'>
              <div className='text-12 text-white-1 border border-accent-1 rounded-2xl font-normal p-2'>30k listeners</div>
              <div className='text-12 text-white-1 border border-accent-1 rounded-2xl font-normal p-2'>5 Podcasts Created</div>
              <div className='text-12 text-white-1 border border-accent-1 rounded-2xl font-normal p-2'>Top 100 most popular</div>
              <div className='text-12 text-white-1 border border-accent-1 rounded-2xl font-normal p-2'>Top 5 in sports</div>
            </div>
          </MovingBorderButton>
        </div>
      </div>
      <section className='mt-10'>
      {/* Non dynamic about me */}
      <h2 className='mt-5 text-white-1 font-bold text-20'>{`About ${user?.name}`}</h2>
      <p className='mt-5 text-white-2 text-16'>I enjoy making content that people enjoy, but never had a great podcast voice. This platform enables me to get my thoughts out there without sacrificing both time and audio quality.</p>
      <h2 className='mt-5 text-white-1 font-bold text-20'>All Podcasts</h2>
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