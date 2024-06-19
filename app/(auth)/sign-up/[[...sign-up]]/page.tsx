import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='flex-center h-screen w-full'>
      <SignUp />
    </div>
  )
}

export default Page