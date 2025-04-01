import Image from 'next/image';
import myLogo from "@/public/Logo.png";
import { Separator } from '@/components/ui/separator';
import Loading from '../workflow/_components/Loading';
import { Loader } from 'lucide-react';

export default function loading(){
    return (
    <div className='h-screen w-full flex flex-col items-center justify-center gap-4'>
        <div className='flex items-center'>
        <Image src={myLogo} alt="logo" width={40} height={40} className="rounded-md" />
        <h2 className='font-bold text-2xl'>Flowbits</h2>
        </div>
        <Separator className='max-w-xs' />
        <div className='flex items-center gap-2'>
        <Loader size={16} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />
        <p className='text-primary'>Setting up your account</p>
        </div>
    </div>
    )
}