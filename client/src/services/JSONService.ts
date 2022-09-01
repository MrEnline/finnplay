import axios from 'axios';

interface TypeGames {
    games: [TypeGame];
}

interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

interface TypeProviders {
    providers: [TypeProvider];
}

interface TypeProvider {
    id: number;
    name: string;
    logo: string;
}

interface TypeGroups {
    groups: [TypeGroup];
}

interface TypeGroup {
    id: number;
    name: string;
    games: [];
}

const useJSONService = () => {
    const getAllGames = async () => {
        const res = await axios.get<TypeGames>('http://localhost:5000/getData');
        return res.data.games;
    };

    // const transformGame = (game: TypeGame) => {
    //     return {
    //         id: game.id,
    //         name: game.name,
    //         provider: game.provider,
    //         cover: game.cover,
    //         coverLarge: game.coverLarge,
    //         date: game.date,
    //     };
    // };

    const getAllProviders = async () => {
        const res = await axios.get<TypeProviders>('http://localhost:5000/getData');
        //return res.data.providers.map(transformProvider);
        return res.data.providers;
    };

    // const transformProvider = (provider: TypeProvider) => {
    //     return {
    //         id: provider.id,
    //         name: provider.name,
    //         logo: provider.logo,
    //     };
    // };

    const getAllGroups = async () => {
        const res = await axios.get<TypeGroups>('http://localhost:5000/getData');
        return res.data.groups;
        //return res.data.groups.map(transformGroup);
    };

    // const transformGroup = (group: TypeGroup) => {
    //     return {
    //         id: group.id,
    //         name: group.name,
    //         games: group.games,
    //     };
    // };

    const deleteGroup = async (idDeleteGroup: number, idMoveGroup: number) => {
        const res = await axios.delete<TypeGroups>(`http://localhost:5000/deleteGroup/`, {
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            data: { idDeleteGroup, idMoveGroup },
        });
        return res.data.groups;
    };

    const editGroup = async (idEditGroup: number, nameEditGroup: string, idsGames: Array<number>) => {
        const res = await axios.post<TypeGroups>(`http://localhost:5000/editGroup/`, { idEditGroup, nameEditGroup, idsGames });
        return res.data.groups;
    };

    const addGroup = async (nameAddGroup: string, idsGames: Array<number>) => {
        const res = await axios.post<TypeGroups>(`http://localhost:5000/addGroup/`, { nameAddGroup, idsGames });
        return res.data.groups;
    };

    return {
        getAllGames,
        getAllProviders,
        getAllGroups,
        deleteGroup,
        editGroup,
        addGroup,
    };
};

export default useJSONService;
