import { Role } from '../role';

export class User {
    id: number;
    fullName: string;
    email: string;
    photo: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    typeUser: string;
}
