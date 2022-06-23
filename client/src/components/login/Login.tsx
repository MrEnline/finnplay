import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import Logo from '../assets/img/finnplay-logo.svg';
import VisiblePassword from '../assets/img/visible-password.svg';
import Spinner from '../assets/img/spinner.svg';
import { Context } from '../../index';
import { ADMIN, PLAYER } from '../../utils/Constants';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [visibleSpinner, setVisibleSpinner] = useState<boolean>(false);
    const { store } = useContext(Context);

    function showHidePassword() {
        const input = document.querySelector('.password-input');
        if (!input) return;
        if (input.getAttribute('type') === 'password') {
            input.setAttribute('type', 'text');
        } else {
            input.setAttribute('type', 'password');
        }
    }

    function runAuth() {
        setVisibleSpinner(!visibleSpinner);
        store.login(username, password);
        if (localStorage.getItem(username)) {
            setUsername(username);
            setPassword(password);
        } else {
            setUsername('');
            setPassword('');
        }
    }

    return (
        <div className={styles.login}>
            <div className={styles.loginform}>
                <img
                    className={styles.loginform__logo}
                    src={Logo}
                    alt="finnplay-logo"
                />
                <div className={styles.inputs__textfield}>
                    <div className={styles.textfield_content}>
                        <input
                            type="text"
                            name="login"
                            id="login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="login">Login</label>
                    </div>
                </div>
                <div className={styles.inputs__textfield}>
                    <div className={styles.textfield_content}>
                        <input
                            className="password-input"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <img
                        src={VisiblePassword}
                        alt="visible-password"
                        onClick={showHidePassword}
                    />
                </div>
                <button className={styles.loginform__button} onClick={runAuth}>
                    {visibleSpinner ? (
                        <img
                            src={Spinner}
                            alt="download"
                            className={styles.loginform__spinner_loading}
                        />
                    ) : (
                        'Login'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;
