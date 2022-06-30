import { useState, useEffect } from 'react';
import useJSONService from '../../services/JSONService';
import styles from './Filters.module.css';
import IconSearch from '../../assets/img/icon-search.svg';

interface TypeProvider {
    id: number;
    name: string;
    logo: string;
}

const Filters = () => {
    const [search, setSearch] = useState('');
    const { getAllProviders } = useJSONService();
    const [providers, setProviders] = useState(Array<TypeProvider>);

    useEffect(() => {
        getAllProviders().then((providers) => setProviders(providers));
    });

    return (
        <div className={styles.app__filters}>
            <div className={styles.filters__search}>
                <input
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    required
                />
                <img src={IconSearch} alt="search" />
            </div>
            <div className={styles.filters__providers}>
                <div>Providers</div>
                <div>{}</div>
            </div>
            <div className={styles.filters__groups}></div>
            <div className={styles.filters__sorting}></div>
            <div className={styles.filters__columns}></div>
            <div className={styles.filters__control}></div>
        </div>
    );
};

export default Filters;
