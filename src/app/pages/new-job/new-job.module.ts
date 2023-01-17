import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewjobContainerComponent } from './newjob-container/newjob-container.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { EditjobContainerComponent } from './editjob-container/editjob-container.component';
import { TranslateModule } from '@ngx-translate/core';


const routes = [
  {
    path: '',
    component: NewjobContainerComponent
  },
  {
      path: 'new',
      component: NewjobContainerComponent
  },  
  {
    path: 'edit',
    component: EditjobContainerComponent
  }
];

@NgModule({
  declarations: [NewjobContainerComponent, EditjobContainerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    MatCardModule,
    MatChipsModule,
    TranslateModule
  ]
})
export class NewJobModule { }
