export interface TypeData {
    id: number;
    name: string;
}

export interface TypeProvider extends TypeData {
    logo: string;
}

export interface TypeGroup extends TypeData {
    games: Array<number>;
}

export interface TypeGame {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

export interface TypeFilter {
    [index: string]: boolean;
}
