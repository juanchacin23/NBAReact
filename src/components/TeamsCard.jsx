import React, { useRef, useState} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { IoMdBasketball } from "react-icons/io";



const teamColors = {
  "Atlanta Hawks": "#E03A3E",   // Rojo, verde lima, negro
  "Boston Celtics": "#007A33",  // Verde, dorado, blanco
  "Brooklyn Nets": "#000000",   // Negro, blanco
  "Charlotte Hornets": "#1D1160",  // Púrpura, turquesa, gris
  "Chicago Bulls": "#CE1141",  // Rojo, negro, blanco
  "Cleveland Cavaliers": "#860038", //Vino, dorado, azul marino
  "Dallas Mavericks": "#00538C", //Azul, azul oscuro, gris
  "Denver Nuggets": "#0E2240", //Azul marino, dorado, rojo
  "Detroit Pistons": "#C8102E", //Rojo, azul, gris
  "Golden State Warriors": "#1D428A",
  "Houston Rockets": "#CE1141", //Rojo, negro, gris
  "Indiana Pacers": "#002D62", //Azul, dorado, gris
  "LA Clippers": "#C8102E",  // Rojo, azul, negro
  "Los Angeles Lakers": "#552583",   // Púrpura, dorado, negro
  "Memphis Grizzlies": "#5D76A9",   // Azul acero, azul oscuro, gris
  "Miami Heat": "#98002E",   // Rojo, amarillo-naranja, negro
  "Milwaukee Bucks": "#00471B",  // Verde, crema, azul
  "Minnesota Timberwolves": "#0C2340",   
  "New Orleans Pelicans": "#0C2340", 
  "New York Knicks": "#006BB6", 
  "Oklahoma City Thunder": "#007AC1", 
  "Orlando Magic": "#0077C0",
  "Philadelphia 76ers": "#006BB6", 
  "Phoenix Suns": "#1D1160", 
  "Portland Trail Blazers": "#E03A3E", 
  "Sacramento Kings": "#5A2D81", 
  "San Antonio Spurs": "#C4CED4", 
  "Toronto Raptors": "#CE1141", 
  "Utah Jazz": "#002B5C", 
  "Washington Wizards": "#002B5C",
};



const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({team: {conference, division, city, name, full_name, abbreviation}}) => {
  const ref = useRef(null);

  const [imageError, setImageError] = useState(false);

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

   // Obtener el color de fondo correspondiente del objeto teamColors
   const backgroundColor = teamColors[full_name]; // Color por defecto si no se encuentra el equipo

   // Construir dinámicamente la ruta de la imagen utilizando el nombre del equipo
  const logoSrc = `/team-logos/${full_name.toLowerCase().replace(/ /g, '-')}.svg`;

  



  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
        backgroundColor: backgroundColor || "#ddd",
      }}
      className="relative h-96 w-72 rounded-xl "
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
          
          
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg transition-all duration-600 ease-in-out
         hover:bg-white/75 hover:shadow-2xl "
           
      >

        
        {!imageError ? (
          <img
            src={logoSrc}
            
            onError={() => setImageError(true)}
            style={{
              transform: "translateZ(75px)",
              
            }}
            className="mx-auto w-full h-60 "
          />
        ) : (
          <IoMdBasketball
            style={{
              transform: "translateZ(75px)",
            }}
            className="mx-auto text-4xl"
          />
        )}
        
        <div
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-xl font-bold"
        >
          {full_name} 
          <p className="text-base">{conference} conference</p> 
          <p className="text-md">{abbreviation}</p>
        </div>

      </div>
    </motion.div>
  );
};

export default TiltCard;