import {Separator} from '../../components/ui/separator';
import Header from '@/components/Header';

function layout({children}:{children:React.ReactNode}) {

  return (
    <div className='flex'>
    <div className="flex flex-col flex-1">
        <Header/>
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