import React, { useRef, useState} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { IoMdBasketball } from "react-icons/io";


const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({player: {first_name, last_name, position, height, weight, jersey_number, college, country,  draft_year, draft_round, draft_number }, isSelected, onSelect}) => {
  const ref = useRef(null);

  

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{
        transformStyle: "preserve-3d",
        transform,
        
      }}
      className="relative h-96 w-72 rounded-xl  group overflow-hidden "
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
          
        }}
        className="absolute inset-0 grid rounded-xl bg-gray-800 text-white shadow-lg  border border-gray-700 transition-all duration-500 ease-in-out "
      >

        
  
          <p className="text-6xl font-black font-mono text-right  pr-5 place-content-center ">{jersey_number}</p>
          
         

          <div className="  text-right uppercase pr-4 place-content-center font-bold ">
            <p className="">{first_name}</p>
            <p className="">{last_name}</p>
          </div>
        
        <div
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-xl font-bold  place-content-center"
        >
          
          <p className="text-base capitalize">position: {position ? <span> {position} </span> : <span>TBD</span>}</p> 
          
          
        </div>

        

      </div>

      {/* layer when hovering */}
      <div
          className={`absolute inset-0 flex flex-col  bg-black  text-white cursor-pointer
                    ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-85" } transition-all duration-800 text-center rounded-xl group-hover:opacity-100 group-hover:scale-100`}
        >
          <div className="font-bold grid grid-cols-2 flex-grow mt-2">
            
              <div className="">
              {position ? <p> {position} </p> : <p>unavailable</p>}
                <p className=""> Position </p>
              </div>
              <div className="">
                <p className=""> {height} </p>
                <p className=""> Height </p>
              </div>
              <div className="">
                <p className=""> {weight} lbs </p>
                <p className=""> Weight </p>
              </div>
              <div className="">
                <p className=""> {jersey_number} </p>
                <p className=""> Jersey </p>
              </div>
            
            <div className="">
                <p className=""> {country} </p>
                <p className=""> Country </p>
              </div>
              <div className="">
              {draft_year ? <p> {draft_year} </p> : <p> Undrafted</p>}
                <p className=""> Draft Year</p>
              </div>
              <div className="">
                {draft_round ? <p> {draft_round} </p> : <p> Undrafted</p>}
                <p className=""> Draft Round </p>
              </div>
              <div className="">
              {draft_number ? <p> {draft_number} </p> : <p> Undrafted</p>}
                <p className=""> Draft Number </p>
              </div>

              <div className="">
                <p className=""> {college} </p>
                <p className=""> College </p>
            </div>
            
          </div>

          

          
      </div>

      
      
    </motion.div>
  );
};

export default TiltCard;