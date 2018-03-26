import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistologyPage } from './histology';

@NgModule({
  declarations: [
    HistologyPage,
  ],
  imports: [
    IonicPageModule.forChild(HistologyPage),
  ],
})
export class HistologyPageModule {}
