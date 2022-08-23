import React, { useState, useEffect, useRef } from "react";
import AppHeader from "../../appHeader/AppHeader";
import useJSONService from "../../../services/JSONService";
import { TypeGame, TypeProvider, TypeGroup } from "../../../utils/Interfaces";
import styles from "./AdminPage.module.css";
import "./AdminPage.css";
import Groups from "./groups/Groups";
import ButtonClose from "../../../../src/assets/img/icon-close.svg";
import Select, { OnChangeValue } from "react-select";
import classNames from "classnames";

interface TypeDataGroup {
    id: number;
    options: Array<TypeOptions>;
}

interface TypeOptions {
    value: string;
    label: string;
}

const AdminPage = () => {
    const { getAllGames, getAllProviders, getAllGroups, deleteGroup } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [selectedGroup, setSelectedGroup] = useState<string>("");
    const [selectedGames, setSelectedGames] = useState<Array<string>>([]);
    const [dataDelete, setDataDelete] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [dataEdit, setDataEdit] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [isDeleteCompletely, setIsDeleteCompletly] = useState(false);
    const [isEditGroup, setIsEditGroup] = useState(false);

    const refCheckbox = useRef(null);

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const handleFormListGroup = (id: number) => {
        const options = groups
            .filter((group) => group.id !== id)
            .reduce((result, currItem) => {
                result.push({ value: currItem.name, label: currItem.name });
                return result;
            }, Array<TypeOptions>());
        setDataDelete({ id, options });
    };

    const handleFormListGames = (id: number) => {
        const options = games.reduce((result, game) => {
            result.push({ value: game.name, label: game.name });
            return result;
        }, Array<TypeOptions>());
        setDataEdit({ id, options });
        setSelectedGames(
            groups
                .find((group) => group.id === id)!!
                .games.reduce((result, gameId) => {
                    result.push(games.find((game) => game.id === gameId)!!.name);
                    return result;
                }, Array<string>()),
        );
    };

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups games={games} groups={groups} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        ) : (
            <Groups games={[]} groups={[]} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        );

    const numberIdDeleteGroup =
        groups.length > 0 && dataDelete.id > 0 ? groups[groups.findIndex((group) => group.id === dataDelete.id)].games.length : 0;

    const nameGroup = groups.length > 0 && dataEdit.id > 0 ? groups[groups.findIndex((group) => group.id === dataEdit.id)].name : "Загрузка данных";

    const handleResetDeleteSettings = () => {
        setDataDelete({ id: 0, options: [] });
        //setDataEdit({ id: 0, options: [] });
        setSelectedGroup("");
        setIsDeleteCompletly(false);
    };

    const handleResetEditSettings = () => {
        setDataEdit({ id: 0, options: [] });
        setSelectedGames([]);
        setIsEditGroup(false);
    };

    const handleResetSelectedGroup = () => {
        setSelectedGroup("");
        setIsDeleteCompletly(!isDeleteCompletely);
    };

    const handleChangeGroup = (newSelectedGroup: OnChangeValue<TypeOptions, boolean>) => {
        setSelectedGroup((newSelectedGroup as TypeOptions).value);
    };

    const isCompareGamesEdit = (namesGames: Array<string>) => {
        const gamesGroup = groups.find((group) => group.id === dataEdit.id)?.games;
        if (gamesGroup) {
            if (gamesGroup.length !== namesGames.length) return false;
            for (let i = 0; i < gamesGroup.length; i++) {
                const nameGame = games.find((game) => game.id === gamesGroup[i])?.name;
                if (nameGame) {
                    if (namesGames.indexOf(nameGame) < 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleChangeGames = (newSelectedGames: OnChangeValue<TypeOptions, boolean>) => {
        const arrNewSelectedGames = (newSelectedGames as TypeOptions[]).map((game) => game.value);
        setSelectedGames(arrNewSelectedGames);
        if (!isCompareGamesEdit(arrNewSelectedGames)) {
            setIsEditGroup(true);
        } else {
            setIsEditGroup(false);
        }
    };

    const handleGetSelectedGroup = () => {
        return dataDelete.options.filter((group) => group.value.toLowerCase() === selectedGroup.toLowerCase());
    };

    const handleGetSelectedGames = () => {
        return dataEdit.options.filter((game) => selectedGames.indexOf(game.value) >= 0);
    };

    const handleDeleteGroup = async (isPermitDelete: boolean) => {
        if (!isPermitDelete) return;
        const idDeleteGroup = dataDelete.id;
        const idMoveGroup =
            selectedGroup !== "" ? groups[groups.findIndex((group) => group.name.toLowerCase() === selectedGroup.toLowerCase())].id : 0;
        setDataDelete({ id: 0, options: [] });
        await deleteGroup(idDeleteGroup, idMoveGroup).then((groups) => setGroups(groups));
        setIsDeleteCompletly(false);
    };

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <div className={classNames(styles.popupdelete, { [styles.popupdelete_visible]: dataDelete.id > 0 })}>
                <div className={styles.popupdelete__body}>
                    <div className={styles.popupdelete__close}>
                        <img onClick={handleResetDeleteSettings} src={ButtonClose} alt="close" />
                    </div>
                    <div className={styles.popupdelete__content}>
                        <div className={styles.popupdelete__title}>Group delete</div>
                        <div className={styles.popupdelete__text}>
                            Do you want to delete Slots group? <br />
                            If you want to move {numberIdDeleteGroup} games, select new group below.
                        </div>
                        <div className={styles.content}>
                            <div className={classNames({ [styles.content_disabled]: isDeleteCompletely })}>
                                <Select
                                    classNamePrefix="input"
                                    value={handleGetSelectedGroup()}
                                    onChange={handleChangeGroup}
                                    options={dataDelete.options}
                                    placeholder="Move games to"
                                />
                            </div>
                            <div className={styles.checkbox}>
                                <div>
                                    <label className={styles.checkbox__externalbox}></label>
                                    <input ref={refCheckbox} className={styles.checkbox__input} type="checkbox" id="checkbox" />
                                    <label
                                        onClick={handleResetSelectedGroup}
                                        className={classNames(styles.checkbox__innerbox, {
                                            [styles.checkbox__innerbox_hide]: !isDeleteCompletely,
                                        })}
                                        htmlFor="checkbox"
                                    ></label>
                                </div>
                                <div className={styles.checkbox__title}>Delete comletely</div>
                            </div>
                            <div className={styles.popupdelete__buttons}>
                                <div
                                    className={classNames(styles.button, { [styles.button_coloryes]: isDeleteCompletely || selectedGroup !== "" })}
                                    onClick={() => handleDeleteGroup(isDeleteCompletely || selectedGroup !== "")}
                                >
                                    <span
                                        className={classNames(styles.button__text, {
                                            [styles.button__text_color]: isDeleteCompletely || selectedGroup !== "",
                                        })}
                                    >
                                        Yes, delete
                                    </span>
                                </div>
                                <div onClick={handleResetDeleteSettings} className={classNames(styles.button, styles.button_colorno)}>
                                    <span className={classNames(styles.button__text, styles.button__text_color)}>No</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classNames(styles.popupedit, { [styles.popupedit_visible]: dataEdit.id > 0 })}>
                <div className={styles.popupedit__body}>
                    <div className={styles.popupedit__close}>
                        <img onClick={handleResetEditSettings} src={ButtonClose} alt="close" />
                    </div>
                    <div className={styles.popupedit__content}>
                        <div className={styles.popupedit__title}>Group editing</div>
                        <div className={classNames(styles.popupedit__groupname, styles.groupname)}>
                            <div className={styles.groupname__content}>
                                <span className={styles.groupname__title}>Group name</span>
                                <span className={styles.groupname__name}>{nameGroup}</span>
                            </div>
                        </div>
                        <Select
                            classNamePrefix="input"
                            onChange={handleChangeGames}
                            value={handleGetSelectedGames()}
                            options={dataEdit.options}
                            placeholder="Move games to"
                            isMulti
                        />
                        <div className={styles.popupedit__buttons}>
                            <div
                                className={classNames(styles.button, {
                                    [styles.button_colorsave]: isEditGroup,
                                })}
                                onClick={() => handleDeleteGroup(isDeleteCompletely || selectedGames.length > 0)}
                            >
                                <span
                                    className={classNames(styles.button__text, {
                                        [styles.button__text_save]: isEditGroup,
                                    })}
                                >
                                    Save
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
