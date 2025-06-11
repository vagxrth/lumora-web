import React, { useState } from 'react'
import Modal from '../modal'
import { Move } from 'lucide-react'
import ChangeVideoLocation from '@/components/forms/change-video-location'

type Props = {
  videoId: string
  currentWorkspace?: string
  currentFolder?: string
  currentFolderName?: string
}

const CardMenu = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="Move this video to a different workspace or folder. This will help you keep your content organized."
      trigger={
        <Move
          size={20}
          className="text-neutral-400 hover:text-neutral-200 transition-colors"
        />
      }
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <ChangeVideoLocation
        currentFolder={currentFolder}
        currentWorkSpace={currentWorkspace}
        videoId={videoId}
        currentFolderName={currentFolderName}
        onSuccess={() => setIsOpen(false)}
      />
    </Modal>
  )
}

export default CardMenu