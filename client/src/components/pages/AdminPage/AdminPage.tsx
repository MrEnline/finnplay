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
        console.log('useEffect');
    }, []);

    const resultLoadGroups = games.length > 0 && groups.length > 0 ? <Groups games={games} groups={groups} /> : <div>ЗАГРУЗКА ДАННЫХ</div>;

    return (
        <>
            <AppHeader />
            <div className={styles.app__blocks}>{resultLoadGroups}</div>
            <div className={styles.popupdelete}>
                <div className={styles.popupdelete__body}>
                    <div className={styles.popupdelete__content}>
                        <div className={styles.popupdelete__title}>Group delete</div>
                        <div className={styles.popupdelete__text}>
                            Do you want to delete Slots group? <br />
                            If you want to move 63 games, select new group below.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
