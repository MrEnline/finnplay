import { FC } from "react";
import { TypeGame } from "../../../../utils/Interfaces";
import styles from "./Games.module.css";
import { NUMBER_ELEMENT_IN_ROW } from "../../../../utils/Constants";

interface TypeProp {
    games: Array<TypeGame>;
}

const Games: FC<TypeProp> = ({ games }) => {
    const createGames = () => {
        if (games.length === 0) return;

        const divGamesArr = games.map((game) => {
            return (
                <div className={styles.game}>
                    <div className={styles.game__image}>
                        <img src={game.cover} alt="game" />
                    </div>
                    <div className={styles.game__name}>{game.name}</div>
                </div>
            );
        });

        const divGamesArrRow = [];
        for (let index = 0; index < divGamesArr.length; index += NUMBER_ELEMENT_IN_ROW) {
            divGamesArrRow.push(divGamesArr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
        }

        return divGamesArrRow.map((item) => {
            return <div className={styles.games__rowgames}>{item}</div>;
        });
    };

    return (
        <div className={styles.app__games}>
            <div className={styles.games__title}>
                <span className={styles.games__titletext}>Games</span>
            </div>
            {createGames()}
        </div>
    );
};

export default Games;
