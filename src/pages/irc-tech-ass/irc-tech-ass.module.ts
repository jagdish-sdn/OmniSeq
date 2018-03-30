import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IrcTechAssPage } from './irc-tech-ass';

@NgModule({
  declarations: [
    IrcTechAssPage,
  ],
  imports: [
    IonicPageModule.forChild(IrcTechAssPage),
  ],
})
export class IrcTechAssPageModule {}
