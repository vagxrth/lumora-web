'use client'
import CommentForm from '@/components/forms/comment-form'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import CommentCard from '../comment-card'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import { VideoCommentProps } from '@/types/index.type'

type Props = {
  author: string
  videoId: string
}

const Comments = ({ author, videoId }: Props) => {
  const { data } = useQueryData(['video-comments', videoId], () =>
    getVideoComments(videoId)
  )

  const { data: comments } = data || { data: [] }


  return (
    <TabsContent
      value="Comments"
      className="rounded-xl flex flex-col gap-y-5 px-4 pt-0 pb-4 mt-0"
    >
      <CommentForm
        author={author}
        videoId={videoId}
      />
      {comments?.map((comment) => (
        <CommentCard
          comment={comment.comment}
          key={comment.id}
          author={{
            image: comment.User?.image ?? '/image.png',
            firstname: comment.User?.firstname ?? 'Anonymous',
            lastname: comment.User?.lastname ?? 'User',
          }}
          videoId={videoId}
          reply={comment.reply}
          commentId={comment.id}
          createdAt={comment.createdAt}
        />
      ))}
    </TabsContent>
  )
}

export default Comments