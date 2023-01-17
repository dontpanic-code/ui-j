import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpContainerComponent } from './help-container/help-container.component';
import { HelpDataTableComponent } from './help-data-table/help-data-table.component';
import { HelpFilterComponent } from './help-filter/help-filter.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
      path: '',
      component: HelpContainerComponent
  }
];

@NgModule({
  declarations: [HelpContainerComponent, HelpDataTableComponent, HelpFilterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatExpansionModule,
    TranslateModule
  ]
})
export class HelpListModule { }
