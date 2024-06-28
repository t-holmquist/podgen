'use client';


import { sidebarLinks } from '@/constants'
import { cn } from '@/utils/cn'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { motion } from "framer-motion"
import { LucideArrowLeftToLine, LucideArrowRightToLine } from 'lucide-react';
import { GlareCard } from './ui/glare-card';
import { FaGithub } from 'react-icons/fa';

const LeftSidebar = () => {

  const pathname = usePathname();
  const router = useRouter();
  // sign out function coming from Clerk
  const { signOut } = useClerk();

  const { audio } = useAudio();

  // State for open/closed left sidebar
  const [isOpen, setIsOpen] = useState(true)
  

  return (
    // change sidebar hight depending on audioplaying or not
    <motion.div 
    initial={{
      width: 240,
      paddingLeft: '25px',
      paddingRight: '25px',
    }}
    animate={{
      width: isOpen ? 240 : 80,
      paddingLeft: isOpen ? '25px' : '0px',
      paddingRight: isOpen ? '25px' : '0px',
    }}
    className={cn('left_sidebar h-[calc(100vh-5px)]', {'h-[calc(100vh-90px)] :' : audio?.audioUrl})}>
      <nav className={cn('flex flex-col gap-6', {'gap-10' : isOpen})}>
        <div className='flex items-center justify-between pb-10'>
          <Link href='/' className='flex items-center cursor-pointer'>
            <Image src='/icons/logo-diamond.svg' width={50} height={50} alt='logo'/>
            {isOpen && (
              <h1 className='text-24 font-extrabold text-white-1 max-lg:hidden'>PodGen</h1>
            )}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <LucideArrowLeftToLine size={20} className='hover:text-accent-1'/>
            ): (
              <LucideArrowRightToLine size={20} className='hover:text-accent-1 mr-2'/>
            )}
          </button>
        </div>
        
        {sidebarLinks.map(({ route, label, imgURL }) => {

          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return <motion.div layout key={label} ><Link href={route} key={label} className={cn('flex gap-3 items-center py-2 mx-3 justify-center hover:bg-accent-2 border border-primary-1 rounded-2xl', {'bg-accent-1': isActive})}>
            <Image src={imgURL} alt={label} width={20} height={20}/>
            {isOpen && (
              <p>{label}</p>
            )}
          </Link>
          </motion.div>
          })}
      </nav>
      <div className='flex flex-col gap-10'>
        {isOpen && (
          <motion.div layout>
            <Link href='https://github.com/t-holmquist/podgen'>
              <GlareCard className='flex flex-col items-start justify-start py-8 px-6 gap-2'>
                <h2 className='font-extrabold'>This is a porfolio project</h2>
                <p className='text-12 text-white-2'>It is developed by myself <span className='text-white-1 font-bold'>Tjalfe Holmquist</span>
                </p>
                <p className='flex gap-2 text-white-2 text-12'>
                  Click to read more
                  <FaGithub size={15}/>
                </p>
              </GlareCard>
            </Link>
          </motion.div>
        )}
        {/* Different view depending on signin/out status */}
        <SignedOut>
          <div className='flex-center items-center w-full pb-14'>
            <Button asChild className='text-16 w-full hover:bg-accent-2 mx-3 rounded-2xl border border-primary-1 font-extrabold'>
              {isOpen ? (
                <Link href='/sign-in'>Sign in</Link>
              ) : (
                <Link href='/sign-in'>
                  <IoIosLogIn />
                </Link>
              )} 
            </Button>
          </div>
        </SignedOut>
        <SignedIn>
          <div className='flex items-center w-full pb-14'>
            <Button onClick={() => signOut(() => router.push('/'))} className='text-16 w-full hover:bg-accent-2 mx-3 rounded-2xl border border-primary-1 font-extrabold'>
              {isOpen ? (
                'Log Out'
              ) : (
                <IoIosLogOut />
              )}
            </Button>
          </div>
        </SignedIn>
      </div>
    </motion.div>
  )
}

export default LeftSidebar