import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, MenuController } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { FormBuilder } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { ProfilePage } from '../profile/profile';
import { ChangePasswordPage } from '../change-password/change-password';
import { AboutusPage } from '../aboutus/aboutus';
import { AppVersion } from '@ionic-native/app-version';
import { CONFIG } from '../../config/config';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  selectedTheme: String;
  submitAttempt: boolean;
  updateAttempt: boolean;
  changePwdForm: any;
  updateProfileForm: any;
  confirmValid: boolean;
  nightmode: boolean;
  pushNotification: boolean;
  profile: any;
  states = [];
  positions = [];
  contactLength = 10;
  showMe = 0;
  disable : any;
  version: any = "1.31";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settings: SettingsProvider,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private platform: Platform,
    private appVersion: AppVersion,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val; this.toggleChecked(this.selectedTheme);
    });
    let userDetail = JSON.parse(localStorage.getItem("User"));
    let notificationStatus = userDetail.push_notification;
    if (notificationStatus == 0) {
      this.pushNotification = false
    } else {
      this.pushNotification = true;
    }
    setInterval(() => {
      this.disable = this.networkPro.checkOnline();
    }, 200);
    this.disable = this.networkPro.checkOnline();
    /**Get Current version*/
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then((val) => {
        this.version = val;
      });
    }
    this.common.trackPage(CONFIG.GAnalyticsPageName.setting);
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('blue-theme');
      this.toggleChecked('blue-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
      this.toggleChecked('dark-theme');
    }
  }

  toggleChecked(selectedTheme) {
    if (selectedTheme == 'dark-theme') {
      this.nightmode = true;
    } else {
      this.nightmode = false;
    }
  }

  togglePushNoti() {
    this.updatePushNotification();    
  }

  updatePushNotification() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.postData("appuser/updatepushnotification", {}).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          let userDetail = JSON.parse(localStorage.getItem("User"));
          userDetail.push_notification = data.data.push_notification;
          localStorage.setItem("User", JSON.stringify(userDetail));
          this.common.showToast(data.message);
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        }  else {
          this.common.showToast(data.message);
        }
      }, error => {
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.pushNotification = false;
      this.common.showToast('Nerwork not available!!');
    }
  }

  logout() {
    if (this.networkPro.checkOnline() == true) {
      this.events.publish("logout");
    } else {
      this.common.showToast('Nerwork is not available!!');
    }
  }

  gotoprofile() {
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(ProfilePage);
    } else {
      this.common.showToast('Nerwork is not available!!');
    }
  }

  gotochangepwd() {
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(ChangePasswordPage);
    } else {
      this.common.showToast('Nerwork is not available!!');
    }
  }

  gotoaboutus() {
    this.navCtrl.push(AboutusPage);
  }
}
