import React, { useState, useEffect, useRef, useCallback, useMemo, FC } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeData, TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import './AdminPage.css';
import Groups from './groups/Groups';
import Select, { OnChangeValue } from 'react-select';
import classNames from 'classnames';
import Modal from '../../modal/Modal';
import Button from '../../button/Button';
import Games from './games/Games';
import Providers from './providers/Providers';

interface TypeDataGroup {
    id: number;
    options: Array<TypeOptions>;
}

interface TypeOptions {
    value: string;
    label: string;
}

const AdminPage: FC = () => {
    const { getAllGames, getAllProviders, getAllGroups, deleteGroup, editGroup, addGroup } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());

    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedGames, setSelectedGames] = useState<Array<string>>([]);
    const [dataDelete, setDataDelete] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [dataEdit, setDataEdit] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [dataAdd, setDataAdd] = useState<Array<TypeOptions>>([]);
    const [nameGroup, setNameGroup] = useState<string>('');
    const [isDeleteCompletely, setIsDeleteCompletly] = useState(false);
    const [isEditGroup, setIsEditGroup] = useState(false);
    const [isAddGroup, setIsAddGroup] = useState(false);
    const [isOpenModalAddGroup, setIsOpenModalAddGroup] = useState(false);

    const getMapGames = () => {
        return games.reduce((result, cValue) => {
            result.set(cValue.name, cValue.id);
            return result;
        }, new Map<string, number>());
    };

    const mapGames = useMemo(() => getMapGames(), [games]);

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
        setNameGroup(groups[getIndexId(groups, id)].name);
    };

    const handleOpenModal = () => {
        setIsOpenModalAddGroup(true);
        setDataAdd(
            games.reduce((result, game) => {
                result.push({ value: game.name, label: game.name });
                return result;
            }, Array<TypeOptions>())
        );
    };

    const getIndexId = (arr: Array<TypeData>, compareVal: number) => {
        return arr.findIndex((item) => item.id === compareVal);
    };

    const getIndexName = (arr: Array<TypeData>, compareVal: string) => {
        return arr.findIndex((item) => item.name.toLowerCase() === compareVal.toLowerCase());
    };

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups
                games={games}
                groups={groups}
                onSetDataDeleteGroup={handleFormListGroup}
                onSetDataEditGroup={handleFormListGames}
                onSetDataAddGroup={handleOpenModal}
            />
        ) : (
            <Groups
                games={[]}
                groups={[]}
                onSetDataDeleteGroup={handleFormListGroup}
                onSetDataEditGroup={handleFormListGames}
                onSetDataAddGroup={handleOpenModal}
            />
        );

    const dataDeleteGroup = useMemo(() => {
        return groups.length > 0 && dataDelete.id > 0
            ? {
                  nameGame: groups[getIndexId(groups, dataDelete.id)].name,
                  numberGame: groups[getIndexId(groups, dataDelete.id)].games.length,
              }
            : null;
    }, [dataDelete.id]);

    const handleResetDeleteSettings = () => {
        setDataDelete({ id: 0, options: [] });
        setSelectedGroup('');
        setIsDeleteCompletly(false);
    };

    const handleResetEditSettings = () => {
        setDataEdit({ id: 0, options: [] });
        setSelectedGames([]);
        setIsEditGroup(false);
        setNameGroup('');
    };

    const handleResetAddSettings = () => {
        setDataAdd([]);
        setIsOpenModalAddGroup(false);
        setIsAddGroup(false);
        setNameGroup('');
        setSelectedGames([]);
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

    const handleChangeEditGames = (newSelectedGames: OnChangeValue<TypeOptions, boolean>) => {
        const arrNewSelectedGames = (newSelectedGames as TypeOptions[]).map((game) => game.value);
        setSelectedGames(arrNewSelectedGames);
        if (!isCompareGamesEdit(arrNewSelectedGames) || nameGroup !== groups[getIndexId(groups, dataEdit.id)].name) {
            setIsEditGroup(true);
        } else {
            setIsEditGroup(false);
        }
    };

    const handleChangeAddGames = (newSelectedGames: OnChangeValue<TypeOptions, boolean>) => {
        const arrNewSelectedGames = (newSelectedGames as TypeOptions[]).map((game) => game.value);
        setSelectedGames(arrNewSelectedGames);
        if (nameGroup !== '' && arrNewSelectedGames.length > 0) {
            setIsAddGroup(true);
        } else {
            setIsAddGroup(false);
        }
    };

    const handleChangeNameGroup = (e: HTMLInputElement) => {
        setNameGroup(e.value);
        if (!isCompareGamesEdit(selectedGames) || (e.value !== '' && groups[getIndexId(groups, dataEdit.id)].name !== e.value)) {
            setIsEditGroup(true);
        } else {
            setIsEditGroup(false);
        }
    };

    const handleSetNewNameGroup = (e: HTMLInputElement) => {
        setNameGroup(e.value);
        if (e.value !== '' && selectedGames.length > 0) {
            setIsAddGroup(true);
        } else {
            setIsAddGroup(false);
        }
    };

    const handleGetSelectedGroup = () => {
        return dataDelete.options.filter((group) => group.value.toLowerCase() === selectedGroup.toLowerCase());
    };

    const handleGetSelectedGames = (data: Array<TypeOptions>) => {
        return data.filter((game) => selectedGames.indexOf(game.value) >= 0);
    };

    const getSelectedGames = () => {
        return selectedGames.reduce((result, cValue) => {
            result.push(mapGames.get(cValue)!!);
            return result;
        }, Array<number>());
    };

    const handleDeleteGroup = () => {
        const idMoveGroup = selectedGroup !== '' ? groups[getIndexName(groups, selectedGroup)].id : 0;
        setDataDelete({ id: 0, options: [] });
        deleteGroup(dataDelete.id, idMoveGroup).then((groups) => setGroups(groups));
        setIsDeleteCompletly(false);
    };

    const handleEditGroup = () => {
        setIsEditGroup(false);
        editGroup(dataEdit.id, nameGroup, getSelectedGames()).then((groups) => setGroups(groups));
        if (selectedGames.length === 0) {
            handleResetEditSettings();
        }
    };

    const handleAddGroup = () => {
        setIsAddGroup(false);
        addGroup(nameGroup, getSelectedGames()).then((groups) => setGroups(groups));
    };

    return (
        <>
            <AppHeader />
            <div className={styles.adminpage}>
                <div>{resultLoadGroups}</div>
                <Games games={games} />
                <Providers providers={providers} />
            </div>
            <Modal
                title={'Group delete'}
                isOpen={dataDelete.id > 0}
                onResetSettings={handleResetDeleteSettings}
                description={
                    <>
                        Do you want to delete {dataDeleteGroup?.nameGame} group? <br /> If you want to move {dataDeleteGroup?.numberGame} games,
                        select new group below.
                    </>
                }
                body={
                    <>
                        <div className={classNames({ [styles.menu_disabled]: isDeleteCompletely })}>
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
                                <input className={styles.checkbox__input} type="checkbox" id="checkbox" />
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
                onResetSettings={handleResetEditSettings}
                description={
                    <>
                        <div className={styles.inputfield}>
                            <div className={styles.inputfield__content}>
                                <input
                                    className="groupname"
                                    type="groupname"
                                    name="groupname"
                                    id="groupname"
                                    value={nameGroup}
                                    onChange={(e) => handleChangeNameGroup(e.target)}
                                    required
                                />
                                <label htmlFor="groupname">Group name</label>
                            </div>
                        </div>
                    </>
                }
                body={
                    <>
                        <Select
                            classNamePrefix="input"
                            onChange={handleChangeEditGames}
                            value={handleGetSelectedGames(dataEdit.options)}
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
            <Modal
                title={'Group add'}
                isOpen={isOpenModalAddGroup}
                onResetSettings={handleResetAddSettings}
                description={
                    <>
                        <div className={styles.inputfield}>
                            <div className={styles.inputfield__content}>
                                <input
                                    className="groupname"
                                    type="groupname"
                                    name="groupname"
                                    id="groupname"
                                    value={nameGroup}
                                    onChange={(e) => handleSetNewNameGroup(e.target)}
                                    required
                                />
                                <label htmlFor="groupname">Group name</label>
                            </div>
                        </div>
                    </>
                }
                body={
                    <>
                        <Select
                            classNamePrefix="input"
                            onChange={handleChangeAddGames}
                            value={handleGetSelectedGames(dataAdd)}
                            options={dataAdd}
                            placeholder="Games"
                            isMulti
                        />
                    </>
                }
                footer={
                    <>
                        <Button onClick={handleAddGroup} classNameButton="button_edit" disabled={!isAddGroup}>
                            Save
                        </Button>
                    </>
                }
            ></Modal>
        </>
    );
};

export default AdminPage;
