import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobContainerComponent } from './job-container/job-container.component';
import { JobDataTableComponent } from './job-data-table/job-data-table.component';
import { JobFilterComponent } from './job-filter/job-filter.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import {MatCardModule} from '@angular/material/card';
import { FuseSharedModule } from '@fuse/shared.module';
import { OpenJobComponent } from './open-job/open-job.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { SearchModule } from '@app/pages/search/search.module';
import { NgChatModule } from 'ng-chat';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

const routes = [
  {
      path: '',
      component: JobContainerComponent
  },
  {
    path: 'g/:id',
    component: OpenJobComponent
  },
];

@NgModule({
  declarations: [JobContainerComponent, JobDataTableComponent, JobFilterComponent, OpenJobComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    FuseSharedModule,
    MatCardModule,
    CdkAccordionModule,
    SearchModule,
    NgChatModule,
    TranslateModule,
    NgxSliderModule
  ]
})
export class JobListModule { }
