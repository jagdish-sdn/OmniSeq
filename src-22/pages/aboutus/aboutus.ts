import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONFIG } from '../../config/config'
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public common: CommonProvider
  ) {
    this.common.trackPage(CONFIG.GAnalyticsPageName.about);
  }

}
