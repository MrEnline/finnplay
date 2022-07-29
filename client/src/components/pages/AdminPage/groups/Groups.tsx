import { FC } from 'react';
import styles from './Groups.module.css';
import { TypeGame, TypeGroup } from '../../../../utils/Interfaces';
import IconAdd from '../../../../assets/img/icon-add.svg';

interface TypeProp {
    games: Array<TypeGame>;
    groups: Array<TypeGroup>;
}

const Groups: FC<TypeProp> = ({ games, groups }) => {
    return (
        <div className={styles.app__groups}>
            <div className={styles.groups__title}>
                <span className={styles.groups__titletext}>Groups</span>
                <img onClick={() => console.log('add group')} alt="add" src={IconAdd} />
            </div>
            <div className={styles.groups__games}>
                <div className={styles.groups__rowgames}>
                    <div className={styles.groups__game}>
                        <div className={styles.groups__images}>
                            <img
                                className={styles.groups__img1}
                                src={games[games.findIndex((item) => item.id === groups[0].games[0])].coverLarge}
                                alt="game"
                            />
                            <img
                                className={styles.groups__img2}
                                src={games[games.findIndex((item) => item.id === groups[0].games[1])].coverLarge}
                                alt="game"
                            />
                            <img
                                className={styles.groups__img3}
                                src={games[games.findIndex((item) => item.id === groups[0].games[2])].coverLarge}
                                alt="game"
                            />
                        </div>
                    </div>
                    <div className={styles.groups__game}>
                        <div className={styles.groups__images}>
                            <img
                                className={styles.groups__img1}
                                src={games[games.findIndex((item) => item.id === groups[1].games[0])].coverLarge}
                                alt="game"
                            />
                            <img
                                className={styles.groups__img2}
                                src={games[games.findIndex((item) => item.id === groups[1].games[1])].coverLarge}
                                alt="game"
                            />
                            <img
                                className={styles.groups__img3}
                                src={games[games.findIndex((item) => item.id === groups[1].games[2])].coverLarge}
                                alt="game"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
