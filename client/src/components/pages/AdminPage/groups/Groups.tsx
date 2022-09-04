import { FC } from "react";
import styles from "./Groups.module.css";
import { TypeGame, TypeGroup } from "../../../../utils/Interfaces";
import IconAdd from "../../../../assets/img/icon-add.svg";
import IconEdit from "../../../../assets/img/icon-edit.svg";
import IconDelete from "../../../../assets/img/icon-delete.svg";
import ButtonEdit from "../../../../assets/img/button-edit.svg";
import ButtonDelete from "../../../../assets/img/button-delete.svg";
import classNames from "classnames";
import { NUMBER_ELEMENT_IN_ROW } from "../../../../utils/Constants";

interface TypeProp {
    games: Array<TypeGame>;
    groups: Array<TypeGroup>;
    onSetDataDeleteGroup: (id: number) => void;
    onSetDataEditGroup: (id: number) => void;
    onSetDataAddGroup: () => void;
}

const Groups: FC<TypeProp> = ({ games, groups, onSetDataDeleteGroup, onSetDataEditGroup, onSetDataAddGroup }) => {
    const createGroups = () => {
        if (groups.length === 0) return;

        const divGroupsArr = groups.map((group) => {
            return (
                <div className={styles.group}>
                    <div className={styles.group__images}>
                        <div className={classNames(styles.group__wrap1, styles.wrappers)}>
                            <img src={games[games.findIndex((item) => item.id === group.games[0])].cover} alt="game" />
                        </div>
                        <div className={classNames(styles.group__wrap2, styles.wrappers)}>
                            <img src={group.games[1] ? games[games.findIndex((item) => item.id === group.games[1])].cover : undefined} alt="game" />
                        </div>
                        <div className={classNames(styles.group__wrap3, styles.wrappers)}>
                            <img src={group.games[2] ? games[games.findIndex((item) => item.id === group.games[2])].cover : undefined} alt="game" />
                        </div>
                    </div>
                    <div className={styles.group__name}>{group.name}</div>
                    <div className={styles.group__buttons}>
                        <div className={classNames(styles.button, styles.button__edit)}>
                            <img
                                data-id={group.id}
                                onClick={(e) => onSetDataEditGroup(+e.currentTarget.dataset.id!)}
                                alt="icon-edit"
                                src={IconEdit}
                            />
                            <img
                                data-id={group.id}
                                onClick={(e) => onSetDataEditGroup(+e.currentTarget.dataset.id!)}
                                alt="button-edit"
                                src={ButtonEdit}
                            />
                        </div>
                        <div className={classNames(styles.button, styles.button__delete)}>
                            <img
                                data-id={group.id}
                                onClick={(e) => onSetDataDeleteGroup(+e.currentTarget.dataset.id!)}
                                alt="icon-delete"
                                src={IconDelete}
                            />
                            <img
                                data-id={group.id}
                                onClick={(e) => onSetDataDeleteGroup(+e.currentTarget.dataset.id!)}
                                alt="button-delete"
                                src={ButtonDelete}
                            />
                        </div>
                    </div>
                </div>
            );
        });

        // const divGroupArrRow = [];
        // for (let index = 0; index < divGroupsArr.length; index += NUMBER_ELEMENT_IN_ROW) {
        //     divGroupArrRow.push(divGroupsArr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
        // }

        const divGroupArrRow = divGroupsArr.reduce((result, group, index, arr) => {
            if (index % NUMBER_ELEMENT_IN_ROW === 0) {
                result.push(arr.slice(index, index + NUMBER_ELEMENT_IN_ROW));
            }
            return result;
        }, new Array<JSX.Element[]>());

        return divGroupArrRow.map((item) => {
            return <div className={styles.groups__rowgroups}>{item}</div>;
        });
    };

    return (
        <div className={styles.app__groups}>
            <div className={styles.groups__title}>
                <span className={styles.groups__titletext}>Groups</span>
                <img onClick={onSetDataAddGroup} alt="add" src={IconAdd} />
            </div>
            <div className={styles.groups__games}>{createGroups()}</div>
        </div>
    );
};

export default Groups;
