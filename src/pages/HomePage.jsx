import { useState, useEffect } from 'react'
import Spinner from "../components/Spinner";
import TeamCard from "../components/TeamsCard";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Search from "../components/Search";
import ScrollToTop from "../components/ScrollToTop";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_KEY = import.meta.env.VITE_BALL_DONT_LIE_API_KEY;

const API_OPTIONS =  {
  method: 'GET', 
  headers:  {
    
    "Authorization": `${API_KEY}`,
  }
}

const HomePage = () => {

  const [errorMessage, setErrorMessage] = useState('');

  const [teamsList, setTeamsList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedButton, setSelectedButton] = useState(() => {
    return localStorage.getItem('selectedButton') || 'nba teams';
  });

  const [searchTerm, setSearchTerm] = useState('');
  


  
  const fetchNbaTeams = async () => {

    setIsLoading(true);
    setErrorMessage('');

    /*
     // Verificar si los datos están en localStorage
    const cachedData = localStorage.getItem('nbaPlayers');
    if (cachedData) {
      console.log("Cargando datos desde cache");
      setPlayersList(JSON.parse(cachedData));
      return;
    }
    */

    try {
      const endpoint = `${API_BASE_URL}/teams`;
      

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch teams');
      }

      const data = await response.json();
      
      console.log('whole data')
      console.log(data.data);
      
       if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch teams');
        setTeamsList([]);
        return;
      }

       // filtering teams by conference
      const filteredTeams = data.data.filter(team => team.conference === 'West' || team.conference === 'East');

      console.log(filteredTeams);
      setTeamsList(filteredTeams || []);

     

  }

    catch (error) {
      console.error(`Error fetching teams: ${error}`);
      setErrorMessage('Error fetching teams. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNbaTeams();
  }, []);

  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);

    localStorage.setItem('selectedButton', buttonText);

  };

  const filteredTeams = teamsList
  .filter((team) => {
    if (selectedButton === 'nba teams') {
      return team;
    } else if (selectedButton === 'West Conference') {
      return team.conference === 'West';
    } else if (selectedButton === 'East Conference') {
      return team.conference === 'East';
    }
    
  })
  .filter((team) => {
    if (searchTerm === '') {
      return team;
    } else if (team.full_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return team;
  }
});

  return (
    <>
      <header>
        <Navbar />
      </header>

      <section>
      <div className='container mx-auto'>
        
        <div className='grid grid-cols-1 md:grid-cols-3  mt-4 mb-8 '>
          
          <div>
              
          </div>
          
          <div className='flex flex-col lg:flex-row space-y-2 pl-2 sm:pl-0 lg:space-y-0 '> 
            <Button 
              text={"nba teams"}
              isSelected={selectedButton === "nba teams"}
              onClick={() => handleButtonClick("nba teams")}
            />
            <Button 
              text={"West Conference"}
              isSelected={selectedButton === "West Conference"}
              onClick={() => handleButtonClick("West Conference")}
            />
            <Button 
              text={"East Conference"}
              isSelected={selectedButton === "East Conference"}
              onClick={() => handleButtonClick("East Conference")}
            />
          </div>

          <div className='sm:flex my-auto pt-2 sm:pt-0 px-2 xl:px-0 sm:pl-0 justify-end '>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> 
          </div>
          

                

        </div>
          
          
          <div className=" mb-2">

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2 justify-items-center'>
                {filteredTeams.map((team) => (
                  <a href={team.id} key={team.id}>
                    <TeamCard team={team} />
                  </a>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <ScrollToTop />
     
    </>
  )
}

export default HomePage;
