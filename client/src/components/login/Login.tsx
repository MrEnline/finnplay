import React, { useContext, useState, useRef } from 'react';
import styles from './Login.module.css';
import Logo from '../../assets/img/finnplay-logo.svg';
import VisiblePassword from '../../assets/img/visible-password.svg';
import Spinner from '../../assets/img/spinner.svg';
import classNames from 'classnames';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { store } = useContext(Context);
    const refInput = useRef(null);

    const handleShowHidePassword = () => {
        if (refInput.current === null) return;
        const input = refInput.current as HTMLInputElement;
        input.getAttribute('type') === 'password' ? input.setAttribute('type', 'text') : input.setAttribute('type', 'password');
    };

    return (
        <div className={styles.login}>
            <div className={styles.loginform}>
                <img className={styles.loginform__logo} src={Logo} alt="finnplay-logo" />
                <div className={styles.inputfield}>
                    <div className={styles.inputfield__content}>
                        <input type="text" name="login" id="login" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <label htmlFor="login">Login</label>
                    </div>
                </div>
                <div className={styles.inputfield}>
                    <div className={styles.inputfield__content}>
                        <input
                            ref={refInput}
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
                    <img src={VisiblePassword} alt="visible-password" onClick={handleShowHidePassword} />
                </div>
                <div
                    className={classNames(
                        { [styles.loginform__error_hide]: !store.isWrongInputData },
                        { [styles.loginform__error]: store.isWrongInputData }
                    )}
                >
                    Wrong login or password
                </div>
                <button className={styles.loginform__button} onClick={() => store.login(username, password)}>
                    {store.isLoading ? <img src={Spinner} alt="download" className={styles.loginform__spinner_loading} /> : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default observer(Login);
