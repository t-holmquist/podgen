'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/utils/cn";
import PodcastListItem from "./PodcastListItem";

const RightSidebar = () => {

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount)
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts)

  

  const { user } = useUser();
  const router = useRouter();

  const { audio } = useAudio();

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]', {'h-[calc(100vh-90px)] :' : audio?.audioUrl})}>
      {/* If user is signed in then render jsx inside */}
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-3">
          <UserButton/>
          <div className="flex w-full items-center gap-3">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <Image src='/icons/notification.svg' width={15} height={15} alt="notification"/>
          </div>
        </Link>
      </SignedIn>
      <Header headerTitle='Other Creators' link={false}/>
      <Carousel fansLikeDetail={topPodcasters!}/>
      <section className="flex flex-col mt-5">
        <Header headerTitle='Top podcasters' link={true}/>
        <div className="flex flex-col gap-2 mt-5">
          {topPodcasters?.slice(0, 4).map((podcaster) => (
            <div onClick={() => router.push(`/profile/${podcaster.clerkId}`) } key={podcaster._id} className="flex cursor-pointer justify-between hover:bg-black-1 rounded-lg p-2">
              <figure className="flex items-center gap-2">
                <Image 
                src={podcaster.imageUrl} 
                alt={podcaster.name}
                width={44}
                height={44}
                className="aspect-square rounded-lg"
                />
                <h2 className="text-14 text-white-1 font-semibold">{podcaster.name}</h2>
              </figure>

              <div className="flex items-center">
                <p className="text-12 font-normal text-white-2">{podcaster.totalPodcasts} {podcaster.totalPodcasts > 0 ? 'podcasts' : 'podcast'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col mt-10">
        <h2 className='text-16 font-bold text-white-1 mb-5'>Recently Added</h2>
          {trendingPodcasts?.slice(0, 3).map(({ _id, imageUrl, podcastTitle, podcastDescription, views, audioDuration}) => (
              <PodcastListItem
              key={_id}
              imgUrl={imageUrl!}
              views={views}
              duration={audioDuration}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
              isCompact={true}
              />
          ))}
      </section>
    </section>
  )
}

export default RightSidebar