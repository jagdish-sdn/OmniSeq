import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { HomePage } from '../home/home'
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { AppVersion } from '@ionic-native/app-version';
import { PodcastPage } from '../podcast/podcast';
import { BriefSurveyPage } from '../brief-survey/brief-survey';
import { ComprehensivePage } from '../comprehensive/comprehensive'
import { HttpServiceProvider } from '../../providers/http-service/http-service';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  version: any = "0.0.1";
  updateDate: any = "17-Jan-2017";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    private appVersion: AppVersion,
    private platform: Platform,
    public events: Events,
    public httpService: HttpServiceProvider,
  ) {
    this.events.publish("sideMenuBlog",'welcome');
    /**Get Current version*/
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then((val) => {
        this.version = val;
      });
    }
    this.platform.ready().then(()=>{
      this.getUpdateDate();
    })
  }

  /**Function created for get last updated date
   * Created: 22-Feb-2018
   * Creator: Jagdish Thakre
   */
  getUpdateDate(){
    this.httpService.getData("user/getappversion").subscribe(data => {
      if (data.status == 200) {
        if(this.platform.is('android')){
          this.updateDate = data.data.android_last_update;
        } else {
          this.updateDate = data.data.ios_last_update;
        }
      } else if (data.status == 203) {
        this.events.publish("clearSession");
      } else {
        this.common.showToast(data.message);
      }
    }, error => {
      console.log("Error=> ", error);
    });
  }
  /**Function created for redirect on home page
   * Created: 03-Jan-2018
   * Created By: Jagdish Thakre
   */
  public goToHome() {
    this.events.publish("sideMenuBlog",'report');
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

  /**Fuction created for redirect on podcast page
   * Created: 05-02-18
   * Created By: Jagdish Thakre
  */
  public goToPodcast() {
    // if (this.networkPro.checkOnline() == true) {
      localStorage.setItem('currentaudio', "");
      localStorage.setItem('trackplay', "");
      this.navCtrl.push(PodcastPage);
    // } else {
    //   this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    // }
  }

  public goToComprensive(){
    this.events.publish("sideMenuBlog",'comprehnsive');
    this.navCtrl.setRoot(ComprehensivePage);
  }

  busDev() {
    // this.events.publish("sideMenuBlog",'comprehnsive');
  }


}
