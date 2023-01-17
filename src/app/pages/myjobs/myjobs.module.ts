import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyjobsComponentComponent } from './myjobs-component/myjobs-component.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
      path: '',
      component: MyjobsComponentComponent
  }
];

@NgModule({
  declarations: [MyjobsComponentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FuseSharedModule,
    MatExpansionModule,
    MatCardModule,
    TranslateModule
  ]
})
export class MyjobsModule { }
