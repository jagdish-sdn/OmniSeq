import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenedetailPage } from './genedetail';

@NgModule({
  declarations: [
    GenedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GenedetailPage),
  ],
})
export class GenedetailPageModule {}
