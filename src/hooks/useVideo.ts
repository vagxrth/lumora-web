import { createCommentSchema } from '@/components/forms/comment-form/schema'
import { useMutationData } from './useMutationData'
import { useQueryData } from './useQueryData'
import useZodForm from './useZodForm'
import { createCommentAndReply, getUserProfile } from '@/actions/user'
import { useRef } from 'react'

export const useVideoComment = (videoId: string, commentId?: string) => {
  const { data } = useQueryData(['user-profile'], getUserProfile)

  const { data: user } = data as {
    status: number
    data: { id: string; image: string }
  }

  const resetFormRef = useRef<(() => void) | null>(null)

  const { isPending, mutate } = useMutationData(
    ['new-comment'],
    (data: { comment: string }) =>
      createCommentAndReply(user.id, data.comment, videoId, commentId),
    'video-comments',
    (response) => {
      if ((response?.status === 200 || response?.status === 201) && resetFormRef.current) {
        resetFormRef.current()
      }
    }
  )

  const { register, onFormSubmit, errors, reset } = useZodForm(
    createCommentSchema,
    mutate
  )

  resetFormRef.current = reset
  
  return { register, errors, onFormSubmit, isPending }
}