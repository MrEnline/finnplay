import React, { useEffect, useContext } from 'react';
import { Context } from '.';
import './App.css';
import Login from './components/login/Login';
import { observer } from 'mobx-react-lite';

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if (!store.isAuth) {
        return <Login />;
    }

    if (store.isAuth && store.adminRole) {
        return <div>Admin panel</div>;
    }

    if (store.isAuth && !store.adminRole) {
        return <div>Player panel</div>;
    }

    return (
        <div className="App">
            <h1>
                {store.isAuth ? 'Пользователь авторизован' : 'Авторизуйтесь'}
            </h1>
            <Login />
        </div>
    );
}

export default observer(App);
