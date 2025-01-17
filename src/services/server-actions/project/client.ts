'use client'

import withIntercept from 'src/lib/client/interceptor'
import * as project from './project'
import * as k8sPod from './k8sPod'
import * as functions from './functions'
import * as pages from './pages';
import * as setting from './setting';
import * as images from './images';

// project server actions
export const loadProject = withIntercept(project.loadProject)
export const createProject = withIntercept(project.create)
export const getProjectList = withIntercept(project.getList)
export const getProjectInfo = withIntercept(project.getInfo)
export const updateProject = withIntercept(project.update)
export const updateProjectInfo = withIntercept(project.updateInfo)
export const createPod = withIntercept(k8sPod.createPod)
export const runPod = withIntercept(k8sPod.runPod)
export const getPodStatus = withIntercept(k8sPod.getPodStatus)
export const deletePod = withIntercept(k8sPod.deletePod)
export const updateFunctions = withIntercept(functions.updateFunctions)
// pages
export const addPage = withIntercept(pages.addPage)
export const deletePage = withIntercept(pages.deletePage)
export const updatePageName = withIntercept(pages.updatePageName)
// setting
export const getSetting = withIntercept(setting.getSetting)
export function getFuncsParams(getFuncsParams: any): { run: any } {
  throw new Error('Function not implemented.')
}

export function getSysFuncs(getSysFuncs: any): { run: any } {
  throw new Error('Function not implemented.')
}

// images
export const uploadImage = withIntercept(images.uploadImage)
export const getImages = withIntercept(images.getImages)
