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

export interface TypeGame extends TypeData {
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

export interface TypeObject {
    [index: string]: boolean;
}

export interface TypeGames {
    games: [TypeGame];
}

export interface TypeProviders {
    providers: [TypeProvider];
}

export interface TypeGroups {
    groups: [TypeGroup];
}

export interface TypeFilter extends TypeObject {}
