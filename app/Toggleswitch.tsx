'use client';
import React, { Dispatch, SetStateAction } from 'react'
import {useState} from 'react'
import classNames from 'classnames'



const Toggleswitch = ({
  isSelected,
  setIsSelected
}: {
  isSelected: boolean,
  setIsSelected: (state: boolean) => void
}) => {
  return (
    <div 
    onClick={()=> setIsSelected(!isSelected)}
      className={classNames('flex w-10 h-5 bg-[#dbdbdb] m-5 rounded-full',{
        'bg-[#dbdbdb]' : !isSelected,

    })}>
      <span 
         className={classNames('h-5 w-5 bg-green-600 rounded-full transition-all duration-500 shadow-lg', {
        'ml-5 bg-red-600' : !isSelected,
      }
      

      )} />
    </div>
  )
}

export default Toggleswitch