import { useMutationData } from './useMutationData'
import { deleteVideo } from '@/actions/workspace'
import { useRouter } from 'next/navigation'

type DeleteVideoResponse = {
  status: number
  data?: string
  workspaceId?: string | null
  folderId?: string | null
}

export const useDeleteVideo = (videoId: string) => {
  const router = useRouter()
  
  const { mutate, isPending } = useMutationData(
    ['delete-video'],
    () => deleteVideo(videoId),
    'preview-video',
    async (response) => {
      if (response?.status === 200) {
        // Use a more reliable way to navigate after successful deletion
        const deleteResponse = response as DeleteVideoResponse
        const workspaceId = deleteResponse.workspaceId
        
        // Small delay to ensure the mutation completes
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (workspaceId) {
          // Replace the current route instead of pushing to avoid issues
          router.replace(`/dashboard/${workspaceId}`)
        } else {
          // Fallback to dashboard if no workspace info
          router.replace('/dashboard')
        }
      }
    }
  )

  return { deleteVideo: mutate, isPending }
} 