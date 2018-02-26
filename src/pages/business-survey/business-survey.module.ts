import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessSurveyPage } from './business-survey';

@NgModule({
  declarations: [
    BusinessSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessSurveyPage),
  ],
})
export class BusinessSurveyPageModule {}
