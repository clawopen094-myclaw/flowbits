import React from 'react'

import {Separator} from '../../components/ui/separator';
import Header from '@/components/Header';
import { cookies } from 'next/headers'; // Import for cookie handling
import { Breadcrumb } from '@/components/ui/breadcrumb';

function layout({children}:{children:React.ReactNode}) {

  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className='flex'>
    <div className="flex flex-col flex-1">
        <Header/>
        {/* <Breadcrumb/> */}
        <Separator/>
        <div className="overflow-hidden">
            <div className="flex-1 text-accent-foreground">
              {children}
            </div>
        </div>
    </div>
</div>
  )
}

export default layout