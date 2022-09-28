import { useState, useEffect, useMemo, FC } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import GamesList from './gamesList/GamesList';
import Filters from './filters/Filters';
import { INIT_COLUMNS_COUNTER } from '../../../utils/Constants';
import { TypeGame } from '../../../utils/Interfaces';
import styles from './PlayerPage.module.css';
import { TypeObject } from '../../../utils/Interfaces';
import { useAllData } from '../../../hooks/data.hook';

const PlayerPages: FC = () => {
    const { getAllData, games, providers, groups } = useAllData();
    const [filtersGames, setFiltersGames] = useState<Array<TypeGame> | null>(null);
    const [columnsCounter, setColumnsCounter] = useState(INIT_COLUMNS_COUNTER);

    useEffect(() => {
        getAllData();
    }, []);

    const idGamesInGroups = useMemo(() => {
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
                    games={filtersGames === null ? games.filter((game) => idGamesInGroups[game.id]) : filtersGames}
                    columnsCounter={columnsCounter}
                />
                <Filters
                    games={games.filter((game) => idGamesInGroups[game.id])}
                    filtersGames={filtersGames === null ? games.filter((game) => idGamesInGroups[game.id]) : filtersGames}
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
