import { useState, useEffect, useMemo, FC } from 'react';
import useJSONService from '../../../services/JSONService';
import AppHeader from '../../appHeader/AppHeader';
import GamesList from './gamesList/GamesList';
import Filters from './filters/Filters';
import { INIT_COLUMNS_COUNTER } from '../../../utils/Constants';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './PlayerPage.module.css';

interface TypeObject {
    [index: number]: boolean;
}

const PlayerPages: FC = () => {
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();
    const [games, setGames] = useState(Array<TypeGame>());
    const [filtersGames, setFiltersGames] = useState(Array<TypeGame>());

    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [columnsCounter, setColumnsCounter] = useState(INIT_COLUMNS_COUNTER);

    useEffect(() => {
        getAllGames().then((games) => setGames(games));
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const idGamesInGroup = useMemo(() => {
        return groups.reduce((result, group) => {
            group.games.forEach((gameId) => (result[gameId] = true));
            return result;
        }, {} as TypeObject);
    }, [groups]);

    return (
        <>
            <AppHeader />
            <div className={styles.app__mainblock}>
                <GamesList
                    games={filtersGames.length === 0 ? games.filter((game) => idGamesInGroup[game.id]) : filtersGames}
                    columnsCounter={columnsCounter}
                />
                <Filters
                    games={games.filter((game) => idGamesInGroup[game.id])}
                    filtersGames={filtersGames.length === 0 ? games.filter((game) => idGamesInGroup[game.id]) : filtersGames}
                    handleFiltersGames={setFiltersGames}
                    providers={providers}
                    groups={groups}
                    columnsCounter={columnsCounter}
                    handleColumnsCounter={setColumnsCounter}
                />
            </div>
        </>
    );
};

export default PlayerPages;
