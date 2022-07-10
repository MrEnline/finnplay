import { FC } from "react";
import styles from "./GamesList.module.css";

const GamesList: FC = () => {
    const createListGames = (arr: Array<TypeGame>) => {
        const newArrImgs = arr.map((item) => {
            return <img src={item.cover} alt={item.name} className={styles.games__img} />;
        });

        return <div className={styles.games__grid}>{newArrImgs}</div>;
    };

    const listGames = createListGames(games);

    return <div className={styles.games__list}>{listGames}</div>;
};

export default GamesList;
