import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { AuthResponse } from '../models/response/AuthResponse';
import AuthService from '../services/AuthService';

// interface TypeJSONData {
//     games: [];
//     providers: [];
//     groups: [];
// }

export default class Store {
    adminRole = false;
    isAuth = false;
    isLoading = false;
    isWrongInputData = false;
    dataJSON = {};

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(value: boolean) {
        this.isAuth = value;
    }

    setAdminRole(value: boolean) {
        this.adminRole = value;
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }

    setDataJSON(data: {}) {
        this.dataJSON = data;
    }

    setIsWrongInputData(value: boolean) {
        this.isWrongInputData = value;
    }

    async login(username: string, password: string) {
        this.setLoading(true);
        this.setIsWrongInputData(false);
        try {
            const response = await AuthService.login(username, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setAdminRole(response.data.adminRole);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            this.setIsWrongInputData(true);
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setAdminRole(false);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`http://localhost:5000/checkAuth`, {
                withCredentials: true,
            });
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setAdminRole(response.data.adminRole);
        } catch (error: any) {
            console.log(error.response);
        } finally {
            this.setLoading(false);
        }
    }
}
