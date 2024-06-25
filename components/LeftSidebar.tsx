'use client';


import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';
import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut } from "react-icons/io";
import { motion } from "framer-motion"

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
      paddingLeft: isOpen ? '25px' : '5px',
      paddingRight: isOpen ? '25px' : '5px',
    }}
    className={cn('left_sidebar h-[calc(100vh-5px)]', {'h-[calc(100vh-140px)] :' : audio?.audioUrl})}>
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
              <IoIosArrowBack className='hover:text-accent-1'/>
            ): (
              <IoIosArrowForward />
            )}
          </button>
        </div>
        
        {sidebarLinks.map(({ route, label, imgURL }) => {

          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return <motion.div layout ><Link href={route} key={label} className={cn('flex gap-3 items-center py-2 max-lg:px-4 justify-center hover:bg-accent-2 border border-primary-1 rounded-2xl', {'bg-accent-1': isActive})}>
            <Image src={imgURL} alt={label} width={20} height={20}/>
            {isOpen && (
              <p>{label}</p>
            )}
          </Link>
          </motion.div>
          })}
      </nav>
      {/* Different view depending on signin/out status */}
      <SignedOut>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button asChild className='text-16 w-full bg-primary-1 font-extrabold'>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className='flex items-center w-full pb-14'>
          <Button onClick={() => signOut(() => router.push('/'))} className='text-16 w-full hover:bg-accent-2 rounded-2xl border border-primary-1 font-extrabold'>
            {isOpen ? (
              'Log Out'
            ) : (
              <IoIosLogOut />
            )}
          </Button>
        </div>
      </SignedIn>
    </motion.div>
  )
}

export default LeftSidebar