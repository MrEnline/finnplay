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
            <div className={styles.app__test} onClick={() => store.logout()}>
                <img
                    src={IconUser}
                    alt="iconuser"
                    className={styles.app__iconuser}
                />
                <img src={Logout} alt="logout" className={styles.app__logout} />
            </div>
        </header>
    );
};

export default AppHeader;
