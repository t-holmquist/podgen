import PodcastCard from '@/components/PodcastCard'
import { podcastData } from '@/constants'

const page = () => {
  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending podcasts</h1>

        <div className='podcast_grid'>
          {podcastData.map(({ id, imgURL, title, description}) => (
            <PodcastCard
            key={id}
            imgURL={imgURL}
            title={title}
            description={description}
            podcastId={id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default page