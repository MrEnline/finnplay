import { useState, useEffect } from 'react';
import useJSONService from '../../services/JSONService';
import styles from './GamesList.module.css';

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

const GamesList = () => {
    const { getAllGames } = useJSONService();
    const [games, setGames] = useState(Array<TypeGame>);

    useEffect(() => {
        getAllGames().then((games) => setGames(games));
    });

    const createListGames = (arr: Array<TypeGame>) => {
        const newArrImgs = arr.map((item, index) => {
            return (
                <img
                    src={item.cover}
                    alt={item.name}
                    className={styles.games__img}
                />
            );
        });

        return <div className={styles.games__grid}>{newArrImgs}</div>;
    };

    const listGames = createListGames(games);

    return <div className={styles.games__list}>{listGames}</div>;
};

export default GamesList;
