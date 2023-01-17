import { NgModule } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';

import { VerticalLayout1Module } from '@app/layout/vertical/layout-1/layout-1.module';

@NgModule({
  imports: [VerticalLayout1Module, MatTooltipModule],
  exports: [VerticalLayout1Module]
})
export class LayoutModule {}
