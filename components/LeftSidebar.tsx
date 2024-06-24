'use client';


import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button';

const LeftSidebar = () => {

  const pathname = usePathname();
  const router = useRouter();
  // sign out function coming from Clerk
  const { signOut } = useClerk();

  return (
    <section className='left_sidebar'>
      <nav className='flex flex-col gap-6'>
        <Link href='/' className='flex cursor-pointer items-center gap-2 pb-10 max-lg:justify-center'>
          <Image src='/icons/logo.svg' width={23} height={27} alt='logo'/>
          <h1 className='text-24 font-extrabold text-white-1 max-lg:hidden'>PodGen</h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {

          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {'bg-nav-focus border-r-4 border-primaryPink-1': isActive})}>
            <Image src={imgURL} alt={label} width={24} height={24}/>
            <p>{label}</p>
          </Link>
        })}
      </nav>
      {/* Different view depending on signin/out status */}
      <SignedOut>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button asChild className='text-16 w-full bg-primaryPink-1 font-extrabold'>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button onClick={() => signOut(() => router.push('/'))} className='text-16 w-full bg-primaryPink-1 font-extrabold'>
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  )
}

export default LeftSidebar