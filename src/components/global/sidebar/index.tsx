'use client'
import { getWorkSpaces } from '@/actions/workspace'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { NotificationProps, WorkspaceProps } from '@/types/index.type'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Menu, PlusCircle } from 'lucide-react'
import SidebarItem from './sidebar-item'
import { getNotifications } from '@/actions/user'
import WorkspacePlaceholder from './workspace-placeholder'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useDispatch } from 'react-redux'
import { useQueryData } from '@/hooks/useQueryData'
import { MENU_ITEMS } from '@/constants'
import Modal from '../modal'
import Search from '../search'
import GlobalCard from '../global-card'
import InfoBar from '../info-bar'
import PaymentButton from '../payment-button'
import { WORKSPACES } from '@/redux/slices/workspaces'
import CreateWorkspaceModal from '../create-workspace/create-workspace-modal'
import DeleteWorkspaceModal from '../delete-workspace/delete-workspace-modal'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {

  const router = useRouter()
  const pathName = usePathname()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const { data, isFetched } = useQueryData(['user-workspaces'], getWorkSpaces)
  const menuItems = MENU_ITEMS(activeWorkspaceId)

  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { data: workspace } = data as WorkspaceProps
  const { data: count } = notifications as NotificationProps

  const onChangeActiveWorkspace = async (value: string) => {
    try {
      // Invalidate queries before navigation
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspace-folders'] }),
        queryClient.invalidateQueries({ queryKey: ['user-videos'] })
      ])
    } catch (error) {
      // Log error but continue with navigation
      console.error('Failed to invalidate queries:', error)
    }
    // Continue with navigation regardless of query invalidation success/failure
    router.push(`/dashboard/${value}`)
  }
  const currentWorkspace = workspace.workspace.find(
    (s) => s.id === activeWorkspaceId
  )

  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }))
  }

  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 ">
        <Image
          src="/lumora.png"
          height={45}
          width={45}
          alt="logo"
        />
        <p className="text-2xl font-bold title">LUMORA</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem
                value={workspace.id}
                key={workspace.id}
              >
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem
                      value={workspace.WorkSpace.id}
                      key={workspace.WorkSpace.id}
                    >
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === 'PUBLIC' &&
        workspace.subscription?.plan == 'PRO' && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={15}
                  className="text-neutral-800/90 fill-neutral-500"
                />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              key={item.title}
              notifications={
                (item.title === 'Notifications' &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4 ">Workspaces</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === 'FREE'
              ? 'Upgrade to create workspaces'
              : 'No Workspaces'}
          </p>
        </div>
      )}

      {workspace.subscription?.plan === 'PRO' && (
        <CreateWorkspaceModal />
      )}

      <nav className="w-full">
        <ul className="max-h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item, index) => (
                <div key={item.id} className="flex items-center justify-between pr-2 group">
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                  {index !== 0 && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteWorkspaceModal workspaceId={item.id} workspaceName={item.name} />
                    </div>
                  )}
                </div>
              )
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <div key={item.WorkSpace.id} className="flex items-center justify-between pr-2 group">
                <SidebarItem
                  href={`/dashboard/${item.WorkSpace.id}`}
                  selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                  title={item.WorkSpace.name}
                  notifications={0}
                  icon={
                    <WorkspacePlaceholder>
                      {item.WorkSpace.name.charAt(0)}
                    </WorkspacePlaceholder>
                  }
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteWorkspaceModal 
                    workspaceId={item.WorkSpace.id} 
                    workspaceName={item.WorkSpace.name} 
                  />
                </div>
              </div>
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {workspace.subscription?.plan === 'FREE' && (
        <GlobalCard
          title="Upgrade to Pro"
          description=" Unlock AI features like transcription, AI summary, and more..."
          footer={<PaymentButton />}
        />
      )}
    </div>
  )
  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger
            asChild
            className="ml-2"
          >
            <Button
              variant={'ghost'}
              className="mt-[2px]"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={'left'}
            className="p-0 w-fit h-full"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  )
}

export default Sidebar