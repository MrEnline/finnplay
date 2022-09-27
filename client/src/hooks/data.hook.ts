import { useState } from 'react';
import { TypeGame, TypeProvider, TypeGroup } from '../utils/Interfaces';
import useJSONService from '../services/JSONService';

export const useAllData = () => {
    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();

    const getAllData = () => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    };

    return { getAllData, games, setGames, providers, setProviders, groups, setGroups };
};
