import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home'
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { AppVersion } from '@ionic-native/app-version';
// import { ComprehensivePage } from '../comprehensive/comprehensive';
import { BriefSurveyPage } from '../brief-survey/brief-survey';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  version: any = "0.0.1";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    private appVersion: AppVersion,
    private platform: Platform
  ) {
    /**Get Current version*/
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then((val) => {
        this.version = val;
      });
    }
  }

  /**Function created for redirect on home page
   * Created: 03-Jan-2018
   * Created By: Jagdish Thakre
   */
  public goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  /**Function created for redirect on home page
   * Created: 03-Jan-2018
   * Created By: Jagdish Thakre
   */
  public goToCallBrief() {
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(BriefSurveyPage);
    } else {
      this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    }
  }

}
