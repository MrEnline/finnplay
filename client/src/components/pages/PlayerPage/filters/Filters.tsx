import React, { FC, useRef, useState, useMemo, useEffect } from "react";
import styles from "./Filters.module.css";
import classNames from "classnames";
import IconSearch from "../../../../assets/img/icon-search.svg";
import { NUMBER_ELEMENT_PROVIDERS_FLEX, NUMBER_ELEMENT_GROUPS_FLEX, INIT_COLUMNS_COUNTER } from "../../../../utils/Constants";
import { TypeData, TypeGame, TypeProvider, TypeGroup, TypeFilter } from "../../../../utils/Interfaces";
import { NumberColumns } from "../../../../utils/Enums";

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
    { id: 1, name: "A-Z" },
    { id: 2, name: "Z-A" },
    { id: 3, name: "Newest" },
];

const Filters: FC<TypeProp> = ({ games, filtersGames, handleFiltersGames, providers, groups, columnsCounter, handleColumnsCounter }) => {
    const [search, setSearch] = useState("");
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [sorting, setSorting] = useState<TypeFilter>({});

    const refRadio = useRef(null);

    const mapGamesInGroup = useMemo(() => {
        return groups.reduce((result, group) => {
            result.set(group.id, group.games);
            return result;
        }, new Map<number, Array<number>>());
    }, [groups]);

    const mapGames = useMemo(() => {
        return games.reduce((result, game) => {
            result.set(game.id, game);
            return result;
        }, new Map<number, TypeGame>());
    }, [games]);

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
            case NumberColumns.Two:
                handleColumnsCounter(NumberColumns.Two);
                break;
            case NumberColumns.Three:
                handleColumnsCounter(NumberColumns.Three);
                break;
            case NumberColumns.Four:
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
        //setFilter({ ...currFilter, [name]: !currFilter[name] });
        newFilter[id] ? delete newFilter[id] : (newFilter[id] = true);
        return newFilter;
    };

    const onSetValuesSorting = (id: number, currFilter: TypeFilter) => {
        return currFilter[id] ? {} : { [id]: true };
    };

    const handleSearch = (currSearch: string) => {
        setSearch(currSearch);
        const newArrSearchGames = getNewArrSearchGame(currSearch);
        if (currSearch && newArrSearchGames.length === 0) {
            handleFiltersGames(Array<TypeGame>());
            return;
        }
        setFilterGames(newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
    };

    const getFilterArr = (arr: Array<TypeGame | TypeGroup | TypeProvider>, strSearch: string) => {
        return arr.filter((item) => {
            return item.name.toLowerCase().indexOf(strSearch.toLowerCase()) > -1;
        });
    };

    const getNewArrSearchGame = (currSearch: string) => {
        if (currSearch === "") return [];
        //поиск по названию игры
        const newArrGames = getFilterArr(games, currSearch) as Array<TypeGame>;
        //поиск по имени провайдера
        const arrProvidersGames = getFilterArr(providers, currSearch);
        if (arrProvidersGames.length > 0) {
            newArrGames.push(
                ...arrProvidersGames.reduce((result, provider) => {
                    result = [...result, ...games.filter((game) => provider.id === game.provider)];
                    return result;
                }, Array<TypeGame>()),
            );
        }
        //поиск по названию группы
        const arrGroupGames = getFilterArr(groups, currSearch);
        if (arrGroupGames.length > 0) {
            const idArrGames = arrGroupGames.reduce((result, group) => {
                result = [...result, ...(group as TypeGroup).games];
                return result;
            }, Array<number>());
            newArrGames.push(
                ...idArrGames.reduce((result, id) => {
                    result = [...result, ...games.filter((game) => game.id === id)];
                    return result;
                }, Array<TypeGame>()),
            );
        }
        return Array.from(new Set(newArrGames).values()); //получим только уникальные объекты
    };

    const getNewArrProvidersGames = (arrProviders: Array<string>) => {
        return arrProviders.reduce((result, provider) => {
            result = [...result, ...games.filter((game) => game.provider === +provider)];
            return result;
        }, Array<TypeGame>());
    };

    const getNewArrGroupsGames = (arrGroups: Array<string>) => {
        return arrGroups
            .reduce((result, id) => {
                result = [...result, ...mapGamesInGroup.get(+id)!!];
                return result;
            }, Array<number>())
            .reduce((result, id) => {
                result = [...result, mapGames.get(id)!!];
                return result;
            }, Array<TypeGame>());
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

    const getSortGames = (resultArrGames: Array<TypeGame>) => {
        if (Object.keys(sorting).length > 0) {
            return getNewArrSort(+Object.keys(sorting), resultArrGames);
        }
        return resultArrGames;
    };

    const checkFilters = (filterProviders: TypeFilter, filterGroups: TypeFilter) => {
        return (
            Object.keys(filterProviders).length === 0 && Object.keys(filterGroups).length === 0 && Object.keys(sorting).length === 0 && search === ""
        );
    };

    const getCountLengthArrays = (...array: Array<Array<TypeData>>) => {
        return array.filter((currArr) => currArr.length > 0).length;
    };

    const getCommonGames = (array: Array<TypeGame>, countArrays: number) => {
        let filterGames = Array<TypeGame>();
        let index = 0;
        while (index < countArrays - 1) {
            filterGames =
                index === 0
                    ? array.filter((game, index, arr) => arr.indexOf(game) !== index)
                    : filterGames.filter((game, index, arr) => arr.indexOf(game) !== index);
            index++;
        }
        return filterGames;
    };

    const newArrSearchGames = useMemo(() => {
        return getNewArrSearchGame(search);
    }, [search]);

    const newArrGroupsGames = useMemo(() => {
        return Array.from(new Set(getNewArrGroupsGames(Object.keys(filterGroups))));
    }, [filterGroups]);

    const newArrProvidersGames = useMemo(() => {
        return Array.from(new Set(getNewArrProvidersGames(Object.keys(filterProviders))));
    }, [filterProviders]);

    const setFilterGames = (...arrGames: Array<Array<TypeGame>>) => {
        const allSearchGames = [...arrGames[0], ...arrGames[1], ...arrGames[2]];
        const filterGames = Array<TypeGame>();
        const countLengthArrays = getCountLengthArrays(arrGames[0], arrGames[1], arrGames[2]);
        countLengthArrays > 1
            ? filterGames.push(...getCommonGames(allSearchGames, countLengthArrays))
            : filterGames.push(...Array.from(new Set(allSearchGames)));
        handleFiltersGames(getSortGames(countLengthArrays === 0 ? [...games] : filterGames));
    };

    const handleFilterProviders = (id: number) => {
        const newFilterProviders = onSetValuesFilter(id, filterProviders);
        setFilterProviders(newFilterProviders);
        const arrProviders = Object.keys(newFilterProviders);

        if (checkFilters(newFilterProviders, filterGroups)) {
            handleFiltersGames(games);
            return;
        }

        const newArrProvidersGames = Array.from(new Set(getNewArrProvidersGames(arrProviders)));
        setFilterGames(newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
    };

    const handleFilterGroup = (id: number) => {
        const newFilterGroups = onSetValuesFilter(id, filterGroups);
        setFilterGroups(newFilterGroups);
        const arrGroups = Object.keys(newFilterGroups);

        if (checkFilters(filterProviders, newFilterGroups)) {
            handleFiltersGames(games);
            return;
        }

        const newArrGroupsGames = Array.from(new Set(getNewArrGroupsGames(arrGroups)));
        setFilterGames(newArrSearchGames, newArrProvidersGames, newArrGroupsGames);
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
            <div>Test</div>
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
