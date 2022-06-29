import { useEffect, useContext, useState } from "react";
import { Context } from "../../index";
import AppHeader from "../appHeader/AppHeader";
import useJSONService from "../../services/JSONService";

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

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

const PlayerPages = () => {
    const { store } = useContext(Context);
    const { getAllGames, getAllProviders, getAllGroups } = useJSONService();
    const [games, setGames] = useState(Array<TypeGame>);

    useEffect(() => {
        getAllGames().then((games) => setGames(games));
    });

    return (
        <>
            <AppHeader />
        </>
    );
};

export default PlayerPages;
