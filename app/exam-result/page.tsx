import Link from 'next/link'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { BsFillPlusCircleFill } from 'react-icons/bs'

export default function ExamResult() {
    return (
        <div>
            <div className=" h-full  justify-center">
                <div className='flex text-white justify-between  items-center px-4 bg-[#03D3D4]  h-[50px] gap-5'>
                    <div className='flex gap-3'>
                        <Link href='/dashboard'>
                            <IoMdArrowRoundBack className='items-center mt-1' size={25} />
                        </Link>

                        <p className='text-xl font-bold items-center'>
                            Exam Result
                        </p>
                    </div>
                </div>
                <div className='bg-gray-100 h-[760px] relative  flex flex-col'>


                    <Link href='/mark-entry'>
                        <BsFillPlusCircleFill
                            size={50} className='ml-[430px] bottom-5 right-5 absolute fill-blue-700 ' />
                    </Link>


                </div>
            </div>

        </div>
    )
}


