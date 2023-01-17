import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
// custom components
import { MyAccountContainerComponent } from './my-account-container/my-account-container.component';
import { MyAccountFormComponent } from './my-account-form/my-account-form.component';
import { RecruiterAccountFormComponent } from './recruiter/recruiter-account-form.component';
import {MatListModule} from '@angular/material/list'
import { TranslateModule } from '@ngx-translate/core';


const routes = [
    {
        path: '',
        component: MyAccountContainerComponent
    }
];

@NgModule({
    declarations: [MyAccountContainerComponent, MyAccountFormComponent, RecruiterAccountFormComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MaterialModule,
        FuseSharedModule,
        MatListModule,
        TranslateModule
    ]
})
export class MyAccountModule {
}
