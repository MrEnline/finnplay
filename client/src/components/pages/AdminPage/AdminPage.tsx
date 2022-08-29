import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import './AdminPage.css';
import Groups from './groups/Groups';
import Select, { OnChangeValue } from 'react-select';
import classNames from 'classnames';
import Modal from '../../modal/Modal';
import Button from '../../button/Button';

interface TypeDataGroup {
    id: number;
    options: Array<TypeOptions>;
}

interface TypeOptions {
    value: string;
    label: string;
}

const AdminPage = () => {
    const { getAllGames, getAllProviders, getAllGroups, deleteGroup, editGroup } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [selectedGroup, setSelectedGroup] = useState<string>('');
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
                }, Array<string>())
        );
    };

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups games={games} groups={groups} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        ) : (
            <Groups games={[]} groups={[]} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        );

    const dataDeleteGroup =
        groups.length > 0 && dataDelete.id > 0
            ? {
                  nameGame: groups[groups.findIndex((group) => group.id === dataDelete.id)].name,
                  numberGame: groups[groups.findIndex((group) => group.id === dataDelete.id)].games.length,
              }
            : null;

    const nameEditGroup =
        groups.length > 0 && dataEdit.id > 0 ? groups[groups.findIndex((group) => group.id === dataEdit.id)].name : 'Загрузка данных';

    const handleResetDeleteSettings = () => {
        setDataDelete({ id: 0, options: [] });
        //setDataEdit({ id: 0, options: [] });
        setSelectedGroup('');
        setIsDeleteCompletly(false);
    };

    const handleResetEditSettings = () => {
        setDataEdit({ id: 0, options: [] });
        setSelectedGames([]);
        setIsEditGroup(false);
    };

    const handleResetSelectedGroup = () => {
        setSelectedGroup('');
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

    const handleDeleteGroup = async () => {
        const idMoveGroup =
            selectedGroup !== '' ? groups[groups.findIndex((group) => group.name.toLowerCase() === selectedGroup.toLowerCase())].id : 0;
        setDataDelete({ id: 0, options: [] });
        await deleteGroup(dataDelete.id, idMoveGroup).then((groups) => setGroups(groups));
        setIsDeleteCompletly(false);
    };

    const handleEditGroup = async () => {};

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <Modal
                title={'Group delete'}
                isOpen={dataDelete.id > 0}
                dataDeleteGroup={dataDeleteGroup}
                nameEditGroup={nameEditGroup}
                onResetSettings={handleResetDeleteSettings}
                body={
                    <>
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
                    </>
                }
                footer={
                    <>
                        <Button onClick={handleDeleteGroup} classNameButton="button_delete" disabled={!(isDeleteCompletely || selectedGroup !== '')}>
                            Yes, delete
                        </Button>
                        <Button onClick={handleResetDeleteSettings} classNameButton="button_cancel" disabled={false}>
                            No
                        </Button>
                    </>
                }
            ></Modal>
            <Modal
                title={'Group edit'}
                isOpen={dataEdit.id > 0}
                dataDeleteGroup={null}
                nameEditGroup={nameEditGroup}
                onResetSettings={handleResetEditSettings}
                body={
                    <>
                        <Select
                            classNamePrefix="input"
                            onChange={handleChangeGames}
                            value={handleGetSelectedGames()}
                            options={dataEdit.options}
                            placeholder="Games"
                            isMulti
                        />
                    </>
                }
                footer={
                    <>
                        <Button onClick={handleEditGroup} classNameButton="button_edit" disabled={!isEditGroup}>
                            Save
                        </Button>
                    </>
                }
            ></Modal>
        </>
    );
};

export default AdminPage;
