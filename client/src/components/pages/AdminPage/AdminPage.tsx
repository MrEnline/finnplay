import React, { useState, useEffect } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import './AdminPage.css';
import Groups from './groups/Groups';
import ButtonClose from '../../../../src/assets/img/icon-close.svg';
import Select, { OnChangeValue } from 'react-select';
import classNames from 'classnames';

interface TypeDeleteGroup {
    id: number;
    options: Array<TypeOptions>;
}

interface TypeOptions {
    [value: string]: string;
}

const AdminPage = () => {
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());
    const [selectedOption, setSelectedOption] = useState(null);
    const [dataDelete, setDataDelete] = useState<TypeDeleteGroup>({ id: 0, options: [] });
    const [idEdit, setIdEdit] = useState(0);

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
            .reduce((result, currValue) => {
                result.push({ value: currValue.name, label: currValue.name });
                return result;
            }, Array<TypeOptions>());
        setDataDelete({ id, options });
    };

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups games={games} groups={groups} onSetDataDeleteGroup={handleFormListGroup} onSetIdEditGroup={setIdEdit} />
        ) : (
            <div>ЗАГРУЗКА ДАННЫХ</div>
        );

    const numberIdDeleteGroup =
        groups.length > 0 && dataDelete.id > 0 ? groups[groups.findIndex((group) => group.id === dataDelete.id)].games.length : 0;

    const handleResetSettings = () => {
        setDataDelete({ id: 0, options: [] });
        setSelectedOption(null);
    };

    const handleChangeValue = (newValue: any) => {
        setSelectedOption(newValue);
    };

    console.log(`selectedOption - ${selectedOption}`);

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <div className={classNames(styles.popupdelete, { [styles.popupdelete_visible]: dataDelete.id > 0 })}>
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
                            {/* <div className={styles.input}> */}
                            <Select
                                classNamePrefix="input"
                                value={selectedOption}
                                onChange={handleChangeValue}
                                options={dataDelete.options}
                                placeholder="Move games to"
                            />
                            {/* </div> */}
                            <div className={styles.checkbox}>
                                <div className={styles.checkbox__box}></div>
                                <div className={styles.checkbox__box_check}></div>
                                <div className={styles.checkbox__title}>Delete comletely</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
