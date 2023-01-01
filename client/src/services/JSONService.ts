import axios from 'axios';
import { TypeGames, TypeProviders, TypeGroups } from '../utils/Interfaces';
import { API_URL } from '../utils/Constants';

const useJSONService = () => {
    const getAllGames = async () => {
        const res = await axios.get<TypeGames>(`${API_URL}/getData`);
        return res.data.games;
    };

    const getAllProviders = async () => {
        const res = await axios.get<TypeProviders>(`${API_URL}/getData`);
        return res.data.providers;
    };

    const getAllGroups = async () => {
        const res = await axios.get<TypeGroups>(`${API_URL}/getData`);
        return res.data.groups;
    };

    const deleteGroup = async (idDeleteGroup: number, idMoveGroup: number) => {
        const res = await axios.delete<TypeGroups>(`${API_URL}/deleteGroup/`, {
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            data: { idDeleteGroup, idMoveGroup },
        });
        return res.data.groups;
    };

    const editGroup = async (idEditGroup: number, nameEditGroup: string, idsGames: Array<number>) => {
        const res = await axios.post<TypeGroups>(`${API_URL}/editGroup/`, { idEditGroup, nameEditGroup, idsGames });
        return res.data.groups;
    };

    const addGroup = async (nameAddGroup: string, idsGames: Array<number>) => {
        const res = await axios.post<TypeGroups>(`${API_URL}/addGroup/`, { nameAddGroup, idsGames });
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
