'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";

const RightSidebar = () => {

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount)

  

  const { user } = useUser();
  const router = useRouter();

  return (
    <section className='right_sidebar text-white-1'>
      {/* If user is signed in then render jsx inside */}
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-3">
          <UserButton/>
          <div className="flex w-full items-center justify-between">
            <h2 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <Image src='/icons/right-arrow.svg' width={24} height={24} alt="arrow"/>
          </div>
        </Link>
      </SignedIn>
      <Header headerTitle='Fans like you'/>
      <Carousel fansLikeDetail={topPodcasters!}/>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle='Top podcasters'/>
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
                <p className="text-12 font-normal">{podcaster.totalPodcasts} {podcaster.totalPodcasts > 0 ? 'podcasts' : 'podcast'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar