import React, { useEffect, useContext } from 'react';
import { Context } from '.';
import './App.css';
import Login from './components/login/Login';
import { observer } from 'mobx-react-lite';
import PlayerPage from './components/pages/PlayerPage/PlayerPage';
import AdminPage from './components/pages/AdminPage/AdminPage';

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
        //console.log('useEffect');
    }, []);

    if (store.isAuth && store.adminRole) {
        return (
            <div className="App">
                <AdminPage />
            </div>
        );
    }

    if (store.isAuth && !store.adminRole) {
        return (
            <div className="App">
                <PlayerPage />
            </div>
        );
    }

    return (
        <div className="App">
            <Login />
        </div>
    );
}

export default observer(App);
