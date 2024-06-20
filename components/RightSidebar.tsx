'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const RightSidebar = () => {

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount)

  const { user } = useUser();

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
    </section>
  )
}

export default RightSidebar