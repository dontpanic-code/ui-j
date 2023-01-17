import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
      path: '',
      component: WelcomePageComponent
  }
];

@NgModule({
  declarations: [WelcomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    TranslateModule
  ]
})
export class WelcomeModule { }
