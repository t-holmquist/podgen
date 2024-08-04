'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/utils/cn"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { Button } from "./ui/button"
import { IoIosLogIn, IoIosLogOut } from "react-icons/io"


const MobileNav = () => {

  const pathname = usePathname();

  const router = useRouter();

  const { signOut } = useClerk();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src='/icons/hamburger.svg' width={30} height={30} alt="mobile menu" className="cursor-pointer"/>
        </SheetTrigger>
        <SheetContent side='left' className="border-none bg-black-3">
          <Link href='/' className='flex cursor-pointer items-center gap-2 pb-10 pl-4'>
            <Image src='/icons/logo-diamond.svg' width={35} height={35} alt='logo'/>
            <h1 className='text-24 font-extrabold text-white-1 ml-2'>PodGen</h1>
          </Link>
          {/* Full screen hights minus media player hights to avoid overlap */}
          <div className="flex flex-col h-[calc(100vh-72px)] overflow-y-auto">
            <SheetClose>
              <nav className="flex h-full flex-col gap-6 text-white-1">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                const isActive = pathname === route || pathname.startsWith(`${route}/`);
                return <SheetClose key={route}><Link href={route} key={label} className={cn('flex gap-3 items-center py-2 max-lg:px-4 justify-center hover:bg-slate-900 border border-primary-1 rounded-2xl', {'bg-accent-1': isActive})}>
                  <Image src={imgURL} alt={label} width={24} height={24}/>
                  <p>{label}</p>
                </Link>
                </SheetClose>
                })}
                {/* Different view depending on signin/out status */}
                <SignedOut>
                  <div className='flex items-center w-full'>
                    <Button onClick={() => router.push('/sign-in')} className='flex text-16 gap-3 w-full hover:bg-slate-900 rounded-2xl border border-primary-1'>
                        <IoIosLogIn size={22} />
                        <p className="text-16 text-white-1">Sign In</p>
                    </Button>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className='flex items-center w-full'>
                    <Button onClick={() => signOut(() => router.push('/'))} className='flex gap-3 w-full hover:bg-slate-900 rounded-2xl border border-primary-1'>
                      <IoIosLogOut size={22}/>
                      <p className="text-16 text-white-1">Log Out</p>
                    </Button>
                  </div>
                </SignedIn>
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav