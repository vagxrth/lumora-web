'use server'

import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { sendEmail } from './user'
import { createClient, OAuthStrategy } from '@wix/sdk'
import { items } from '@wix/data'
import axios from 'axios'

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    })
    return {
      status: 200,
      data: { workspace: isUserInWorkspace },
    }
  } catch (error) {
    return {
      status: 403,
      data: { workspace: null },
    }
  }
}

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders }
    }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 403, data: [] }
  }
}

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const videos = await client.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (videos && videos.length > 0) {
      return { status: 200, data: videos }
    }

    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser()

    if (!user) return { status: 404 }

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })

    if (workspaces) {
      return { status: 200, data: workspaces }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const createWorkspace = async (name: string, type: 'PERSONAL' | 'PUBLIC') => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (authorized?.subscription?.plan === 'PRO') {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type,
            },
          },
        },
      })
      if (workspace) {
        return { status: 201, data: 'Workspace Created' }
      }
    }
    return {
      status: 401,
      data: 'You are not authorized to create a workspace.',
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    })
    if (folder) {
      return { status: 200, data: 'Folder Renamed' }
    }
    return { status: 400, data: 'Folder does not exist' }
  } catch (error) {
    return { status: 500, data: 'Opps! something went wrong' }
  }
}

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: 'Untitled' },
        },
      },
    })
    if (isNewFolder) {
      return { status: 200, message: 'New Folder Created' }
    }
  } catch (error) {
    return { status: 500, message: 'Oppse something went wrong' }
  }
}

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (folder)
      return {
        status: 200,
        data: folder,
      }
    return {
      status: 400,
      data: null,
    }
  } catch (error) {
    return {
      status: 500,
      data: null,
    }
  }
}

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    })
    if (location) return { status: 200, data: 'Folder changed successfully' }
    return { status: 404, data: 'workspace/folder not found' }
  } catch (error) {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    })
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      }
    }

    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const firstViewSettings = await client.user.findUnique({
      where: { clerkid: user.id },
      select: {
        firstView: true,
      },
    })
    if (!firstViewSettings?.firstView) return

    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    })
    if (video && video.views === 0) {
      await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          views: video.views + 1,
        },
      })

      const userEmail = video.User?.email
      if (!userEmail) return { status: 400, message: 'User email not found' }

      const { transporter, mailOptions } = await sendEmail(
        userEmail,
        'You got a viewer',
        `Your video ${video.title} just got its first viewer`
      )

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error.message)
        } else {
          const notification = await client.user.update({
            where: { clerkid: user.id },
            data: {
              notification: {
                create: {
                  content: mailOptions.text,
                },
              },
            },
          })
          if (notification) {
            return { status: 200 }
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const editVideoInfo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const video = await client.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
      },
    })
    if (video) return { status: 200, data: 'Video successfully updated' }
    return { status: 404, data: 'Video not found' }
  } catch (error) {
    return { status: 400 }
  }
}

export const howToPost = async () => {
  try {
    const response = await axios.get(process.env.CLOUD_WAYS_POST as string)
    if (response.data) {
      return {
        title: response.data[0].title.rendered,
        content: response.data[0].content.rendered,
      }
    }
  } catch (error) {
    return { status: 400 }
  }
}

export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, message: 'User not found' }

    // Check if user has permission to delete this workspace
    const workspace = await client.workSpace.findFirst({
      where: {
        id: workspaceId,
        User: {
          clerkid: user.id
        }
      },
      select: { 
        id: true,
        folders: {
          select: {
            id: true
          }
        }
      }
    })

    if (!workspace) {
      return { status: 403, message: 'Not authorized to delete this workspace' }
    }

    // Check if this is the user's initial workspace (first created)
    const initialWorkspace = await client.workSpace.findFirst({
      where: {
        User: {
          clerkid: user.id
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: { id: true }
    })
    
    if (workspaceId === initialWorkspace?.id) {
      return { 
        status: 403, 
        message: 'Cannot delete your initial workspace' 
      }
    }

    // Delete workspace and all related content in a transaction
    await client.$transaction(async (tx) => {
      // First delete all videos in the workspace
      // This includes videos directly in workspace (null folderId) and those in folders
      await tx.video.deleteMany({
        where: {
          OR: [
            { workSpaceId: workspaceId },
            {
              Folder: {
                workSpaceId: workspaceId
              }
            }
          ]
        }
      })

      // Then delete all folders in the workspace
      if (workspace.folders && workspace.folders.length > 0) {
        await tx.folder.deleteMany({
          where: {
            workSpaceId: workspaceId
          }
        })
      }

      // Finally delete the workspace itself
      await tx.workSpace.delete({
        where: {
          id: workspaceId
        }
      })
    })

    return { status: 200, message: 'Workspace deleted successfully' }
  } catch (error) {
    console.error('Error deleting workspace:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return { status: 409, message: 'Cannot delete workspace with existing content' }
    }
    
    return { status: 500, message: 'Failed to delete workspace' }
  }
}

export const deleteFolder = async (folderId: string) => {
  try {
    // Get current user for authorization
    const user = await currentUser()
    if (!user) {
      return { status: 401, data: { message: 'Unauthorized' } }
    }

    // First get the folder with its workspace and user info
    const folder = await client.folder.findFirst({
      where: {
        id: folderId
      },
      select: {
        id: true,
        workSpaceId: true,
        WorkSpace: {
          select: {
            User: {
              select: {
                clerkid: true
              }
            }
          }
        },
        videos: {
          select: {
            source: true
          }
        }
      }
    })

    if (!folder) {
      return { status: 404, data: { message: 'Folder not found' } }
    }

    // Verify user has permission to delete this folder
    if (folder.WorkSpace?.User?.clerkid !== user.id) {
      return { status: 403, data: { message: 'Not authorized to delete this folder' } }
    }

    // Start a transaction to ensure atomicity
    return await client.$transaction(async (tx) => {
      // Delete all videos in the folder
      if (folder.videos && folder.videos.length > 0) {
        // First delete video files from storage
        const videoSources = folder.videos.map((video: { source: string }) => video.source)
        // TODO: Add your external storage cleanup here
        // Example: await Promise.all(videoSources.map(source => deleteFromStorage(source)))

        // Then delete video records from database
        await tx.video.deleteMany({
          where: {
            folderId: folderId
          }
        })
      }

      // Delete the folder itself
      await tx.folder.delete({
        where: {
          id: folderId
        }
      })

      return {
        status: 200,
        data: {
          message: 'Folder and all its videos deleted successfully',
          workspaceId: folder.workSpaceId
        }
      }
    })
  } catch (error) {
    console.error('Error deleting folder:', error)
    if (error instanceof Error) {
      return { 
        status: 500, 
        data: { 
          message: error.message || 'Failed to delete folder and its contents' 
        } 
      }
    }
    return { status: 500, data: { message: 'Oops! something went wrong' } }
  }
}