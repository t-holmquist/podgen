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
import { cn } from "@/lib/utils";

const RightSidebar = () => {

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount)

  

  const { user } = useUser();
  const router = useRouter();

  const { audio } = useAudio();

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]', {'h-[calc(100vh-140px)] :' : audio?.audioUrl})}>
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
      <section className="flex flex-col gap-8 mt-5">
        <Header headerTitle='Top podcasters' link={true}/>
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 4).map((podcaster) => (
            <div onClick={() => router.push(`/profile/${podcaster.clerkId}`) } key={podcaster._id} className="flex cursor-pointer justify-between">
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
    </section>
  )
}

export default RightSidebar