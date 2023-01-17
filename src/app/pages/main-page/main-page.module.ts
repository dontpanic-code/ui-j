import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageContainerComponent } from './mainpage-container/mainpage-container.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@app/material.module';
import { ModalComponent } from './modal/modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
      path: '',
      component: MainpageContainerComponent
  }
];

@NgModule({
  declarations: [MainpageContainerComponent, ModalComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    MatDialogModule,
    TranslateModule
  ],
  entryComponents: [ModalComponent],
})
export class MainPageModule { }
