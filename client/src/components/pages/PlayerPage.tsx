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
    const [games, setGames] = useState(Array<TypeGame>);

    //const [filtersGames, setFiltersGames] = useState(Array<TypeGame>);

    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);
    const [search, setSearch] = useState('');
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [filterSorting, setFilterSorting] = useState<TypeFilter>({});

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const handleFilterProviders = () => {
        const arrProviders = Object.keys(filterProviders);
        if (arrProviders.length === 0) return [];
        let newArrProvidersGames = Array<TypeGame>();
        for (let i = 0; i < arrProviders.length; i++) {
            newArrProvidersGames = [...newArrProvidersGames, ...games.filter((game) => game.provider === +arrProviders[i])];
        }
        return newArrProvidersGames;
    };

    const handleFilterGroup = (arrGames: Array<TypeGame>) => {};

    let filtersGames = handleFilterProviders();

    return (
        <>
            <AppHeader />
            <GamesList games={filtersGames?.length === 0 ? games : filtersGames} />
            <Filters
                providers={providers}
                groups={groups}
                search={search}
                setSearch={setSearch}
                filterProviders={filterProviders}
                setFilterProviders={setFilterProviders}
                filterGroups={filterGroups}
                setFilterGroups={setFilterGroups}
                filterSorting={filterSorting}
                setFilterSorting={setFilterSorting}
            />
        </>
    );
};

export default PlayerPages;
