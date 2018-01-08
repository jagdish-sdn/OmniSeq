import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComprehensivePage } from './comprehensive';

@NgModule({
  declarations: [
    ComprehensivePage,
  ],
  imports: [
    IonicPageModule.forChild(ComprehensivePage),
  ],
})
export class ComprehensivePageModule {}
