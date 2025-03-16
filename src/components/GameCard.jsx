import React from "react";
import { useState } from "react";
import { IoMdBasketball } from "react-icons/io";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {  FiMapPin } from "react-icons/fi";
import Spinner from "../components/Spinner";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);

export const GameCard = ({game}) => {
  
  
  return (
    <div className=" pl-1 md:px-1 lg:px-3 xl:px-3 sm:pr-6 pr-1 py-2 md:py-4 lg:py-4 text-zinc-50 ">
      
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        
      >
      
        <SocialsBlock 
          game={game}
        />
          
      </motion.div>
      
    </div>
  );
};

const Block = ({ className, ...rest }) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={twMerge(
        "col-span-4 rounded-lg border border-gray-700 bg-gray-800 p-2",
        className
      )}
      {...rest}
    />
  );
};

const SocialsBlock = (
  { game: { home_team, visitor_team, home_team_score, visitor_team_score, status, period, season, postseason, date} }
) => {

  const [homeImageError, setHomeImageError] = useState(false);
  const [visitorImageError, setVisitorImageError] = useState(false);

  // Construcción dinámica de las rutas de los logos
  const homeLogoSrc = home_team?.full_name
    ? `/team-logos/${home_team.full_name.toLowerCase().replace(/ /g, '-')}.svg`
    : null;

  const visitorLogoSrc = visitor_team?.full_name
    ? `/team-logos/${visitor_team.full_name.toLowerCase().replace(/ /g, '-')}.svg`
    : null;
  

  const getStatusText = (status) => {
    // Si el status es "Final", mostrar "Final"
    if (status === 'Final') {
      return 'Final';
    }
  
    // Si el status contiene "Qtr" o es "Halftime", mostrarlo tal cual
    if (status.includes('Qtr') || status === 'Halftime') {
      return status;
    }
  
    // Si el status parece ser un timestamp, formatearlo
    const date = new Date(status);
    if (!isNaN(date.getTime())) {
      // Convertir a un formato legible (por ejemplo, "7:30 PM")
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  
    // Si no coincide con ningún caso, mostrar "Comming"
    return 'Comming';
  };
  return (
  <>
    <Block
      whileHover={{
        rotate: "3.5deg",
        scale: 1.1,
      }}
      className="grid grid-cols-8 bg-gray-800 border-gray-700 "
    >
      <div
        className="col-span-5 grid grid-cols-5 text-xs text-white items-center border-r-1 pr-1"
      >
        
           {!homeImageError ? (
              <img
                src={homeLogoSrc}
                onError={() => setHomeImageError(true)}
                alt={`${home_team.full_name} Logo`}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <IoMdBasketball className="w-8 h-8 object-cover rounded-full text-gray-400" />
            )}
        
          <h1 className={`pl-1 col-span-3 ${
              home_team_score > visitor_team_score ? 'text-white' : 'text-gray-400'
            }`}>
              
            <a href={home_team.id}>
              {home_team.full_name}
            </a>
              
          </h1>
          <h1  
          className={`text-right ${
            home_team_score > visitor_team_score ? 'text-white' : 'text-gray-400'
                                  }`}> 
              {home_team_score}
          </h1>
        

          <div className="">
            {!visitorImageError ? (
              <img
                src={visitorLogoSrc}
                onError={() => setVisitorImageError(true)}
                alt={`${visitor_team.full_name} Logo`}
                className="w-8 h-8 object-cover rounded-full"
              />
            ) : (
              <IoMdBasketball className="w-8 h-8 object-cover rounded-full text-gray-400" />
            )}
          </div>


             
          <h1 className={`pl-1 col-span-3 ${
              visitor_team_score > home_team_score ? 'text-white' : 'text-gray-400'
            }`}
          >
            <a href={visitor_team.id} >
              {visitor_team.full_name}
            </a>
            
          </h1>
          <h1 
            className={`text-right ${
              visitor_team_score > home_team_score ? 'text-white' : 'text-gray-400'
            }`}>
            {visitor_team_score}
          </h1>
        

      </div>

      <div className=" col-span-3 grid-row-5  text-white text-xs text-center">
        <h1 className=" ">
        {dayjs(date).utc().isSame(dayjs().utc(), 'day')
              ? 'Today'
              : dayjs(date).utc().isSame(dayjs().utc().subtract(1, 'day'), 'day')
              ? 'Yesterday'
              : dayjs(date).utc().format('MM/DD/YYYY')
        }
        </h1>
        <h1 className="">{getStatusText(status)}</h1>
        {/*<h1 className=" ">period: {period}</h1>*/}
        <h1 className=" "> {season} Season </h1>
        <h1 className=" ">{postseason ? 'yes' : 'no'} Postseason</h1>   
                
      </div>
    </Block>
    
    
  </>
  )
};

export default GameCard;




