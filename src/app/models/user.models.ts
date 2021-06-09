import { Authority } from './authority.models';

export class User {

    constructor(){};

    password: string;
    username: string;
    // email: string;
    authorities: Array<Authority>;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    enabled: boolean;
    
}
