import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactsContainerComponent} from './contacts-container/contacts-container.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
    {
        path: '',
        component: ContactsContainerComponent
    }
];

@NgModule({
    declarations: [ContactsContainerComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MaterialModule,
        CommonModule,
        TranslateModule
    ]
})
export class ContactsModule {
}
