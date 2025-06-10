'use client'
import { getFolderInfo, renameFolders } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { FolderProps } from '@/types/index.type'
import React, { useRef, useState } from 'react'
import FolderDuotone from '@/components/icons/folder-duotone'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useMutationData } from '@/hooks/useMutationData'
import Loader from '../loader'
import { toast } from '@/hooks/use-toast'

type Props = {
  folderId: string
}

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))
  const { data: folder } = data as FolderProps
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleError = () => {
    toast({
      variant: "destructive",
      title: "Error renaming folder",
      description: "Please try again later."
    })
    setIsEditing(false)
  }

  const { mutate, isPending } = useMutationData(
    ['rename-folder'],
    (data: { name: string }) => renameFolders(folderId, data.name),
    'folder-info',
    handleError
  )

  const handleRename = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (inputRef.current && inputRef.current.value) {
      mutate({ name: inputRef.current.value })
      setIsEditing(false)
      toast({
        title: "Folder renamed successfully"
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      if (inputRef.current) {
        inputRef.current.value = folder.name
      }
      setIsEditing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Loader state={isPending}>
        <div className="flex items-center gap-4">
          <FolderDuotone className="w-6 h-6" />
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                ref={inputRef}
                defaultValue={folder.name}
                autoFocus
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="text-[#BDBDBD] text-3xl font-medium bg-transparent border-none h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <>
                <h2 className="text-[#BDBDBD] text-3xl font-medium">{folder.name}</h2>
                <button 
                  onClick={handleRename}
                  className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <Pencil className="w-4 h-4 text-neutral-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </Loader>
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">{folder._count.videos} videos</span>
      </div>
    </div>
  )
}

export default FolderInfo