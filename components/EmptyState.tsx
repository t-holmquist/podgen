import { EmptyStateProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ( { title, search, buttonLink, buttonText } : EmptyStateProps) => {
  return (
    <section className='flex-center size-full flex-col gap-3'>
        <Image src='/icons/emptyState.svg' width={250} height={250} alt='empty-state'/>
        <div className='flex-center w-full max-w-[254px] flex-col gap-3'>
            <h1 className='text-16 text-center font-medium text-white-1'>
                {title}
            </h1>

            {/* If we are searching */}
            {search && (
                <p className='text-16 text-center text-white-2 font-medium'>Try changing your search to find similar podcasts</p>
            )}

            {buttonLink && (
                <Button className='border border-primary-1 rounded-2xl hover:bg-accent-1'>
                    <Link href={buttonLink} className='flex gap-1'>
                        <Image
                        src='/icons/lightning.svg'
                        width={20}
                        height={20}
                        alt='discover'
                        />
                        <h2 className='text-white-1 text-16 font-extrabold'>
                            {buttonText}
                        </h2>
                    </Link>
                </Button>
            )}
        </div>
    </section>
  )
}

export default EmptyState