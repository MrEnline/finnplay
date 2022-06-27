import React, { useEffect, useContext } from 'react';
import { Context } from '.';
import './App.css';
import Login from './components/login/Login';
import { observer } from 'mobx-react-lite';
import AppHeader from './components/appHeader/AppHeader';

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
        console.log('useEffect');
    }, []);

    if (store.isAuth && store.adminRole) {
        return (
            <div>
                <div>Admin panel</div>
                <button onClick={() => store.logout()}>Logout</button>
            </div>
        );
    }

    if (store.isAuth && !store.adminRole) {
        return <AppHeader />;
    }

    return (
        <div className="App">
            <Login />
        </div>
    );
}

export default observer(App);
