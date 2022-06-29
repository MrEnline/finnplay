import { useContext } from 'react';
import { Context } from '../../index';
import styles from './AppHeader.module.css';
import Logo from '../../assets/img/finnplay-logo.svg';
import Logout from '../../assets/img/logout.svg';
import IconUser from '../../assets/img/icon-user.svg';

const AppHeader = () => {
    const { store } = useContext(Context);

    return (
        <header className={styles.app__header}>
            <img src={Logo} alt="download" className={styles.app__logo} />
            <div className={styles.logoutblock} onClick={() => store.logout()}>
                <img
                    src={IconUser}
                    alt="iconuser"
                    className={styles.logoutblock__iconuser}
                />
                <img
                    src={Logout}
                    alt="logout"
                    className={styles.logoutblock__logout}
                />
            </div>
        </header>
    );
};

export default AppHeader;
