'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


const MobileNav = () => {

  const pathname = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image src='/icons/hamburger.svg' width={30} height={30} alt="mobile menu" className="cursor-pointer"/>
        </SheetTrigger>
        <SheetContent side='left' className="border-none bg-black-1">
          <Link href='/' className='flex cursor-pointer items-center gap-2 pb-10 pl-4'>
            <Image src='/icons/logo.svg' width={23} height={27} alt='logo'/>
            <h1 className='text-24 font-extrabold text-white-1 ml-2'>PodGen</h1>
          </Link>
          {/* Full screen hights minus media player hights to avoid overlap */}
          <div className="flex flex-col h-[calc(100vh-72px)] justify-between overflow-y-auto">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 text-white-1">
              {sidebarLinks.map(({ route, label, imgURL }) => {
              const isActive = pathname === route || pathname.startsWith(`${route}/`);
              return <SheetClose asChild key={route}><Link href={route} className={cn('flex gap-3 items-center py-4 max-lg:px-4', {'bg-nav-focus border-r-4 border-primaryPink-1': isActive})}>
                <Image src={imgURL} alt={label} width={24} height={24}/>
                <p>{label}</p>
              </Link>
              </SheetClose>
              })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav