import { howToPost } from '@/actions/workspace'
import HowToPost from '@/components/global/how-to-post'
import React from 'react'

type Props = {}

const Home = async (props: Props) => {
  const post = await howToPost()

  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <h1 className="text-2xl font-bold">A Message From The LUMORA Team</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:w-1/2">
        <HowToPost
          title={post?.title}
          html={post?.content}
        />
      </div>
    </div>
  )
}

export default Home