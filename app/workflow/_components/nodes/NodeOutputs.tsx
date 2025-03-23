import { Separator } from '@/components/ui/separator'
import React from 'react'

function NodeOutputs({children}:{children:React.ReactNode}) {
  return (
    <>
    <Separator/>
    <div className='flex flex-col'>{children}</div>
    </>
  )
}

export default NodeOutputs