'use client';

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import PodcastListItem from '@/components/PodcastListItem';
import Searchbar from '@/components/Searchbar';
import { categories } from '@/constants';
import { api } from '@/convex/_generated/api'
import { cn } from '@/utils/cn';
import { useQuery } from 'convex/react'
import React, { useState } from 'react'

const Discover = ({ searchParams: { search } }: { searchParams: { search: string} } ) => {

  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })

  const [category, setCategory] = useState('Education')
  const podcastByCategory = useQuery(api.podcasts.getPodcastByCategory, { category: category || 'Education' } )
  const TopPodcastByCategory = useQuery(api.podcasts.getTopPodcastByCategory, { category: category || 'Education' } )


  return (
    <div className='flex flex-col gap-9'>
      <Searchbar />
      <div className='flex flex-col gap-5'>
        <h1 className='text-16 font-bold text-white-1'>
          {!search ? 'Search for Podcast' : 'Search results for: '}
          {search && <span className='text-white-2'>{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className='podcast_grid'>
                {podcastsData?.slice(0, 5).map(({ _id, imageUrl, podcastTitle, podcastDescription}) => (
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
        <h2 className='text-16 font-bold text-white-1'>Discover by category: <span className='text-white-2'>{category}</span></h2>
        {/* Categories */}
        <div className='flex gap-2 text-white-1'>
          {categories.map((categorySelected) => (
            <button key={categorySelected} onClick={() => setCategory(categorySelected)} className={cn('bg-black-5 text-12 hover:bg-black-6 rounded-2xl p-2 font-bold', { 'bg-primary-1' : categorySelected === category } )}>{categorySelected}</button>
          ))}
        </div>
        {podcastByCategory ? (
          <div className='podcast_grid'>
            {podcastByCategory?.slice(0, 5).map(({ _id, imageUrl, podcastTitle, podcastDescription}) => (
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
          <LoaderSpinner />
        )}
        <h2 className='text-16 font-bold text-white-1 mt-5'>Top Podcasts in: <span className='text-white-2'>{category}</span></h2>
        <div className='flex justify-between items-center border-gray-1 border-opacity-30 border-b py-1 mt-5'>
          <div className='text-white-2'>Title</div>
          <div className='text-white-2 ml-40 sm:ml-72'>Views</div>
          <div className='text-white-2'>Duration</div>
        </div>
        <section className='pb-10 sm:pb-0'>
        {TopPodcastByCategory ? (
          <>
            {TopPodcastByCategory?.slice(0, 5).map(({ _id, imageUrl, podcastTitle, podcastDescription, views, audioDuration}) => (
              <PodcastListItem
              key={_id}
              imgUrl={imageUrl!}
              views={views}
              duration={audioDuration}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
              isCompact={false}
              />
            ))}
          </>
        ) : (
          <LoaderSpinner />
        )}
        </section>
      </div>
    </div>
  )
}

export default Discover