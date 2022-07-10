import { useState, useEffect } from "react";
import useJSONService from "../../services/JSONService";
import AppHeader from "../appHeader/AppHeader";
import GamesList from "../gamesList/GamesList";
import Filters from "../filters/Filters";

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

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

const PlayerPages = () => {
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();
    const [games, setGames] = useState(Array<TypeGame>);
    const [providers, setProviders] = useState(Array<TypeProvider>);
    const [groups, setGroups] = useState(Array<TypeGroup>);
    const [search, setSearch] = useState("");
    const [filterProviders, setFilterProviders] = useState<TypeFilter>({});
    const [filterGroups, setFilterGroups] = useState<TypeFilter>({});
    const [filterSorting, setFilterSorting] = useState<TypeFilter>({});
    const [boxColor23, setBoxColor23] = useState<boolean>(true);
    const [boxColor34, setBoxColor34] = useState<boolean>(true);

    const onResetAllFilters = () => {
        setFilterProviders({});
        setFilterGroups({});
        setFilterSorting({});
        setBoxColor23(true);
        setBoxColor34(true);
    };

    useEffect(() => {
        getAllGames().then((games) => setGames(games));
        getAllProviders().then((providers) => setProviders(providers));
        getAllGroups().then((groups) => setGroups(groups));
    });

    return (
        <>
            <AppHeader />
            <GamesList />
            <Filters />
        </>
    );
};

export default PlayerPages;
