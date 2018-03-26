import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PodcastTopicPage } from './podcast-topic';

@NgModule({
  declarations: [
    PodcastTopicPage,
  ],
  imports: [
    IonicPageModule.forChild(PodcastTopicPage),
  ],
})
export class PodcastTopicPageModule {}
