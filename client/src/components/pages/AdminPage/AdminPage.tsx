import { useState, useEffect } from 'react';
import AppHeader from '../../appHeader/AppHeader';
import useJSONService from '../../../services/JSONService';
import { TypeGame, TypeProvider, TypeGroup } from '../../../utils/Interfaces';
import styles from './AdminPage.module.css';
import Groups from './groups/Groups';

const AdminPage = () => {
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();

    const [games, setGames] = useState(Array<TypeGame>());
    const [providers, setProviders] = useState(Array<TypeProvider>());
    const [groups, setGroups] = useState(Array<TypeGroup>());

    useEffect(() => {
        getAllGames().then((games) => {
            setGames(games);
        });
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>
                <Groups groups={groups} />
            </div>
        </>
    );
};

export default AdminPage;
