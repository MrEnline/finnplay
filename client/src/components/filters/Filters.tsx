import React, { FC, useState } from "react";
import styles from "./Filters.module.css";
import classNames from "classnames";
import IconSearch from "../../assets/img/icon-search.svg";
import { NUMBER_ELEMENT_PROVIDERS_FLEX, NUMBER_ELEMENT_GROUPS_FLEX } from "../../utils/Constants";

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
    { id: 1, name: "A-Z" },
    { id: 2, name: "Z-A" },
    { id: 3, name: "Newest" },
];

const Filters: FC<TypeProp> = ({ games, filtersGames, setFiltersGames, providers, groups }) => {
    const [search, setSearch] = useState("");
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [sorting, setSorting] = useState<TypeFilter>({});

    const [boxColor23, setBoxColor23] = useState<boolean>(true);
    const [boxColor34, setBoxColor34] = useState<boolean>(true);

    const createListElements = (
        arr: Array<TypeData | TypeProvider | TypeGroup>,
        countElementInFlex: number,
        currFilter: TypeFilter,
        onSetValues: (id: number) => void,
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
        setFiltersGames(games);
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
        if (currSearch.length === 0) return;

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
        setFiltersGames(newArrGames);
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

    // const test = () => {
    //     const resultArrGames = Array<TypeGame>();
    //     if (newArrProvidersGames.length > 0 && newArrGroupsGames.length > 0) {
    //         resultArrGames.splice(-1, 0, ...newArrProvidersGames.filter((item) => newArrGroupsGames.includes(item)));
    //     } else if (newArrProvidersGames.length > 0) {
    //         resultArrGames.splice(-1, 0, ...newArrProvidersGames);
    //     } else if (newArrGroupsGames.length > 0) {
    //         resultArrGames.splice(-1, 0, ...newArrGroupsGames);
    //     }
    //     return resultArrGames;
    // }

    const CommonFilter = () => {};

    const handleFilterProviders = (id: number) => {
        //const arrProviders = Object.keys(filterProviders);
        const newFilterProviders = onSetValuesFilter(id, filterProviders);
        setFilterProviders(newFilterProviders);
        const arrProviders = Object.keys(newFilterProviders);

        if (arrProviders.length === 0 && Object.keys(filterGroups).length === 0 && Object.keys(sorting).length === 0 && search === "") {
            setFiltersGames(games);
            return;
        }

        // if (arrProviders.length === 0 && filtersGames.length > 0) {
        //     const filterArrProvidersGames = filtersGames.filter((item) => item.provider !== id);
        //     setFiltersGames(filterArrProvidersGames);
        //     return;
        // }

        //const idGames = groups.flatMap((item) => item.games);
        const newArrProvidersGames = getNewArrProvidersGames(arrProviders);
        const newArrGroupsGames = getNewArrGroupsGames(Object.keys(filterGroups));

        const resultArrGames = Array<TypeGame>();
        if (newArrProvidersGames.length > 0 && newArrGroupsGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrProvidersGames.filter((item) => newArrGroupsGames.includes(item)));
        } else if (newArrProvidersGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrProvidersGames);
        } else if (newArrGroupsGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrGroupsGames);
        }
        if (search.length > 0) {
        }
        if (Object.keys(sorting).length > 0) {
            const arrForSorting = resultArrGames.length > 0 ? resultArrGames : games;
            setFiltersGames(getNewArrSort(+Object.keys(sorting), arrForSorting));
            return;
        }
        setFiltersGames(resultArrGames);
    };

    const handleFilterGroup = (id: number) => {
        const newFilterGroups = onSetValuesFilter(id, filterGroups);
        setFilterGroups(newFilterGroups);
        const arrGroups = Object.keys(newFilterGroups);

        if (arrGroups.length === 0 && Object.keys(filterProviders).length === 0 && Object.keys(sorting).length === 0 && search === "") {
            setFiltersGames(games);
            return;
        }

        // if (arrGroups.length === 0 && filtersGames.length > 0) {
        //     const filterArrGroupsGames = filtersGames.filter((item) => item.provider !== id);
        //     setFiltersGames(filterArrGroupsGames);
        //     return;
        // }

        const newArrProvidersGames = getNewArrProvidersGames(Object.keys(filterProviders));
        const newArrGroupsGames = getNewArrGroupsGames(arrGroups);

        const resultArrGames = Array<TypeGame>();
        if (newArrProvidersGames.length > 0 && newArrGroupsGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrProvidersGames.filter((item) => newArrGroupsGames.includes(item)));
        } else if (newArrProvidersGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrProvidersGames);
        } else if (newArrGroupsGames.length > 0) {
            resultArrGames.splice(-1, 0, ...newArrGroupsGames);
        }
        if (Object.keys(sorting).length > 0) {
            const arrForSorting = resultArrGames.length > 0 ? resultArrGames : games;
            setFiltersGames(getNewArrSort(+Object.keys(sorting), arrForSorting));
            return;
        }
        setFiltersGames(resultArrGames);
    };

    const handleSorting = (id: number) => {
        const newSorting = onSetValuesSorting(id, sorting);
        setSorting(newSorting);
        if (Object.keys(newSorting).length === 0) {
            return;
        }
        const currArrForSorting = filtersGames.length > 0 ? [...filtersGames] : [...games];
        setFiltersGames(getNewArrSort(id, currArrForSorting));
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
                        <input id="radio-2" type="radio" name="radio" value="2" />
                        <label
                            htmlFor="radio-2"
                            className={classNames(
                                styles.filters__label,
                                { [styles.filters__radio_color]: boxColor23 },
                                { [styles.filters__radio_color]: boxColor34 },
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
