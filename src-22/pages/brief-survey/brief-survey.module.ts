import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BriefSurveyPage } from './brief-survey';

@NgModule({
  declarations: [
    BriefSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(BriefSurveyPage),
  ],
})
export class BriefSurveyPageModule {}
