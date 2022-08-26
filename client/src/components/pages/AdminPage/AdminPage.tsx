import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import './AdminPage.css';
import Groups from './groups/Groups';
import ButtonClose from '../../../../src/assets/img/icon-close.svg';
import Select, { OnChangeValue } from 'react-select';
import classNames from 'classnames';
//import Modal from 'react-modal';
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
    const { getAllGames, getAllProviders, getAllGroups, deleteGroup } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [selectedOption, setSelectedOption] = useState<TypeOptions | null>(null);
    const [dataDelete, setDataDelete] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [dataEdit, setDataEdit] = useState<TypeDataGroup>({ id: 0, options: Array<TypeOptions>() });
    const [isDeleteCompletely, setIsDeleteCompletly] = useState(false);

    const refCheckbox = useRef(null);

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const handleFormListGroup = useCallback(
        (id: number) => {
            const options = groups
                .filter((group) => group.id !== id)
                .reduce((result, currValue) => {
                    result.push({ value: currValue.name, label: currValue.name });
                    return result;
                }, Array<TypeOptions>());
            setDataDelete({ id, options });
        },
        [dataDelete.options]
    );

    const handleFormListGames = useCallback(
        (id: number) => {
            const options = groups
                .filter((group) => group.id !== id)
                .reduce((result, currValue) => {
                    result.push({ value: currValue.name, label: currValue.name });
                    return result;
                }, Array<TypeOptions>());
            setDataEdit({ id, options });
        },
        [dataEdit.options]
    );

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups games={games} groups={groups} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        ) : (
            <Groups games={[]} groups={[]} onSetDataDeleteGroup={handleFormListGroup} onSetDataEditGroup={handleFormListGames} />
        );

    const numberIdDeleteGroup =
        groups.length > 0 && dataDelete.id > 0 ? groups[groups.findIndex((group) => group.id === dataDelete.id)].games.length : 0;

    const nameGroup = groups.length > 0 && dataEdit.id > 0 ? groups[groups.findIndex((group) => group.id === dataEdit.id)].name : 'Загрузка данных';

    const handleResetSettings = useCallback(() => {
        setDataDelete({ id: 0, options: [] });
        setDataEdit({ id: 0, options: [] });
        setSelectedOption(null);
        setIsDeleteCompletly(false);
    }, []);

    const handleResetSelectedOptions = () => {
        setSelectedOption(null);
        setIsDeleteCompletly(!isDeleteCompletely);
    };

    const handleChangeValue = (newValue: any) => {
        //console.log(newValue);
        setSelectedOption(newValue);
    };

    const handleDeleteGroup = async () => {
        if (!(isDeleteCompletely || selectedOption !== null)) return;
        const idDeleteGroup = dataDelete.id;
        const idMoveGroup =
            selectedOption !== null
                ? groups[groups.findIndex((group) => group.name.toLowerCase() === (selectedOption as TypeOptions).value.toLowerCase())].id
                : 0;
        setDataDelete({ id: 0, options: [] });
        await deleteGroup(idDeleteGroup, idMoveGroup).then((groups) => setGroups(groups));
        setIsDeleteCompletly(false);
    };

    // const handleDeleteGroup = async (isPermitDelete: boolean) => {
    //     if (!isPermitDelete) return;
    //     const idDeleteGroup = dataDelete.id;
    //     const idMoveGroup =
    //         selectedOption !== null
    //             ? groups[groups.findIndex((group) => group.name.toLowerCase() === (selectedOption as TypeOptions).value.toLowerCase())].id
    //             : 0;
    //     setDataDelete({ id: 0, options: [] });
    //     await deleteGroup(idDeleteGroup, idMoveGroup).then((groups) => setGroups(groups));
    //     setIsDeleteCompletly(false);
    // };

    const description = (
        <>
            Do you want to delete Slots group? <br /> If you want to move {numberIdDeleteGroup} games, select new group below.
        </>
    );

    // console.log(`isDeleteCompletely - ${isDeleteCompletely}`);
    // console.log(`refCheckbox - ${(refCheckbox.current!! as HTMLInputElement).checked}`);
    //if (selectedOption !== null) console.log(`selectedOption - ${(selectedOption as TypeOptions).value}`);
    // Modal.setAppElement('#yourAppElement');
    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <Modal title={'Group delete'} description={description} isOpen={dataDelete.id > 0} onResetSettings={handleResetSettings}>
                <>
                    <div className={classNames({ [styles.content_disabled]: isDeleteCompletely })}>
                        <Select
                            classNamePrefix="input"
                            value={selectedOption}
                            onChange={handleChangeValue}
                            options={dataDelete.options}
                            placeholder="Move games to"
                        />
                    </div>
                    <div className={styles.checkbox}>
                        <div>
                            <label className={styles.checkbox__externalbox}></label>
                            <input ref={refCheckbox} className={styles.checkbox__input} type="checkbox" id="checkbox" />
                            <label
                                onClick={handleResetSelectedOptions}
                                className={classNames(styles.checkbox__innerbox, {
                                    [styles.checkbox__innerbox_hide]: !isDeleteCompletely,
                                })}
                                htmlFor="checkbox"
                            ></label>
                        </div>
                        <div className={styles.checkbox__title}>Delete comletely</div>
                    </div>
                    <Button
                        onClick={handleDeleteGroup}
                        classNameButton="button_delete"
                        disabled={isDeleteCompletely || selectedOption !== null}
                        active={isDeleteCompletely || selectedOption !== null}
                    >
                        Yes, delete
                    </Button>
                </>
            </Modal>
            {/* <Modal
                isOpen={dataDelete.id > 0}
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #ccc',
                        background: '#fff',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px',
                    },
                }}
            >
                <div className={styles.popupdelete__close}>
                    <img onClick={handleResetSettings} src={ButtonClose} alt="close" />
                </div>
            </Modal> */}
            {/* <div className={classNames(styles.popupdelete, { [styles.popupdelete_visible]: dataDelete.id > 0 })}>
                <div className={styles.popupdelete__body}>
                    <div className={styles.popupdelete__close}>
                        <img onClick={handleResetSettings} src={ButtonClose} alt="close" />
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
                                    value={selectedOption}
                                    onChange={handleChangeValue}
                                    options={dataDelete.options}
                                    placeholder="Move games to"
                                />
                            </div>
                            <div className={styles.checkbox}>
                                <div>
                                    <label className={styles.checkbox__externalbox}></label>
                                    <input ref={refCheckbox} className={styles.checkbox__input} type="checkbox" id="checkbox" />
                                    <label
                                        onClick={handleResetSelectedOptions}
                                        className={classNames(styles.checkbox__innerbox, {
                                            [styles.checkbox__innerbox_hide]: !isDeleteCompletely,
                                        })}
                                        htmlFor="checkbox"
                                    ></label>
                                </div>
                                <div className={styles.checkbox__title}>Delete comletely</div>
                            </div>
                        </div>
                        <div className={styles.popupdelete__buttons}>
                            <div
                                className={classNames(styles.button, { [styles.button_coloryes]: isDeleteCompletely || selectedOption !== null })}
                                onClick={() => handleDeleteGroup(isDeleteCompletely || selectedOption !== null)}
                            >
                                <span
                                    className={classNames(styles.button__text, {
                                        [styles.button__text_color]: isDeleteCompletely || selectedOption !== null,
                                    })}
                                >
                                    Yes, delete
                                </span>
                            </div>
                            <div onClick={handleResetSettings} className={classNames(styles.button, styles.button_colorno)}>
                                <span className={classNames(styles.button__text, styles.button__text_color)}>No</span>
                            </div>
                        </div>
                        <div className={styles.test}>TEST</div>
                        <div className={styles.test}>TEST</div>
                        <div className={styles.test}>TEST</div>
                        <div className={styles.test}>TEST</div>
                    </div>
                </div>
            </div> */}
            {/* <div className={classNames(styles.popupedit, { [styles.popupedit_visible]: dataEdit.id > 0 })}>
                <div className={styles.popupedit__body}>
                    <div className={styles.popupedit__close}>
                        <img onClick={handleResetSettings} src={ButtonClose} alt="close" />
                    </div>
                    <div className={styles.popupedit__content}>
                        <div className={styles.popupedit__title}>Group editing</div>
                        <div className={classNames(styles.popupedit__groupname, styles.groupname)}>
                            <div className={styles.groupname__content}>
                                <span className={styles.groupname__title}>Group name</span>
                                <span className={styles.groupname__name}>{nameGroup}</span>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <div className={classNames({ [styles.content_disabled]: isDeleteCompletely })}>
                                <Select
                                    classNamePrefix="input"
                                    value={selectedOption}
                                    onChange={handleChangeValue}
                                    options={dataDelete.options}
                                    placeholder="Move games to"
                                />
                            </div>
                            <div className={styles.popupedit__buttons}>
                                <div
                                    className={classNames(styles.button, { [styles.button_coloryes]: isDeleteCompletely || selectedOption !== null })}
                                    onClick={() => handleDeleteGroup(isDeleteCompletely || selectedOption !== null)}
                                >
                                    <span
                                        className={classNames(styles.button__text, {
                                            [styles.button__text_color]: isDeleteCompletely || selectedOption !== null,
                                        })}
                                    >
                                        Save
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default AdminPage;
