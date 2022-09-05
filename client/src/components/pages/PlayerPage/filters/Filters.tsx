import React, { FC, useRef, useState } from 'react';
import styles from './Filters.module.css';
import classNames from 'classnames';
import IconSearch from '../../../../assets/img/icon-search.svg';
import { NUMBER_ELEMENT_PROVIDERS_FLEX, NUMBER_ELEMENT_GROUPS_FLEX, INIT_COLUMNS_COUNTER } from '../../../../utils/Constants';
import { TypeData, TypeGame, TypeProvider, TypeGroup, TypeFilter } from '../../../../utils/Interfaces';
import { NumberColumns } from '../../../../utils/Enums';

interface TypeProp {
    games: Array<TypeGame>;
    filtersGames: Array<TypeGame>;
    handleFiltersGames: (games: Array<TypeGame>) => void;
    providers: Array<TypeProvider>;
    groups: Array<TypeGroup>;
    columnsCounter: number;
    handleColumnsCounter: (colunmns: number) => void;
}

const dataSorting = [
    { id: 1, name: 'A-Z' },
    { id: 2, name: 'Z-A' },
    { id: 3, name: 'Newest' },
];

const Filters: FC<TypeProp> = ({ games, filtersGames, handleFiltersGames, providers, groups, columnsCounter, handleColumnsCounter }) => {
    const [search, setSearch] = useState('');
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [sorting, setSorting] = useState<TypeFilter>({});

    const refRadio = useRef(null);

    console.log(`games - ${games.length}`);

    const createListElements = (
        arr: Array<TypeData | TypeProvider | TypeGroup>,
        countElementInFlex: number,
        currFilter: TypeFilter,
        onSetValues: (id: number) => void
    ) => {
        const divItemsArr = arr.map((item) => {
            return (
                <div
                    onClick={() => onSetValues(item.id)}
                    className={classNames(styles.filters__item, {
                        [styles.filters__item_color]: currFilter[item.id],
                    })}
                >
                    {item.name}
                </div>
            );
        });

        const divItemsArrRow = divItemsArr.reduce((result, game, index, arr) => {
            if (index % countElementInFlex === 0) {
                result.push(arr.slice(index, index + countElementInFlex));
            }
            return result;
        }, new Array<JSX.Element[]>());

        return divItemsArrRow.map((item) => {
            return <div className={classNames(styles.filters__items)}>{item}</div>;
        });
    };

    const onChangeColorBox = (numColumns: number) => {
        switch (numColumns) {
            case 2:
                handleColumnsCounter(NumberColumns.Two);
                break;
            case 3:
                handleColumnsCounter(NumberColumns.Three);
                break;
            case 4:
                handleColumnsCounter(NumberColumns.Four);
                break;
        }
    };

    const onResetAllFilters = () => {
        setFilterProviders({});
        setFilterGroups({});
        setSorting({});
        handleFiltersGames(games);
        handleColumnsCounter(INIT_COLUMNS_COUNTER);
        if (refRadio.current) (refRadio.current as HTMLInputElement).checked = true;
    };

    const onSetValuesFilter = (id: number, currFilter: TypeFilter) => {
        const newFilter = { ...currFilter };
        if (newFilter[id]) {
            delete newFilter[id];
        } else {
            newFilter[id] = true;
        }
        return newFilter;
        //setFilter({ ...currFilter, [name]: !currFilter[name] });
    };

    const onSetValuesSorting = (id: number, currFilter: TypeFilter) => {
        if (currFilter[id]) {
            return {};
        }
        return { [id]: true };
    };

    const handleSearch = (currSearch: string) => {
        setSearch(currSearch);
        const newArrSearchGames = getNewArrSearchGame(currSearch);
        const newArrProvidersGames = getNewArrProvidersGames(Object.keys(filterProviders));
        const newArrGroupsGames = getNewArrGroupsGames(Object.keys(filterGroups));

        const resultArrGames = getFilterGames(currSearch, newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
        const sortGames = getSortGames(currSearch.length === 0 && resultArrGames.length === 0 ? [...games] : resultArrGames);
        handleFiltersGames(sortGames);
        //setFiltersGames(sortGames.length === 0 && currSearch === "" ? games : sortGames);
    };

    const getNewArrSearchGame = (currSearch: string) => {
        if (currSearch === '') return [];
        //фильтрация по названию игры
        let newArrGames = games.filter((item) => {
            return item.name.toLowerCase().indexOf(currSearch) > -1;
        });
        //if (newArrGames.length > 0) return newArrGames;

        //поиск по имени провайдера
        const arrProvidersGames = providers.filter((item) => {
            return item.name.toLowerCase().indexOf(currSearch.toLowerCase()) > -1;
        });
        if (arrProvidersGames.length > 0) {
            for (let provider of arrProvidersGames) {
                newArrGames = [...newArrGames, ...games.filter((game) => provider.id === game.provider)];
                //newArrGames = games.filter((game) => provider.id === game.provider);
            }
            //return newArrGames;
        }

        //поиск по названию группы
        const arrGroupGames = groups.filter((item) => {
            return item.name.toLowerCase().indexOf(currSearch.toLowerCase()) > -1;
        });
        if (arrGroupGames.length > 0) {
            let idArrGames = Array<number>();
            for (let group of arrGroupGames) {
                idArrGames = [...idArrGames, ...group.games];
            }
            for (let id of idArrGames) {
                newArrGames = [...newArrGames, ...games.filter((item) => item.id === +id)];
                //newArrGames = [...games.filter((item) => item.id === +id)];
            }
        }
        return Array.from(new Set(newArrGames).values()); //получим только уникальные объекты
    };

    const getNewArrProvidersGames = (arrProviders: Array<string>) => {
        let newArrProvidersGames = Array<TypeGame>();
        for (let i = 0; i < arrProviders.length; i++) {
            newArrProvidersGames = [...newArrProvidersGames, ...games.filter((game) => game.provider === +arrProviders[i])];
        }
        return newArrProvidersGames;
    };

    const getNewArrGroupsGames = (arrGroups: Array<string>) => {
        let newArrGroupsGames = Array<TypeGame>();
        for (let i = 0; i < arrGroups.length; i++) {
            const groupGames = groups.find((item) => item.id === +arrGroups[i]);
            if (groupGames) {
                for (let j = 0; j < groupGames.games.length; j++) {
                    newArrGroupsGames = [...newArrGroupsGames, ...games.filter((game) => game.id === groupGames.games[j])];
                }
            }
        }
        return newArrGroupsGames;
    };

    const getNewArrSort = (id: number, currArrForSorting: Array<TypeGame>) => {
        switch (id) {
            case 1:
                currArrForSorting.sort((a, b) => {
                    return funcCompareGames(a, b, 1);
                });
                break;
            case 2:
                currArrForSorting.sort((a, b) => {
                    return funcCompareGames(a, b, -1);
                });
                break;
            case 3:
                currArrForSorting.sort((a, b) => {
                    return funcCompareDates(a, b);
                });
                break;
        }
        return currArrForSorting;
    };

    const funcCompareGames = (a: TypeGame, b: TypeGame, directSort: number) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -directSort;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return directSort;
        }
        return 0;
    };

    const funcCompareDates = (a: TypeGame, b: TypeGame) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateB > dateA) {
            return 1;
        }
        if (dateB < dateA) {
            return -1;
        }
        return 0;
    };

    const getCommonGames = (...arrs: Array<Array<TypeGame>>) => {
        let resultArrGames = Array<TypeGame>();
        let arrGames = arrs.shift();
        if (arrGames) {
            for (let item of arrGames) {
                if (inArrays(item, arrs)) {
                    resultArrGames.push(item);
                }
            }
        }
        return resultArrGames;
    };

    const inArrays = (elem: TypeGame, arrs: Array<Array<TypeGame>>) => {
        for (let arr of arrs) {
            if (!inArray(elem, arr)) {
                return false;
            }
        }
        return true;
    };

    const inArray = (elem: TypeGame, arr: Array<TypeGame>) => {
        return arr.indexOf(elem) !== -1;
    };

    const getFilterGames = (
        currSearch: string,
        newArrSearchGames: Array<TypeGame>,
        newArrProvidersGames: Array<TypeGame>,
        newArrGroupsGames: Array<TypeGame>
    ) => {
        let resultArrGames = Array<TypeGame>();
        if (currSearch.length > 0 && newArrProvidersGames.length > 0 && newArrGroupsGames.length > 0) {
            resultArrGames = getCommonGames(newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
        } else if (currSearch.length > 0 && newArrProvidersGames.length > 0) {
            resultArrGames = getCommonGames(newArrSearchGames, newArrProvidersGames);
        } else if (currSearch.length > 0 && newArrGroupsGames.length > 0) {
            resultArrGames = getCommonGames(newArrSearchGames, newArrGroupsGames);
        } else if (newArrProvidersGames.length > 0 && newArrGroupsGames.length > 0) {
            resultArrGames = getCommonGames(newArrProvidersGames, newArrProvidersGames);
        } else if (currSearch.length > 0) {
            resultArrGames = newArrSearchGames;
        } else if (newArrProvidersGames.length > 0) {
            resultArrGames = newArrProvidersGames;
        } else if (newArrGroupsGames.length > 0) {
            resultArrGames = newArrGroupsGames;
        }
        return resultArrGames;
    };

    const getSortGames = (resultArrGames: Array<TypeGame>) => {
        if (Object.keys(sorting).length > 0) {
            //const arrForSorting = resultArrGames.length > 0 ? resultArrGames : games;
            return getNewArrSort(+Object.keys(sorting), resultArrGames);
        }
        return resultArrGames;
    };

    const checkFilters = (filterProviders: TypeFilter, filterGroups: TypeFilter) => {
        return (
            Object.keys(filterProviders).length === 0 && Object.keys(filterGroups).length === 0 && Object.keys(sorting).length === 0 && search === ''
        );
    };

    const handleFilterProviders = (id: number) => {
        const newFilterProviders = onSetValuesFilter(id, filterProviders);
        setFilterProviders(newFilterProviders);
        const arrProviders = Object.keys(newFilterProviders);

        if (checkFilters(newFilterProviders, filterGroups)) {
            handleFiltersGames(games);
            return;
        }

        const newArrSearchGames = getNewArrSearchGame(search);
        const newArrProvidersGames = getNewArrProvidersGames(arrProviders);
        const newArrGroupsGames = getNewArrGroupsGames(Object.keys(filterGroups));

        const resultArrGames = getFilterGames(search, newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
        const sortGames = getSortGames(search.length === 0 && resultArrGames.length === 0 ? [...games] : resultArrGames);
        handleFiltersGames(sortGames);
    };

    const handleFilterGroup = (id: number) => {
        const newFilterGroups = onSetValuesFilter(id, filterGroups);
        setFilterGroups(newFilterGroups);
        const arrGroups = Object.keys(newFilterGroups);

        if (checkFilters(filterProviders, newFilterGroups)) {
            handleFiltersGames(games);
            return;
        }

        const newArrSearchGames = getNewArrSearchGame(search);
        const newArrProvidersGames = getNewArrProvidersGames(Object.keys(filterProviders));
        const newArrGroupsGames = getNewArrGroupsGames(arrGroups);

        const resultArrGames = getFilterGames(search, newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
        const sortGames = getSortGames(search.length === 0 && resultArrGames.length === 0 ? [...games] : resultArrGames);
        handleFiltersGames(sortGames);
    };

    const handleSorting = (id: number) => {
        const newSorting = onSetValuesSorting(id, sorting);
        setSorting(newSorting);
        if (Object.keys(newSorting).length === 0) return;
        handleFiltersGames(getNewArrSort(id, [...filtersGames]));
    };

    const listProviders = createListElements(providers, NUMBER_ELEMENT_PROVIDERS_FLEX, filterProviders, handleFilterProviders);
    const listGroups = createListElements(groups, NUMBER_ELEMENT_GROUPS_FLEX, filterGroups, handleFilterGroup);
    const listSorting = createListElements(dataSorting, dataSorting.length, sorting, handleSorting);

    return (
        <div className={styles.app__filters}>
            <div className={styles.filters__search}>
                <input type="text" name="search" value={search} placeholder="Search" onChange={(e) => handleSearch(e.target.value)} required />
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
                        <input ref={refRadio} id="radio-2" type="radio" name="radio" value="2" />
                        <label
                            htmlFor="radio-2"
                            className={classNames(styles.filters__label, { [styles.filters__radio_color]: columnsCounter })}
                            onClick={() => onChangeColorBox(NumberColumns.Two)}
                        >
                            <span>2</span>
                        </label>
                    </div>
                    <div
                        className={classNames(styles.filters__box, styles.filters__box23, {
                            [styles.filters__box_color]: columnsCounter > 2,
                        })}
                    ></div>
                    <div className={classNames(styles.filters__radio3, styles.filters__radio)}>
                        <input id="radio-3" type="radio" name="radio" value="3" />
                        <label
                            htmlFor="radio-3"
                            className={classNames(styles.filters__label, { [styles.filters__radio_color]: columnsCounter > 2 })}
                            onClick={() => onChangeColorBox(NumberColumns.Three)}
                        >
                            <span>3</span>
                        </label>
                    </div>
                    <div
                        className={classNames(styles.filters__box, styles.filters__box34, {
                            [styles.filters__box_color]: columnsCounter > 3,
                        })}
                    ></div>
                    <div className={classNames(styles.filters__radio4, styles.filters__radio)}>
                        <input id="radio-4" type="radio" name="radio" value="4" />
                        <label
                            htmlFor="radio-4"
                            className={classNames(styles.filters__label, { [styles.filters__radio_color]: columnsCounter > 3 })}
                            onClick={() => onChangeColorBox(NumberColumns.Four)}
                        >
                            <span>4</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className={styles.filters__control}>
                <div className={styles.filters__title}>Games amount: {filtersGames.length}</div>
                <div className={classNames(styles.filters__button, styles.filters__button_reset)} onClick={onResetAllFilters}>
                    <div className={styles.filters__buttontext}>Reset</div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
