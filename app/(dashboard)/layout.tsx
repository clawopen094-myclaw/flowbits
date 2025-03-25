import React from 'react'
import {Separator} from '../../components/ui/separator';
import {FloatingDockDemo} from '@/components/DockMenu';
import Header from '@/components/Header';


function layout({children}:{children: React.ReactNode}) {


  return (
        <div className='flex flex-col flex-1'>
            <FloatingDockDemo/>
            <div className="flex flex-col flex-1">
                <Header/>
                <Separator/>
                <div className="overflow-auto">
                    <div className="flex-0 container py-4 text-accent-foreground">{children}</div>
                </div>
            </div>
        </div>
  )
}

export default layout;