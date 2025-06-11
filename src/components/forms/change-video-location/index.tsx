import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useMoveVideos } from '@/hooks/useFolders'
import React from 'react'

type Props = {
  videoId: string
  currentFolder?: string
  currentWorkSpace?: string
  currentFolderName?: string
  onSuccess?: () => void
}

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkSpace,
  onSuccess,
}: Props) => {
  const {
    register,
    isPending,
    onFormSubmit: onSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkSpace!)

  const folder = folders.find((f: any) => f.id === currentFolder)
  const workspace = workspaces.find((f: any) => f.id === currentWorkSpace)

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(e)
    onSuccess?.()
  }

  return (
    <form
      className="flex flex-col gap-y-5"
      onSubmit={onFormSubmit}
    >
      <div className="border border-neutral-800 rounded-xl p-5">
        <h2 className="text-xs text-neutral-400">Current Workspace</h2>
        {workspace && <p className="text-neutral-200">{workspace.name}</p>}
        <h2 className="text-xs text-neutral-400 mt-4">Current Folder</h2>
        {folder ? <p className="text-neutral-200">{folder.name}</p> : 'This video has no folder'}
      </div>
      <Separator orientation="horizontal" className="bg-neutral-800" />
      <div className="flex flex-col gap-y-5 p-5 border border-neutral-800 rounded-xl">
        <h2 className="text-xs text-neutral-400">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-xs text-neutral-200">Workspace</p>
          <select
            className="rounded-xl text-base bg-neutral-900 border border-neutral-800 text-neutral-200 p-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            {...register('workspace_id')}
          >
            {workspaces.map((space: any) => (
              <option
                key={space.id}
                value={space.id}
                className="bg-neutral-900 text-neutral-200"
              >
                {space.name}
              </option>
            ))}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl bg-neutral-800" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs text-neutral-200">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register('folder_id')}
                className="rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 p-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
              >
                {isFolders.map((folder: any) => (
                  <option
                    key={folder.id}
                    value={folder.id}
                    className="bg-neutral-900 text-neutral-200"
                  >
                    {folder.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-neutral-400 text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button 
        variant="default"
        className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
        disabled={isPending}
      >
        <Loader
          state={isPending}
          color="#000"
        >
          Transfer
        </Loader>
      </Button>
    </form>
  )
}

export default ChangeVideoLocation