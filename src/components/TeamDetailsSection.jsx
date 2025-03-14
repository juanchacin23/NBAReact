import React from "react";
import { useState } from "react";
import { IoMdBasketball } from "react-icons/io";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import {  FiMapPin } from "react-icons/fi";
import Spinner from "../components/Spinner";
import { FaGlobeAmericas } from "react-icons/fa";


export const RevealBento = ({currentTeam, isLoading, teamErrorMessage }) => {
  
  return (
    <div className="  px-4 py-12 text-zinc-50">
      
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
      >
        <HeaderBlock 
          currentTeam={currentTeam} 
          isLoading={isLoading} 
          teamErrorMessage={teamErrorMessage}
        />

        <SocialsBlock 
          currentTeam={currentTeam} 
          
        />
        
        <ConferenceBlock 
          currentTeam={currentTeam}
          isLoading={isLoading} 
          teamErrorMessage={teamErrorMessage}
        />

        <DivisionBlock 
          currentTeam={currentTeam}
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
        "col-span-4 rounded-lg border border-gray-700 bg-gray-800 p-6",
        className
      )}
      {...rest}
    />
  );
};

const HeaderBlock = ({currentTeam, isLoading, teamErrorMessage}) => {


  const [imageError, setImageError] = useState(false);

  
    // dinamic construction of the logo path
  const logoSrc = currentTeam?.full_name
  ? `/team-logos/${currentTeam.full_name.toLowerCase().replace(/ /g, '-')}.svg`
  : null;

    return (
      <Block className="col-span-12 row-span-2 md:col-span-6">
      {/* Si está cargando */}
      {isLoading && <Spinner />}

      {/* Si hay un mensaje de error */}
      {!isLoading && teamErrorMessage && <p className="text-red-500">{teamErrorMessage}</p>}

      {/* Si no hay equipo válido */}
      {!isLoading && !teamErrorMessage && !currentTeam?.full_name && (
        <span>No team data available</span>
      )}

      {/* Si hay un equipo válido, mostrar su información */}
      {!isLoading && !teamErrorMessage && currentTeam?.full_name && (
        <>
          <div className="flex items-center justify-center">
          {!imageError ? (
            <img
              src={logoSrc}
              onError={() => setImageError(true)}
              alt="Team Logo"
              className="mb-4 size-20 rounded-full"
            />
          ) : (
            <IoMdBasketball className="mb-4 size-14 rounded-full" />
          )}
          </div>

          <h1 className="mb-12 text-4xl font-medium leading-tight text-center">
            {currentTeam.full_name}
          </h1>

          
        </>
      )}
    </Block>

    ) 
};

const SocialsBlock = ({currentTeam}) => (
  <>
    <Block
      whileHover={{
        rotate: "3.5deg",
        scale: 1.1,
      }}
      className="col-span-6  bg-red-600 md:col-span-3"
    >
      <div
        
        className="grid h-full place-content-center text-2xl text-white"
      >
        <h1 className="text-center">City</h1>
        <h1>{currentTeam.city}</h1>
        
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "-3.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-green-600 md:col-span-3"
    >
      <div
        
        className="grid h-full place-content-center text-2xl text-white"
      >
        <h1 className="text-center ">Name</h1>
        <h1>{currentTeam.name}</h1>
        
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "-3.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-yellow-600 md:col-span-3"
    >
      <div
        
        className="grid h-full place-content-center text-2xl text-white"
      >
        <h1 className="text-center">Abbreviation</h1>
        <h1 className="text-center">{currentTeam.abbreviation}</h1>
        
      </div>
    </Block>
    <Block
      whileHover={{
        rotate: "3.5deg",
        scale: 1.1,
      }}
      className="col-span-6 bg-blue-500 md:col-span-3"
    >
      <div
        
        className="grid h-full place-content-center text-2xl text-white"
      >
        <h1 className="text-center">Full Name</h1>
        <h1 className="text-center">{currentTeam.full_name}</h1>
        
      </div>
    </Block>
  </>
);



const ConferenceBlock = ({currentTeam, isLoading, teamErrorMessage}) => {
  
  const [imageError, setImageError] = useState(false);

  
    // dinamic construction of the conference path
  const conferenceSrc = currentTeam?.conference
  ? `/conference-logos/${currentTeam.conference.toLowerCase().replace(/ /g, '-')}.svg`
  : null;

  

  //const logoSrc = `/team-logos/${full_name.toLowerCase().replace(/ /g, '-')}.svg`;
  
  return (
  <Block className="col-span-12 flex flex-col items-center justify-center md:col-span-6">
     
     {/* Si está cargando */}
     {isLoading && <Spinner />}

     {/* Si hay un mensaje de error */}
     {!isLoading && teamErrorMessage && <p className="text-red-500">{teamErrorMessage}</p>}
     
      {/* Si no hay equipo válido */}
      {!isLoading && !teamErrorMessage && !currentTeam?.full_name && (
        <span>No team data available</span>
      )}


     {/* Si hay un equipo válido, mostrar su información */}
      {!isLoading && !teamErrorMessage && currentTeam?.full_name && (
        <>
           {!imageError ? (
            <img
              src={conferenceSrc}
              onError={() => setImageError(true)}
              alt="Team Logo"
              className="mb-4 size-20 rounded-full"
            />
          ) : (
            <IoMdBasketball className="mb-4 size-14 rounded-full" />
          )}
    <p className="text-lg text-zinc-400">Conference: {currentTeam.conference}</p>

          
        </>
      )}
    
  </Block>
  );
};

const DivisionBlock = ({currentTeam}) => (
  <Block className="col-span-12 flex flex-col items-center justify-center gap-4 md:col-span-6">
    <FaGlobeAmericas className="text-3xl"/>

    <p className="text-center text-lg text-zinc-400">Division: {currentTeam.division}</p>
  </Block>
);




