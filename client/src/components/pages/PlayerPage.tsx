import { useState, useEffect } from 'react';
import useJSONService from '../../services/JSONService';
import AppHeader from '../appHeader/AppHeader';
import GamesList from '../gamesList/GamesList';
import Filters from '../filters/Filters';

interface TypeData {
    id: number;
    name: string;
}

interface TypeProvider extends TypeData {
    logo: string;
}

interface TypeGroup extends TypeData {
    games: [];
}

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

const PlayerPages = () => {
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();
    const [games, setGames] = useState(Array<TypeGame>());
    const [filtersGames, setFiltersGames] = useState(Array<TypeGame>());

    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [columnsCounter, setColumnsCounter] = useState(2);

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
            setFiltersGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    return (
        <>
            <AppHeader />
            <GamesList games={filtersGames} columnsCounter={columnsCounter} />
            <Filters
                games={games}
                filtersGames={filtersGames}
                handleFiltersGames={setFiltersGames}
                providers={providers}
                groups={groups}
                columnsCounter={columnsCounter}
                handleColumnsCounter={setColumnsCounter}
            />
        </>
    );
};

export default PlayerPages;
