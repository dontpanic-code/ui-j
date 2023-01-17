import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalJobComponent } from './approval-job/approval-job.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: '',
    component: ApprovalJobComponent
  },
  {
      path: 'approval-jobs',
      component: ApprovalJobComponent
  }
];

@NgModule({
  declarations: [ApprovalJobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    TranslateModule
  ]
})
export class ModeratorModule { }
