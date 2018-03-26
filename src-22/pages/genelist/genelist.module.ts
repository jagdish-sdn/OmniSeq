import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenelistPage } from './genelist';

@NgModule({
  declarations: [
    GenelistPage,
  ],
  imports: [
    IonicPageModule.forChild(GenelistPage),
  ],
})
export class GenelistPageModule {}
