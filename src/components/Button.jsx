import React from "react";

const Button = ({text, isSelected, onClick}) => {
  return (
    
    <button 
      type="button" 
      className={`font-medium rounded-lg text-sm px-5 py-2.5 me-2 hover:bg-red-900 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-950  dark:focus:ring-red-950 ${isSelected ? 'bg-red-900 text-white' : 'bg-gray-800 dark:bg-gray-800 text-white dark:border-gray-700'}`}
      onClick={onClick}  
    >
      {text}
    
    </button>

  )
}

export default Button;