import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(
        username: string,
        password: string,
    ): Promise<AxiosResponse<AuthResponse>> {
        //return $api.post<AuthResponse>('/login', {username, password}).then(response => response.data.accessToken);
        return $api.post<AuthResponse>("/login", { username, password });
    }

    static async logout(): Promise<void> {
        return $api.post("/logout");
    }
}
