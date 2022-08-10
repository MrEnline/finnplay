import React, { useState, useEffect } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import Groups from './groups/Groups';
import ButtonClose from '../../../../src/assets/img/icon-close.svg';
import Select from 'react-select';
import classNames from 'classnames';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

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
    const [idDelete, setIdDelete] = useState(0);
    const [idEdit, setIdEdit] = useState(0);

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const resultLoadGroups =
        games.length > 0 && groups.length > 0 ? (
            <Groups games={games} groups={groups} onSetIdDeleteGroup={setIdDelete} onSetIdEditGroup={setIdEdit} />
        ) : (
            <div>ЗАГРУЗКА ДАННЫХ</div>
        );

    const numberIdDeleteGroup = groups.length > 0 && idDelete > 0 ? groups[groups.findIndex((group) => group.id === idDelete)].games.length : 0;

    const formListGroup = (id: number) => {
        const newArrListGroup = groups.filter((group) => group.id !== id);
        const temp = newArrListGroup.reduce((options, group) => {
            options.push({ value: group.name, label: group.name });
        }, Array<TypeDeleteGroup>);
        console.log(`newArrListGroup - ${newArrListGroup}`);
    };

    formListGroup(1);

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <div className={classNames(styles.popupdelete, { [styles.popupdelete_visible]: idDelete > 0 })}>
                <div className={styles.popupdelete__body}>
                    <div className={styles.popupdelete__close}>
                        <img onClick={() => setIdDelete(0)} src={ButtonClose} alt="close" />
                    </div>
                    <div className={styles.popupdelete__content}>
                        <div className={styles.popupdelete__title}>Group delete</div>
                        <div className={styles.popupdelete__text}>
                            Do you want to delete Slots group? <br />
                            If you want to move {numberIdDeleteGroup} games, select new group below.
                        </div>
                        <div className={styles.content}>
                            <div className={styles.input}>
                                <Select defaultValue={selectedOption} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
