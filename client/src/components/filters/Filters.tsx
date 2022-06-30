import { useState, useEffect } from "react";
import useJSONService from "../../services/JSONService";
import styles from "./Filters.module.css";
import IconSearch from "../../assets/img/icon-search.svg";

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
    const [search, setSearch] = useState("");
    const { getAllProviders, getAllGroups } = useJSONService();
    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);

    useEffect(() => {
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setProviders(providers));
    });

    const createListProviders = (arr: Array<TypeProvider>) => {
        return arr.map((item) => {
            return <div className={styles.filters__item}>{item.name}</div>;
        });
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
            <div className={styles.filters__providers}>
                <div className={styles.filters__title}>Providers</div>
                <div className={styles.filters__list}>{listProviders}</div>
            </div>
            <div className={styles.filters__groups}></div>
            <div className={styles.filters__sorting}></div>
            <div className={styles.filters__columns}></div>
            <div className={styles.filters__control}></div>
        </div>
    );
};

export default Filters;
