import { useState, useEffect } from 'react';
import useJSONService from '../../services/JSONService';
import styles from './Filters.module.css';
import classNames from 'classnames';
import IconSearch from '../../assets/img/icon-search.svg';
import {
    NUMBER_ELEMENT_PROVIDERS_FLEX,
    NUMBER_ELEMENT_GROUPS_FLEX,
} from '../../utils/Constants';

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

const createListElements = (
    arr: Array<TypeProvider | TypeGroup>,
    countElementInFlex: number
) => {
    const divItemsArr = arr.map((item) => {
        return <div className={styles.filters__item}>{item.name}</div>;
    });

    const divGroupItemsArr = [];
    for (
        let index = 0;
        index < divItemsArr.length;
        index += countElementInFlex
    ) {
        divGroupItemsArr.push(
            divItemsArr.slice(index, index + countElementInFlex)
        );
    }

    return divGroupItemsArr.map((item) => {
        return (
            <div
                className={classNames(
                    styles.filters__items,
                    styles.filters__button_reset
                )}
            >
                {item}
            </div>
        );
    });
};

const Filters = () => {
    const [search, setSearch] = useState('');
    const { getAllProviders, getAllGroups } = useJSONService();
    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);

    useEffect(() => {
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    }, []);

    const listProviders = createListElements(
        providers,
        NUMBER_ELEMENT_PROVIDERS_FLEX
    );

    const listGroups = createListElements(groups, NUMBER_ELEMENT_GROUPS_FLEX);

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
                <div className={styles.filters__items}>
                    <div className={styles.filters__item}>A-Z</div>
                    <div className={styles.filters__item}>Z-A</div>
                    <div className={styles.filters__item}>Newest</div>
                </div>
            </div>
            <div className={styles.filters__columns}>
                <div className={styles.filters__title}>Columns</div>
                <div className={styles.filters__switch}>
                    <div
                        className={classNames(
                            styles.filters__radio2,
                            styles.filters__radio
                        )}
                    >
                        <input
                            id="radio-2"
                            type="radio"
                            name="radio"
                            value="2"
                        />
                        <label htmlFor="radio-2">
                            <span>2</span>
                        </label>
                    </div>
                    <div
                        className={classNames(
                            styles.filters__box,
                            styles.filters__box23
                        )}
                    ></div>
                    <div
                        className={classNames(
                            styles.filters__radio3,
                            styles.filters__radio
                        )}
                    >
                        <input
                            id="radio-3"
                            type="radio"
                            name="radio"
                            value="3"
                        />
                        <label htmlFor="radio-3">
                            <span>3</span>
                        </label>
                    </div>
                    <div
                        className={classNames(
                            styles.filters__box,
                            styles.filters__box34
                        )}
                    ></div>
                    <div
                        className={classNames(
                            styles.filters__radio4,
                            styles.filters__radio
                        )}
                    >
                        <input
                            id="radio-4"
                            type="radio"
                            name="radio"
                            value="4"
                        />
                        <label htmlFor="radio-4">
                            <span>4</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className={styles.filters__control}>
                <div className={styles.filters__title}>Games amount: {100}</div>
                <div
                    className={styles.filters__button}
                    onClick={() => console.log('test')}
                >
                    <div className={styles.filters__buttontext}>Reset</div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
