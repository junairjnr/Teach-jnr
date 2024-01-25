import Link from 'next/link'
import { IoMdArrowRoundBack } from 'react-icons/io'

export default function SchoolDiary() {
    return (
        <div>
            <div className=" h-[760px]  justify-center">
                <div className='flex text-white justify-between  items-center px-4 bg-[#03D3D4]  h-[50px] gap-5'>
                    <div className='flex gap-3'>
                        <Link href='/exam-result'>
                            <IoMdArrowRoundBack className='items-center mt-1' size={25} />
                        </Link>

                        <p className='text-xl font-bold items-center'>
                            Mark Entry
                        </p>
                    </div>
                </div>
                <div className='bg-gray-100 h-[760px] relative  flex flex-col'>
                    <div className='bg-gray-200 p-1 gap-2'>

                        <div className='justify-between gap-2 flex p-1'>
                            <select className='bg-white text-base font-sans font-semibold  outline-none h-[30px] w-[50%] border-2 text-gray-800 rounded-md '>
                                <option className=' font-sans'>Class</option>
                                <option className=' font-sans '>+1 science</option>
                                <option className=' font-sans '>+1 commerce</option>
                                <option className=' font-sans '>+1 humanities</option>
                            </select>
                            <select className='bg-white text-base font-sans font-semibold  outline-none h-[30px] w-[50%] border-2 text-gray-800 rounded-md '>
                                <option className=' font-sans'>Division</option>
                                <option className=' font-sans'>A</option>
                                <option className=' font-sans'>B</option>
                                <option className=' font-sans'>C</option>
                            </select>
                        </div>
                        <div className='p-1'>
                            <select className='bg-white text-base font-sans font-semibold  outline-none h-[30px] w-full border-2 text-gray-800 rounded-md '>
                                <option className=' font-sans'>Select Exam</option>
                            </select>
                        </div>
                        <div className='justify-between flex p-1 gap-2'>
                            <select className='bg-white text-base font-sans font-semibold  outline-none h-[30px] w-[50%] border-2 text-gray-800 rounded-md '>
                                <option className=' font-sans'>select</option>
                                <option className=' font-sans'>+1 science</option>
                                <option className=' font-sans'>+1 commerce</option>
                                <option className=' font-sans'>+1 humanities</option>
                            </select>
                            <select className='bg-white text-base font-sans font-semibold  outline-none h-[30px] w-[50%] border-2 text-gray-800 rounded-md '>
                                <option className=' font-sans'>select</option>
                                <option className=' font-sans'>A</option>
                                <option className=' font-sans'>B</option>
                                <option className=' font-sans'>C</option>
                            </select>
                        </div>

                    </div>
                    <table className='w-full bg-white mb-10'>
                        <thead>
                            <tr className='bg-teal-900 text-white'>
                                <th className='text-center w-[80px] font-normal p-2 border border-1 border-black'>Roll No</th>
                                <th className='text-center w-[100px] font-normal p-2 border border-1 border-black'>Name</th>
                                <th className='text-center w-[100px] font-normal p-2 border border-1 border-black'>AdNo</th>
                                <th className='text-center  font-normal p-2 border border-1 border-black'>Mark/Grade</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className='text-center bg-gray-200 border-1'>a</td>
                                <td className='text-center bg-gray-200 border-1'>b</td>
                                <td className='text-center bg-gray-200 border-1 mt-3'>C</td>
                                <td className='text-center bg-gray-200 border-1 mt-3'>
                                    <div className='p-1'>
                                        <input
                                            type='text'
                                            className='outline-none bg-gray-50 rounded-lg w-32' />
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex justify-center '>
                        <button className='flex  justify-center p-1  text-white bg-teal-400 rounded-3xl w-28 text-base font-bold hover:bg-teal-600'>
                            SAVE
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}



