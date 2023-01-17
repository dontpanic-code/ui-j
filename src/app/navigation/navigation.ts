import { FuseNavigation } from '@fuse/types';
import { Role } from '@app/models/role';

export const navigation: FuseNavigation[] = [
    {
        id: 'requests',
        title: 'Requests',
        type: 'item',
        url: '/requests',
        exactMatch: false,
        icon: 'library_books',
        role: `${Role.Admin}`
    }
];
