import { editVideoInfoSchema } from '@/components/forms/edit-video/schema'
import useZodForm from './useZodForm'
import { useMutationData } from './useMutationData'
import { editVideoInfo } from '@/actions/workspace'

export const useEditVideo = (
  videoId: string,
  title: string,
  description: string,
  onSuccess?: () => void
) => {
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string }) =>
      editVideoInfo(videoId, data.title, data.description),
    'preview-video',
    (response) => {
      if (response?.status === 200 && onSuccess) {
        onSuccess()
      }
    }
  )
  const { errors, onFormSubmit, register } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending }
}