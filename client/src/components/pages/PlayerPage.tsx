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

    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [search, setSearch] = useState('');
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [sorting, setSorting] = useState<TypeFilter>({});

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const handleSearch = () => {
        if (search.length === 0) return [];
        let newArrGames = Array<TypeGame>();
        newArrGames = games.filter((item) => {
            return item.name.indexOf(search) > -1;
        }); //фильтрация по названию игры
        //if (newArrGames.length > 0) return newArrGames;
        const arrProvidersGames = providers.filter((item) => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        }); //фильтрация по имени провайдера
        if (arrProvidersGames.length > 0) {
            for (let provider of arrProvidersGames) {
                newArrGames = [...newArrGames, ...games.filter((game) => provider.id === game.provider)];
            }
            //if (newArrGames.length > 0) return newArrGames;
        }
        //фильтрация по названию группы
        const arrGroupGames = groups.filter((item) => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
        if (arrGroupGames.length > 0) {
            let idArrGames = Array<number>();
            for (let group of arrGroupGames) {
                idArrGames = [...idArrGames, ...group.games];
            }
            for (let id of idArrGames) {
                newArrGames = [...newArrGames, ...games.filter((item) => item.id === +id)];
            }
        }
        // console.log(newArrGames);
        // console.log(newArrGames.length);
        return newArrGames;
    };

    const handleFilterProviders = (arrGames: Array<TypeGame>) => {
        const arrProviders = Object.keys(filterProviders);
        if (arrProviders.length === 0) return arrGames;
        const currArrForFilter = arrGames.length ? arrGames : games;
        let newArrProvidersGames = Array<TypeGame>();
        for (let i = 0; i < arrProviders.length; i++) {
            newArrProvidersGames = [
                ...newArrProvidersGames,
                ...currArrForFilter.filter((game) => game.provider === +arrProviders[i]),
            ];
        }
        return newArrProvidersGames;
    };

    const handleFilterGroup = (arrGames: Array<TypeGame>) => {
        const arrGroups = Object.keys(filterGroups);
        if (arrGroups.length === 0) return arrGames;
        const currArrForFilter = arrGames.length ? arrGames : games;
        let newArrGroupsGames = Array<TypeGame>();
        for (let i = 0; i < arrGroups.length; i++) {
            const groupGames = groups.find((item) => item.id === +arrGroups[i]);
            if (groupGames) {
                for (let j = 0; j < groupGames.games.length; j++) {
                    newArrGroupsGames = [
                        ...newArrGroupsGames,
                        ...currArrForFilter.filter((game) => game.id === groupGames.games[j]),
                    ];
                }
            }
        }
        return newArrGroupsGames;
    };

    let filtersGames = handleSearch();
    filtersGames = handleFilterProviders(filtersGames);
    filtersGames = handleFilterGroup(filtersGames);

    const isFilter =
        search.length > 0 ||
        Object.keys(filterProviders).length > 0 ||
        Object.keys(filterGroups).length > 0 ||
        Object.keys(sorting).length > 0;

    return (
        <>
            <AppHeader />
            <GamesList games={isFilter ? filtersGames : games} />
            <Filters
                providers={providers}
                groups={groups}
                search={search}
                setSearch={setSearch}
                filterProviders={filterProviders}
                setFilterProviders={setFilterProviders}
                filterGroups={filterGroups}
                setFilterGroups={setFilterGroups}
                sorting={sorting}
                setSorting={setSorting}
            />
        </>
    );
};

export default PlayerPages;
