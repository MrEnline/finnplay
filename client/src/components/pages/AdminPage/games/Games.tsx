import { FC } from 'react';
import { TypeGame } from '../../../../utils/Interfaces';
import styles from './Games.module.css';
import { NUMBER_ELEMENT_IN_ROW } from '../../../../utils/Constants';

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
                        <img src={game.coverLarge} alt={game.name} />
                    </div>
                    <div className={styles.game__name}>{game.name}</div>
                </div>
            );
        });

        const divGamesArrRow = divGamesArr.reduce((result, game, index, arr) => {
            if (index % NUMBER_ELEMENT_IN_ROW === 0) {
                result.push(arr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
            }
            return result;
        }, new Array<JSX.Element[]>());

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
