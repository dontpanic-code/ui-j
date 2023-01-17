import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InfoContainerComponent} from './info-container/info-container.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@app/material.module';

const routes = [
    {
        path: '',
        component: InfoContainerComponent
    }
];

@NgModule({
    declarations: [InfoContainerComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MaterialModule,
        CommonModule
    ]
})

export class InfoModule {
}
