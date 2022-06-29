import { useEffect, useContext } from 'react';
import { Context } from '../../index';
import AppHeader from '../appHeader/AppHeader';
import useJSONService from '../../services/JSONService';

const PlayerPages = () => {
    const { store } = useContext(Context);
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();

    useEffect(() => {
        const test = getAllGames();
        //console.log(test);
    });

    return (
        <>
            <AppHeader />
        </>
    );
};

export default PlayerPages;
