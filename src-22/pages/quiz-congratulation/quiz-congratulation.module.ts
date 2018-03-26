import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizCongratulationPage } from './quiz-congratulation';

@NgModule({
  declarations: [
    QuizCongratulationPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizCongratulationPage),
  ],
})
export class QuizCongratulationPageModule {}
