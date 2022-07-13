import React, { FC, useState } from 'react';
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

interface TypeProp {
    games: Array<TypeGame>;
    filtersGames: Array<TypeGame>;
    setFiltersGames: (games: Array<TypeGame>) => void;
    providers: Array<TypeProvider>;
    groups: Array<TypeGroup>;
}

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

const dataSorting = [
    { id: 1, name: 'A-Z' },
    { id: 2, name: 'Z-A' },
    { id: 3, name: 'Newest' },
];

const Filters: FC<TypeProp> = ({ games, filtersGames, setFiltersGames, providers, groups }) => {
    const [search, setSearch] = useState('');
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [sorting, setSorting] = useState<TypeFilter>({});

    const [boxColor23, setBoxColor23] = useState<boolean>(true);
    const [boxColor34, setBoxColor34] = useState<boolean>(true);

    const onSetValuesFilter = (id: number, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => {
        const newFilter = { ...currFilter };
        if (newFilter[id]) {
            delete newFilter[id];
        } else {
            newFilter[id] = true;
        }
        setFilter(newFilter);
        return newFilter;
        //setFilter({ ...currFilter, [name]: !currFilter[name] });
    };

    const onSetValuesSorting = (id: number, currFilter: TypeFilter, setSorting: (filter: TypeFilter) => void) => {
        if (currFilter[id]) {
            setSorting({});
            return {};
        }
        setSorting({ [id]: true });
        return { ...currFilter, [id]: true };
    };

    const createListElements = (
        arr: Array<TypeData | TypeProvider | TypeGroup>,
        countElementInFlex: number,
        currFilter: TypeFilter,
        setNewValues: (filter: TypeFilter) => void,
        onSetValues: (id: number, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => void
    ) => {
        const divItemsArr = arr.map((item) => {
            return (
                <div
                    onClick={() => onSetValues(item.id, currFilter, setNewValues)}
                    className={classNames(styles.filters__item, {
                        [styles.filters__item_color]: currFilter[item.id],
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

    const handleChangeStateBoxColor = (isBox23: boolean, isBox34: boolean) => {
        setBoxColor23(isBox23);
        setBoxColor34(isBox34);
    };

    const onChangeColorBox = (numCol: number) => {
        switch (numCol) {
            case 2:
                handleChangeStateBoxColor(false, false);
                break;
            case 3:
                handleChangeStateBoxColor(true, false);
                break;
            case 4:
                handleChangeStateBoxColor(true, true);
                break;
        }
    };

    const onResetAllFilters = () => {
        setFilterProviders({});
        setFilterGroups({});
        setSorting({});
        handleChangeStateBoxColor(true, true);
    };

    const handleSearch = (search: string) => {
        if (search.length === 0) return;
        //фильтрация по названию игры
        let newArrGames = games.filter((item) => {
            return item.name.toLowerCase().indexOf(search) > -1;
        });
        //if (newArrGames.length > 0) return newArrGames;
        //поиск по имени провайдера
        const arrProvidersGames = providers.filter((item) => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
        if (arrProvidersGames.length > 0) {
            for (let provider of arrProvidersGames) {
                newArrGames = [...newArrGames, ...games.filter((game) => provider.id === game.provider)];
            }
            //if (newArrGames.length > 0) return newArrGames;
        }
        //поиск по названию группы
        const arrGroupGames = groups.filter((item) => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
        if (arrGroupGames.length > 0) {
            let idArrGames = Array<number>();
            for (let group of arrGroupGames) {
                idArrGames = [...idArrGames, ...group.games];
            }
            for (let id of idArrGames) {
                newArrGames = [...newArrGames, ...games.filter((item) => item.id === +id)];
            }
        }
        return newArrGames;
    };

    const handleFilterProviders = (id: number, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => {
        const arrProviders = Object.keys(onSetValuesFilter(id, currFilter, setFilter));
        //if (arrProviders.length === 0) return [];
        //const currArrForFilter = filtersGames.length ? filtersGames : games;
        let newArrProvidersGames = Array<TypeGame>();

        for (let i = 0; i < arrProviders.length; i++) {
            newArrProvidersGames = [...newArrProvidersGames, ...games.filter((game) => game.provider === +arrProviders[i])];
        }
        setFiltersGames(newArrProvidersGames);
    };

    const handleFilterGroup = (id: number, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => {
        //const arrGroups = Object.keys(filterGroups);
        const arrGroups = Object.keys(onSetValuesFilter(id, currFilter, setFilter));
        //if (arrGroups.length === 0) return [];
        const currArrForFilter = filtersGames.length ? filtersGames : games;
        let newArrGroupsGames = Array<TypeGame>();

        for (let i = 0; i < arrGroups.length; i++) {
            const groupGames = groups.find((item) => item.id === +arrGroups[i]);
            if (groupGames) {
                for (let j = 0; j < groupGames.games.length; j++) {
                    newArrGroupsGames = [...newArrGroupsGames, ...games.filter((game) => game.id === groupGames.games[j])];
                }
            }
        }
        setFiltersGames(newArrGroupsGames);
    };

    const handleSorting = (id: number, currFilter: TypeFilter, setFilter: (filter: TypeFilter) => void) => {
        const idSort = +Object.keys(onSetValuesSorting(id, currFilter, setSorting))?.[0];
        if (!idSort) return filtersGames;
        const currArrForSorting = filtersGames.length ? filtersGames : games;
        const newArrGames = Array<TypeGame>();
        switch (idSort) {
            case 1:
                newArrGames.splice(
                    -1,
                    0,
                    ...currArrForSorting.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    })
                );
                break;
            case 2:
                newArrGames.splice(
                    -1,
                    0,
                    ...currArrForSorting.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return 1;
                        }
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return -1;
                        }
                        return 0;
                    })
                );
                break;
            case 3:
                newArrGames.splice(
                    -1,
                    0,
                    ...currArrForSorting.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        if (dateB > dateA) {
                            return 1;
                        }
                        if (dateB < dateA) {
                            return -1;
                        }
                        return 0;
                    })
                );
                break;
        }
        setFiltersGames(newArrGames);
    };

    const listProviders = createListElements(
        providers,
        NUMBER_ELEMENT_PROVIDERS_FLEX,
        filterProviders,
        setFilterProviders,
        handleFilterProviders
    );

    const listGroups = createListElements(groups, NUMBER_ELEMENT_GROUPS_FLEX, filterGroups, setFilterGroups, handleFilterGroup);

    const listSorting = createListElements(dataSorting, dataSorting.length, sorting, setSorting, handleSorting);

    return (
        <div className={styles.app__filters}>
            <div className={styles.filters__search}>
                <input
                    type="text"
                    name="search"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => handleSearch(e.target.value)}
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
                        <input id="radio-2" type="radio" name="radio" value="2" />
                        <label
                            htmlFor="radio-2"
                            className={classNames(
                                styles.filters__label,
                                { [styles.filters__radio_color]: boxColor23 },
                                { [styles.filters__radio_color]: boxColor34 }
                            )}
                            onClick={() => onChangeColorBox(2)}
                        >
                            <span>2</span>
                        </label>
                    </div>
                    <div
                        className={classNames(styles.filters__box, styles.filters__box23, {
                            [styles.filters__box_color]: boxColor23,
                        })}
                    ></div>
                    <div className={classNames(styles.filters__radio3, styles.filters__radio)}>
                        <input id="radio-3" type="radio" name="radio" value="3" />
                        <label
                            htmlFor="radio-3"
                            className={classNames(styles.filters__label, { [styles.filters__radio_color]: boxColor34 })}
                            onClick={() => onChangeColorBox(3)}
                        >
                            <span>3</span>
                        </label>
                    </div>
                    <div
                        className={classNames(styles.filters__box, styles.filters__box34, {
                            [styles.filters__box_color]: boxColor34,
                        })}
                    ></div>
                    <div className={classNames(styles.filters__radio4, styles.filters__radio)}>
                        <input id="radio-4" type="radio" name="radio" value="4" />
                        <label
                            htmlFor="radio-4"
                            className={classNames(styles.filters__label, { [styles.filters__radio_color]: boxColor34 })}
                            onClick={() => onChangeColorBox(4)}
                        >
                            <span>4</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className={styles.filters__control}>
                <div className={styles.filters__title}>Games amount: {100}</div>
                <div className={classNames(styles.filters__button, styles.filters__button_reset)} onClick={onResetAllFilters}>
                    <div className={styles.filters__buttontext}>Reset</div>
                </div>
            </div>
        </div>
    );
};

export default Filters;
