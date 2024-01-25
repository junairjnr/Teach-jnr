"use client"
import React from 'react'
import "./globals.css";
import {AiOutlineClose} from "react-icons/ai"


function PopUp( props:any ) {
  return (props.trigger) ? (
    <div className='popupContainer flex justify-center items-center h-[70px] bg-green-200'>
        <div className='absolute w-[100%] max-w-[400px] h-[70px]'>
            <button className='absolute pl-[370px] pt-[8px]'
                    onClick={() => props.setTrigger(false)} 
                     ><AiOutlineClose  className='fill-[#DC143C] w-5 h-5'/></button>
            <div>
               { props.children }
            </div>         
        </div>
      
    </div>
  ) : "";
}

export default PopUp