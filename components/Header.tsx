import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const Header = ( { headerTitle, titleClassName, link } : { headerTitle?: string, titleClassName?: string, link?: boolean } ) => {
  return (
    <header className='flex items-center justify-between mt-5'>
        {headerTitle ? (
            <h1 className={cn('text-18 font-bold text-white-1', titleClassName)}>{headerTitle}</h1>
        ) : (
            <div/>
        )}
        {link && (
          <Link href='/discover' className='text-16 font-semibold text-secondary-1'>
          See all
          </Link>
        )}
    </header>
  )
}

export default Header