import React, { useState, useEffect, FC } from 'react';
import useJSONService from '../../services/JSONService';
import styles from './Filters.module.css';
import classNames from 'classnames';
import IconSearch from '../../assets/img/icon-search.svg';
import { NUMBER_ELEMENT_PROVIDERS_FLEX, NUMBER_ELEMENT_GROUPS_FLEX } from '../../utils/Constants';

interface TypeData {
    id: number;
    name: string;
}

interface TypeProvider extends TypeData {
    logo: string;
}

interface TypeGroup extends TypeData {
    games: [];
}

interface TypeFilter {
    [index: string]: boolean;
}

const dataSorting = [
    { id: 1, name: 'A-Z' },
    { id: 2, name: 'Z-A' },
    { id: 3, name: 'Newest' },
];

const changeValueFilter = (name: string, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => {
    const newFilter = { ...currFilter };
    newFilter[name] = !newFilter[name];
    setFilter(newFilter);
};

const createListElements = (
    arr: Array<TypeData | TypeProvider | TypeGroup>,
    countElementInFlex: number,
    currFilter: TypeFilter,
    setFilter: (filter: TypeFilter) => void
) => {
    const divItemsArr = arr.map((item) => {
        return (
            <div
                onClick={() => changeValueFilter(item.name, currFilter, setFilter)}
                className={classNames(styles.filters__item, {
                    [styles.filters__item_color]: currFilter[item.name],
                })}
            >
                {item.name}
            </div>
        );
    });

    const divGroupItemsArr = [];
    for (let index = 0; index < divItemsArr.length; index += countElementInFlex) {
        divGroupItemsArr.push(divItemsArr.slice(index, index + countElementInFlex));
    }

    return divGroupItemsArr.map((item) => {
        return <div className={classNames(styles.filters__items)}>{item}</div>;
    });
};

const Filters: FC = () => {
    const [search, setSearch] = useState('');
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();
    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [filterSorting, setFilterSorting] = useState<TypeFilter>({});

    useEffect(() => {
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const listProviders = createListElements(providers, NUMBER_ELEMENT_PROVIDERS_FLEX, filterProviders, setFilterProviders);

    const listGroups = createListElements(groups, NUMBER_ELEMENT_GROUPS_FLEX, filterGroups, setFilterGroups);

    const listSorting = createListElements(dataSorting, dataSorting.length, filterSorting, setFilterSorting);

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
                {listProviders}
            </div>
            <div className={styles.filters__gamegroup}>
                <div className={styles.filters__title}>Game groups</div>
                {listGroups}
            </div>
            <div className={styles.filters__sorting}>
                <div className={styles.filters__title}>Sorting</div>
                {listSorting}
            </div>
            <div className={styles.filters__columns}>
                <div className={styles.filters__title}>Columns</div>
                <div className={styles.filters__switch}>
                    <div className={classNames(styles.filters__radio2, styles.filters__radio)}>
                        <input id="radio-2" type="radio" name="radio-2" value="2" />
                        <label htmlFor="radio-2">
                            <span>2</span>
                        </label>
                    </div>
                    <div className={classNames(styles.filters__box, styles.filters__box23)}></div>
                    <div className={classNames(styles.filters__radio3, styles.filters__radio)}>
                        <input id="radio-3" type="radio" name="radio-3" value="3" />
                        <label htmlFor="radio-3">
                            <span>3</span>
                        </label>
                    </div>
                    <div className={classNames(styles.filters__box, styles.filters__box34)}></div>
                    <div className={classNames(styles.filters__radio4, styles.filters__radio)}>
                        <input id="radio-4" type="radio" name="radio-4" value="4" />
                        <label htmlFor="radio-4">
                            <span>4</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className={styles.filters__control}>
                <div className={styles.filters__title}>Games amount: {100}</div>
                <div
                    className={classNames(styles.filters__button, styles.filters__button_reset)}
                    onClick={() => console.log('test')}
                >
                    <div className={styles.filters__buttontext}>Reset</div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
