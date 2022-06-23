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

    // if (!store.isAuth) {
    //     <Login />;
    // }

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
