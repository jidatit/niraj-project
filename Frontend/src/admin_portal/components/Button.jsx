import React from 'react'

const Button = ({ isDisabled = false, text, onClickProp }) => {
  return (
    <button disabled={isDisabled} onClick={onClickProp} className='w-full h-[50px] rounded-lg bg-gradient-to-r from-[#17A600] to-[#17A600] font-bold text-[20px] text-white'>{text}</button>
  )
}

export default Button