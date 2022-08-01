import { FC } from 'react';
import styles from './Groups.module.css';
import { TypeGame, TypeGroup } from '../../../../utils/Interfaces';
import IconAdd from '../../../../assets/img/icon-add.svg';
import IconEdit from '../../../../assets/img/icon-edit.svg';
import IconDelete from '../../../../assets/img/icon-delete.svg';
import ButtonEdit from '../../../../assets/img/button-edit.svg';
import ButtonDelete from '../../../../assets/img/button-delete.svg';
import classNames from 'classnames';

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
                    <div className={styles.group}>
                        <div className={styles.group__images}>
                            <div className={classNames(styles.group__wrap1, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[0].games[0])].cover} alt="game" />
                            </div>
                            <div className={classNames(styles.group__wrap2, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[0].games[1])].cover} alt="game" />
                            </div>
                            <div className={classNames(styles.group__wrap3, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[0].games[2])].cover} alt="game" />
                            </div>
                        </div>
                        <div className={styles.group__name}>{groups[0].name}</div>
                        <div className={styles.group__buttons}>
                            <div className={classNames(styles.button, styles.button__edit)}>
                                <img alt="icon-edit" src={IconEdit} />
                                <img alt="button-edit" src={ButtonEdit} />
                            </div>
                            <div className={classNames(styles.button, styles.button__delete)}>
                                <img alt="icon-delete" src={IconDelete} />
                                <img alt="button-delete" src={ButtonDelete} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <div className={styles.group__images}>
                            <div className={classNames(styles.group__wrap1, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[1].games[0])].cover} alt="game" />
                            </div>
                            <div className={classNames(styles.group__wrap2, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[1].games[1])].cover} alt="game" />
                            </div>
                            <div className={classNames(styles.group__wrap3, styles.wrappers)}>
                                <img src={games[games.findIndex((item) => item.id === groups[1].games[2])].cover} alt="game" />
                            </div>
                        </div>
                        <div className={styles.group__name}>{groups[1].name}</div>
                        <div className={styles.group__buttons}>
                            <div className={classNames(styles.button, styles.button__edit)}>
                                <img alt="icon-edit" src={IconEdit} />
                                <img alt="button-edit" src={ButtonEdit} />
                            </div>
                            <div className={classNames(styles.button, styles.button__delete)}>
                                <img alt="icon-delete" src={IconDelete} />
                                <img alt="button-delete" src={ButtonDelete} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
