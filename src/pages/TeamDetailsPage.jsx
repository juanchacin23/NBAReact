import { useState, useEffect } from 'react'
import Spinner from "../components/Spinner";
import PlayerCard from "../components/PlayersCard";
import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_KEY = import.meta.env.VITE_BALL_DONT_LIE_API_KEY;

const API_OPTIONS =  {
  method: 'GET', 
  headers:  {
    
    "Authorization": `${API_KEY}`,
  }
}

const TeamDetailsPage = () => {

  const { id } = useParams();

  const [errorMessage, setErrorMessage] = useState('');

  const [playersList, setPlayersList] = useState([]);

  const [gamesList, setGamesList] = useState([]);

  const [currentTeam, setCurrentTeam] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);


  
  const fetchNbaPlayersCurrentTeam = async () => {

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
      const endpoint = `${API_BASE_URL}/players?team_ids[]=${id}`;
      

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch players');
      }

      const data = await response.json();

      
      
       if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch players');
        setPlayersList([]);
        return;
      }
      

       // filtering teams by division
      const filteredTeams = data.data.filter(team => team.division);

      console.log(filteredTeams);
      setPlayersList(data.data || []);

     

  }

    catch (error) {
      console.error(`Error fetching players: ${error}`);
      setErrorMessage('Error fetching players. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }
  

  const fecthNbaGames = async () => {
    setErrorMessage('');


    try {
      const endpoint = `${API_BASE_URL}/games?dates[]=2025-03-08&dates[]=2025-03-09`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch games');
      }

      const data = await response.json();
      console.log(data);
      
       if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch games');
        setGamesList([]);
        return;
      }

      // localStorage.setItem('nbaPlayers', JSON.stringify(data.response));

      setGamesList(data.data || []);
  }

    catch (error) {
      console.error(`Error fetching games: ${error}`);
      setErrorMessage('Error fetching games. Please try again later.');

    }
  }


  const fetchNbaCurrentTeam = async () => {

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
      const endpoint = `${API_BASE_URL}/teams/${id}`;
      

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch Nba team');
      }

      const data = await response.json();

      console.log('check this console log')
      console.log (data.data);

      
      
       if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch nba team');
        setCurrentTeam([]);
        return;
      }
      
      setCurrentTeam(data.data || []);

     

  }

    catch (error) {
      console.error(`Error fetching nba team: ${error}`);
      setErrorMessage('Error fetching nba team. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }

  

  

  useEffect(() => {
    fetchNbaPlayersCurrentTeam();
  }, []);

  useEffect(() => {
    fecthNbaGames();
  }, []);

  useEffect(() => {
    fetchNbaCurrentTeam();
  }, []);

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayerId((prevSelectedPlayerId) => 
      prevSelectedPlayerId === playerId ? null : playerId
    );
  };
  

  return (
    <>
    <header>
      <Navbar />
    </header>
      <header className='text-center text-2xl mt-8 '>NBA APP</header>

    <section>
      <div className='text-center mt-8 text-2xl'>
        
      <h1>  full name: {currentTeam.full_name}</h1>
      <h1>  conference: {currentTeam.conference}</h1>
      <h1> Division:{currentTeam.division} City: {currentTeam.city} Name: {currentTeam.name} Full Name:{currentTeam.full_name} Abbreviation: {currentTeam.abbreviation}</h1>
      </div>
      
    </section>
      
    <section>
      
      <div className='bg-red-500'>
        <div  className='text-center mt-8 text-2xl'>Players</div>
        <div className="flex items-center justify-center text-2xl mt-8 mb-8">
        <p className='mr-2'>NBA Players of </p>
            {isLoading ? (
                <Spinner/>
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (

            <span> {currentTeam.full_name} </span>

          )}
        </div>
      

      <div className="mt-2 mb-2">

        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 justify-items-center'>
            {playersList.map((player) => (
              <PlayerCard 
                key={player.id} 
                player={player}
                isSelected={selectedPlayerId === player.id}
                onSelect={() => handleSelectPlayer(player.id)}
                />
            ))}
          </ul>
        )}
      </div>
      </div>
    </section>
      
    <section> 
      <div className='text-center bg-red-800 mt-10'>Last 20 games of this team </div>
      <div>
        <ul>
              {gamesList.map((game) => (
                <li key={game.id}className='mt-4'>
                  fecha{game.date} temporada{game.season} home {game.home_team.city} {game.home_team_score} - visitor {game.visitor_team.city} {game.visitor_team_score} 
                </li>
              ))}
        </ul>
      </div>
    </section>
    </>
  )
}

export default TeamDetailsPage;
