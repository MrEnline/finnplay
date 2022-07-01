import { useState, useEffect } from 'react';
import useJSONService from '../../services/JSONService';
import styles from './Filters.module.css';
import IconSearch from '../../assets/img/icon-search.svg';

interface TypeProvider {
    id: number;
    name: string;
    logo: string;
}

interface TypeGroup {
    id: number;
    name: string;
    games: [];
}

const Filters = () => {
    const [search, setSearch] = useState('');
    const { getAllProviders, getAllGroups } = useJSONService();
    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);

    useEffect(() => {
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const createListProviders = (arr: Array<TypeProvider>) => {
        return arr.map((item) => {
            return <div className={styles.filters__item}>{item.name}</div>;
        });
        // const newArrItems =  arr.map((item) => {
        //     return (
        //         <div className={styles.filters__item}>{item.name}</div>
        //     );
        // });
        // const countElementInFlex = 3
        // let countFlexBox = newArrItems.length / countElementInFlex;
        // const listProviders = [];
        // while (countFlexBox > 0) {
        //     let
        //     countFlexBox--;
        // }
    };

    const listProviders = createListProviders(providers);

    const createListGroups = (arr: Array<TypeGroup>) => {
        return arr.map((item) => {
            return <div className={styles.filters__item}>{item.name}</div>;
        });
    };

    const listGroups = createListGroups(groups);

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
            <div className={styles.filters__providersblock}>
                <div className={styles.filters__title}>Providers</div>
                <div className={styles.filters__providers}>{listProviders}</div>
            </div>
            <div className={styles.filters__gamegroupblock}>
                <div className={styles.filters__title}>Game groups</div>
                <div className={styles.filters__gamegroup}>{listGroups}</div>
            </div>
            <div className={styles.filters__sorting}></div>
            <div className={styles.filters__columns}></div>
            <div className={styles.filters__control}></div>
        </div>
    );
};

export default Filters;
