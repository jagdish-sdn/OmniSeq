import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SettingsProvider } from './../../providers/settings/settings';
import { FormBuilder } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { ProfilePage } from '../profile/profile';
import { ChangePasswordPage } from '../change-password/change-password';
import { AboutusPage } from '../aboutus/aboutus';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settings: SettingsProvider,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val; this.toggleChecked(this.selectedTheme);
    });
    let userDetail = JSON.parse(localStorage.getItem("User"));
    let notificationStatus = userDetail.push_notification;
    if(notificationStatus == 0){
      this.pushNotification = false
    } else{
      this.pushNotification = true;
    }
  }


  ionViewDidLoad() {
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

  togglePushNoti(){
    // this.pushNotification = (this.pushNotification == true) ? false : true;         
    this.updatePushNotification();
  }

  updatePushNotification(){
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.postData("appuser/updatepushnotification",{}).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          let userDetail = JSON.parse(localStorage.getItem("User"));
          userDetail.push_notification = data.data.push_notification;
          localStorage.setItem("User", JSON.stringify(userDetail));
          // this.pushNotification = (data.data.push_notification == 0) ? false : true; 
          this.common.showToast(data.message);
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    }
  }

  logout() {    
    this.events.publish("logout");
  }

  gotoprofile() {
    this.navCtrl.push(ProfilePage);
  }
  gotochangepwd() {
    this.navCtrl.push(ChangePasswordPage);
  }
  gotoaboutus() {
    this.navCtrl.push(AboutusPage);
  }
}
