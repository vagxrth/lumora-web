import React, { useState } from 'react'
import Modal from '../modal'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import EditVideoForm from '@/components/forms/edit-video'

type Props = { title: string; description: string; videoId: string }

const EditVideo = ({ description, title, videoId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Modal
      title="Edit video details"
      description="You can update your video details here!"
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button variant={'ghost'}>
          <Edit className="text-[#6c6c6c]" />
        </Button>
      }
    >
      <EditVideoForm
        videoId={videoId}
        title={title}
        description={description}
        onSuccess={handleSuccess}
      />
    </Modal>
  )
}

export default EditVideo