import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Button = ({ isDisabled = false, text, onClickProp, icon, iconArrow }) => {
  return (
    <button disabled={isDisabled} onClick={onClickProp} className='w-full h-[50px] flex flex-row justify-center items-center gap-1 rounded-lg bg-gradient-to-r from-[#17A600] to-[#17A600] font-bold text-[20px] text-white'>{text}
      {icon && (<KeyboardArrowDownIcon fontSize='large' />)}
      {iconArrow && (<ArrowForwardIcon fontSize='large' />)}
    </button>
  )
}

export default Button