"use client"

import dynamic from 'next/dynamic'

export const DragDropContext = dynamic(() => import('react-beautiful-dnd').then(m => m.DragDropContext), { ssr: false })
export const Droppable = dynamic(() => import('react-beautiful-dnd').then(m => m.Droppable), { ssr: false })
export const Draggable = dynamic(() => import('react-beautiful-dnd').then(m => m.Draggable), { ssr: false })


