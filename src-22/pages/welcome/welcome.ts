
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { PodcastPage } from '../podcast/podcast';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { AppVersion } from '@ionic-native/app-version';
import { BriefSurveyPage } from '../brief-survey/brief-survey';
import { ComprehensivePage } from '../comprehensive/comprehensive'
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { BusinessSurveyPage } from '../business-survey/business-survey';
import { VideosPage } from '../videos/videos'

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  version: any = "1.31";
  updateDate: any = "16-March-2018";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    private appVersion: AppVersion,
    private platform: Platform,
    public events: Events,
    public httpService: HttpServiceProvider,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.events.publish("sideMenuBlog",'welcome');
    /**Get Current version*/
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then((val) => {
        this.version = val;
      });
    }
    this.platform.ready().then(()=>{
      this.getUpdateDate();
      this.common.trackPage(CONFIG.GAnalyticsPageName.homePage);
    })
  }

  /**Function created for get last updated date
   * Created: 22-Feb-2018
   * Creator: Jagdish Thakre
   */
  getUpdateDate(){
    if (this.networkPro.checkOnline() == true) {
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
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    }
  }
  /**Function created for redirect on home page
   * Created: 03-Jan-2018
   * Created By: Jagdish Thakre
   */
  public goToHome() {
    // this.events.publish("sideMenuBlog",'report');
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

  public goToVideos(){
    this.navCtrl.push(VideosPage);
  }

  busDev() {
    // this.common.showToast("Coming Soon!");
    this.navCtrl.push(BusinessSurveyPage)
  }


}
