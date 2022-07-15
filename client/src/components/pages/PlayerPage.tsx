import { useState, useEffect, useCallback } from 'react';
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

interface TypeFilter {
    [index: string]: boolean;
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

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    //let filtersGames = getFiltersGames();

    // const isFilter =
    //     search.length > 0 ||
    //     Object.keys(filterProviders).length > 0 ||
    //     Object.keys(filterGroups).length > 0 ||
    //     Object.keys(sorting).length > 0;

    return (
        <>
            <AppHeader />
            <GamesList games={filtersGames.length > 0 ? filtersGames : games} />
            <Filters games={games} filtersGames={filtersGames} setFiltersGames={setFiltersGames} providers={providers} groups={groups} />
        </>
    );
};

export default PlayerPages;
