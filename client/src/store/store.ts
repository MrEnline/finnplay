import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { AuthResponse } from '../models/response/AuthResponse';
import AuthService from '../services/AuthService';

export default class Store {
    adminRole = false;
    isAuth = false;
    isLoading = false;

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

    async login(username: string, password: string) {
        try {
            const response = await AuthService.login(username, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setAdminRole(response.data.adminRole);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
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
            const response = await axios.get<AuthResponse>(`${URL}/checkAuth`, {
                withCredentials: true,
            });
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setAdminRole(response.data.adminRole);
        } catch (error: any) {
            console.log(error.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}
