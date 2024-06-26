'use client';

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search } }: { searchParams: { search: string} } ) => {

  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })


  return (
    <div className='flex flex-col gap-9'>
      <Searchbar />
      <div className='flex flex-col gap-5'>
        <h1 className='text-16 font-bold text-white-1'>
          {!search ? 'Search for Podcast' : 'Search results for '}
          {search && <span className='text-white-2'>{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className='podcast_grid'>
                {podcastsData?.slice(0, 4).map(({ _id, imageUrl, podcastTitle, podcastDescription}) => (
                  <PodcastCard
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title='No results found'/>
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
        <h2 className='text-16 font-bold text-white-1'>Discover by category</h2>
        {/* Categories */}
        <div className='flex gap-2'>
          <button className='text-white-1 text-12 bg-primary-1 rounded-2xl p-2 font-bold'>Food</button>
          <button className='text-white-1 text-12 bg-primary-1 rounded-2xl p-2 font-bold'>Technology</button>
          <button className='text-white-1 text-12 bg-primary-1 rounded-2xl p-2 font-bold'>Health</button>
          <button className='text-white-1 text-12 bg-primary-1 rounded-2xl p-2 font-bold'>Pop culture</button>
        </div>
      </div>
    </div>
  )
}

export default Discover