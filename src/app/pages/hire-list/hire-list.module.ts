import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
// custom components
import { HireListContainerComponent } from './hire-list-container/hire-list-container.component';
import { HireListDataTableComponent } from './hire-list-data-table/hire-list-data-table.component';
import { HireListFilterComponent } from './hire-list-filter/hire-list-filter.component';
import { NgChatModule } from 'ng-chat';
import {MatDialogModule} from '@angular/material/dialog';
import { SearchModule } from '../search/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgToggleModule} from 'ng-toggle-button';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// @Component({
//     selector: 'modal',
//     templateUrl: 'modal.html',
//   })
  export class DialogContentExampleDialog {}

const routes = [
    {
        path: '',
        component: HireListContainerComponent
    }
];
@NgModule({
    declarations: [HireListContainerComponent, HireListDataTableComponent, HireListFilterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MaterialModule,
        FuseSharedModule,
        NgChatModule,
        MatDialogModule,
        SearchModule,
        TranslateModule,
        NgxSliderModule,
        NgToggleModule,
        FormsModule,
        ReactiveFormsModule,
    ], 
    // providers: [],
    // bootstrap: [HireListContainerComponent]
})
export class HireListModule {
}
