"use client";
import PodcastCard from '@/components/PodcastCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import PodcastListItem from '@/components/PodcastListItem';
import LoaderSpinner from '@/components/LoaderSpinner';





const Home = () => {

  // get podcasts from convex db
  const trendingPodcasts= useQuery(api.podcasts.getTrendingPodcasts);

  // get user and display name if exists
  const { user } = useUser();

  if(!user || !trendingPodcasts) return <LoaderSpinner />
  

  return (
    <div className='mt-9 flex flex-col gap-9'>
      <div className='flex justify-center'>
        <h1 className='text-20 font-bold text-white-1 bg-black-2 rounded-2xl w-fit p-2'>{user ? 'Welcome back - ' + user?.firstName : 'Welcome to PodGen!'}</h1>
      </div>
      <section className='flex flex-col'>
        <h2 className='text-16 font-bold text-white-1'>{user ? 'Continue where you left off' : 'Many people like these'}</h2>
        <div className='podcast_grid mt-5'>
          {trendingPodcasts?.slice(0, 5).map(({ _id, imageUrl, podcastTitle, podcastDescription}) => (
            <PodcastCard
            key={_id}
            imgUrl={imageUrl!}
            title={podcastTitle}
            description={podcastDescription}
            podcastId={_id}
            />
          ))}
        </div>
        <h2 className='text-16 font-bold text-white-1 mt-5'>Most popular podcasts</h2>
        <section className='flex justify-between items-center border-gray-1 border-opacity-30 border-b py-1 mt-5'>
          <div className='text-white-2'>Title</div>
          <div className='text-white-2 ml-72'>Views</div>
          <div className='text-white-2'>Duration</div>
        </section>
        {trendingPodcasts?.slice(0, 4).map(({ _id, imageUrl, podcastTitle, podcastDescription, views, audioDuration}) => (
            <PodcastListItem
            key={_id}
            imgUrl={imageUrl!}
            views={views}
            duration={audioDuration}
            title={podcastTitle}
            description={podcastDescription}
            podcastId={_id}
            />
        ))}
      </section>
    </div>
  )
}

export default Home