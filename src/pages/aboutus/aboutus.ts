import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
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
    public common: CommonProvider,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.common.trackPage(CONFIG.GAnalyticsPageName.about);
  }

}
