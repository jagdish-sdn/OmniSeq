import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanionDetailPage } from './companion-detail';

@NgModule({
  declarations: [
    CompanionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanionDetailPage),
  ],
})
export class CompanionDetailPageModule {}
