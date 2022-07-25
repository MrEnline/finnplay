import { FC } from 'react';
import styles from './GamesList.module.css';

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

interface TypeProp {
    games: Array<TypeGame>;
    columnsCounter: number;
}

declare module 'csstype' {
    interface Properties {
        '--sliderValue'?: number;
    }
}

const GamesList: FC<TypeProp> = ({ games, columnsCounter }) => {
    const createListGames = (arr: Array<TypeGame>) => {
        const newArrImgs = arr.map((item) => {
            return (
                <img
                    className={styles.games__img}
                    src={item.coverLarge}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = item.cover;
                    }}
                    alt="cover"
                />
            );
            //return <img src={item.cover} alt={item.name} className={styles.games__img} />;
        });

        return (
            <div style={{ '--sliderValue': columnsCounter }} className={styles.games__grid}>
                {newArrImgs}
            </div>
        );
    };

    const listGames = createListGames(games);

    return <div className={styles.games__list}>{listGames}</div>;
};

export default GamesList;
