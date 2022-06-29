import axios from 'axios';

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

const useJSONService = () => {
    const getAllGames = async () => {
        const res = await axios.get('http://localhost:5000/getData');
        console.log(`res.data.games - ${res.data.games.map(transformGame)}`);
        return res.data.games.map(transformGame);
    };

    const transformGame = (game: TypeGame) => {
        return {
            id: game.id,
            name: game.name,
            provider: game.provider,
            cover: game.cover,
            coverLarge: game.coverLarge,
            date: game.date,
        };
    };

    const getAllProviders = async () => {
        const res = await axios.get('http://localhost:5000/getData');
        return res.data.providers.map(transformProvider);
    };

    const transformProvider = (provider: TypeProvider) => {
        return {
            id: provider.id,
            name: provider.name,
            logo: provider.logo,
        };
    };

    const getAllGroups = async () => {
        const res = await axios.get('http://localhost:5000/getData');
        return res.data.groups.map(transformGroup);
    };

    const transformGroup = (group: TypeGroup) => {
        return {
            id: group.id,
            name: group.name,
            games: group.games,
        };
    };

    return {
        getAllGames,
        getAllProviders,
        getAllGroups,
    };
};

export default useJSONService;
