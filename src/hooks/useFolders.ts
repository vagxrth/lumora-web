import { useEffect, useState } from 'react'
import { useMutationData } from './useMutationData'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import useZodForm from './useZodForm'
import { moveVideoSchema } from '@/components/forms/change-video-location/schema'
import { useAppSelector } from '@/redux/store'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

type MoveVideoResponse = {
  status: number
  data: {
    message: string
  }
}

// Extended type to include current workspace for proper invalidation
type MoveVideoVariables = z.infer<typeof moveVideoSchema> & {
  currentWorkspace: string
}

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
  const queryClient = useQueryClient()
  //get state redux
  const { folders } = useAppSelector((state: any) => state.FolderReducer)
  const { workspaces } = useAppSelector((state: any) => state.WorkSpaceReducer)

  // fetching states
  const [isFetching, setIsFetching] = useState(false)
  //stat folders
  const [isFolders, setIsFolders] = useState<
    | ({
        _count: {
          videos: number
        }
      } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
      })[]
    | undefined
  >(undefined)

  //use mutation data optimisc
  const { mutate, isPending } = useMutationData<MoveVideoResponse, MoveVideoVariables>(
    ['change-video-location'],
    (data) => moveVideoLocation(videoId, data.workspace_id, data.folder_id || ''),
    undefined,
    async (response, variables) => {
      if (response?.status === 200) {
        await Promise.all([
          // Invalidate workspace videos for both source and destination
          queryClient.invalidateQueries({ queryKey: [`workspace-videos-${variables.currentWorkspace}`] }),
          queryClient.invalidateQueries({ queryKey: [`workspace-videos-${variables.workspace_id}`] }),
          // Invalidate folder info to update video counts
          queryClient.invalidateQueries({ queryKey: ['folder-info'] }),
          // Invalidate workspace folders to update folder video counts
          queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
        ])
      }
    },
    async (error, variables) => {
      // Handle error by showing detailed notification
      toast('Failed to move video', {
        description: `Could not move video to ${variables.workspace_id}. Please try again.`,
      })
      
      // Optionally refresh the current workspace data to ensure consistency
      await queryClient.invalidateQueries({ 
        queryKey: [`workspace-videos-${variables.currentWorkspace}`] 
      })
    }
  )

  // Custom mutate function that includes currentWorkspace
  const moveVideo = (data: z.infer<typeof moveVideoSchema>) => {
    mutate({ ...data, currentWorkspace })
  }

  //usezodform
  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    moveVideo,
    { folder_id: undefined, workspace_id: currentWorkspace }
  )

  //fetchfolders with a use effeect
  const fetchFolders = async (workspace: string) => {
    setIsFetching(true)
    const folders = await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
  }
  useEffect(() => {
    fetchFolders(currentWorkspace)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const workspace = watch(async (value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id)
    })

    return () => workspace.unsubscribe()
  }, [watch])

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  }
}