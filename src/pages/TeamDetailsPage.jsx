import { useState, useEffect } from 'react'
import Spinner from "../components/Spinner";
import PlayerCard from "../components/PlayersCard";
import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { RevealBento } from '../components/TeamDetailsSection';
import dayjs from 'dayjs';
import GameCard from '../components/GameCard';

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

  const [teamErrorMessage, setTeamErrorMessage] = useState('');
  const [playersErrorMessage, setPlayersErrorMessage] = useState('');
  const [gamesErrorMessage, setGamesErrorMessage] = useState('');


  const [playersList, setPlayersList] = useState([]);

  const [gamesList, setGamesList] = useState([]);

  const [currentTeam, setCurrentTeam] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);


  
  const fetchNbaPlayersCurrentTeam = async () => {

    setIsLoading(true);
    setPlayersErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/players?team_ids[]=${id}`;
      

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch players');
      }

      const data = await response.json();

      
      
       if(data.Response === 'False') {
        setPlayersErrorMessage(data.Error || 'Failed to fetch players');
        setPlayersList([]);
        return;
      }
      
      setPlayersList(data.data || []);

     

  }

    catch (error) {
      console.error(`Error fetching players: ${error}`);
      setPlayersErrorMessage('Error fetching players. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }
  

  const fecthNbaGamesCurrentTeam = async () => {
    setGamesErrorMessage('');
    setIsLoading(true);
  
    try {
      let games = [];
      let monthsBack = 1; // Comenzar con un rango de 1 mes
      const maxMonthsBack = 24; // Intentar hasta 2 años atrás
      const maxGames = 20; // Queremos un máximo de 20 juegos
  
      while (games.length < maxGames && monthsBack <= maxMonthsBack) {
        const today = new Date();
        const endDate = new Date();
        const startDate = new Date();
  
        // Ajustar el rango de fechas
        startDate.setMonth(today.getMonth() - monthsBack);
        endDate.setMonth(today.getMonth() - (monthsBack - 1));
  
        const endpoint = `${API_BASE_URL}/games?team_ids[]=${id}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&per_page=100`;
  
        const response = await fetch(endpoint, API_OPTIONS);
  
        if (!response.ok) {
          throw Error('Failed to fetch games');
        }
  
        const data = await response.json();
  
        if (data.data.length > 0) {
          games = [...games, ...data.data]; // Agregar los nuevos juegos a la lista

           // Detener el bucle si ya tenemos suficientes juegos
          if (games.length >= maxGames) {
            break;
          }
        }

        monthsBack++; // Ampliar el rango de fechas
      }
  
      if (games.length === 0) {
        setGamesErrorMessage('No games found for this team.');
        setGamesList([]);
        return;
      }
  
      // Ordenar los juegos por fecha (más recientes primero)
      const sortedGames = games
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, maxGames); // Tomar solo los 20 juegos más recientes
  
      setGamesList(sortedGames);

      console.log(sortedGames);
    } catch (error) {
      console.error(`Error fetching games: ${error}`);
      setGamesErrorMessage('Error fetching games. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  const fetchNbaCurrentTeam = async () => {

    setIsLoading(true);
    setTeamErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/teams/${id}`;
      

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw Error('failed to fetch Nba team');
      }

      const data = await response.json();      
      
       if(data.Response === 'False') {
        setTeamErrorMessage(data.Error || 'Failed to fetch nba team');
        setCurrentTeam([]);
        return;
      }
      
      setCurrentTeam(data.data || []);

     

  }

    catch (error) {
      console.error(`Error fetching nba team: ${error}`);
      setTeamErrorMessage('Error fetching nba team. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }

  

  

  useEffect(() => {
    fetchNbaPlayersCurrentTeam();
  }, []);

  useEffect(() => {
    fecthNbaGamesCurrentTeam();
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

    <section>

    < RevealBento 
      currentTeam={currentTeam}
      isLoading={isLoading}
      teamErrorMessage={teamErrorMessage}
    />

    </section>
      
    <section>
      
      <div className=''>
        <div  className='text-center mt-8 text-2xl'>Players</div>
        <div className="flex items-center justify-center text-2xl mt-8 mb-8">
        <p className='mr-2'>NBA Players of </p>
            {isLoading ? (
                <Spinner/>
              ) : teamErrorMessage ? (
                <p className="text-red-500">{teamErrorMessage}</p>
              ) : (

            <span> {currentTeam.full_name} </span>

          )}
        </div>
      

      <div className="mt-2 mb-2">

        {isLoading ? (
          <Spinner />
        ) : playersErrorMessage ? (
          <p className="text-red-500">{playersErrorMessage}</p>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 justify-items-center'>
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
      <div className='text-center text-2xl mt-4'>
      Last Games of
      {isLoading ? (
                <Spinner/>
              ) : teamErrorMessage ? (
                <p className="text-red-500">{teamErrorMessage}</p>
              ) : (

            <span> {currentTeam.full_name} </span>

          )}  
      </div>
      
        
      {isLoading ? (
          <Spinner />
        ) : gamesErrorMessage ? (
          <p className="text-red-500">{gamesErrorMessage}</p>
        ) : (
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {gamesList.map((game) => (
                <GameCard key={game.id} game={game}/>
                
              ))}
        </div>
        )}
      
    </section>
      

    <ScrollToTop />
    </>
  )
}

export default TeamDetailsPage;
