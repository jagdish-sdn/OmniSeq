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

  logout() {
    this.events.publish("logout");
  }

  gotoprofile() {
    this.navCtrl.push(ProfilePage);
  }
  gotochangepwd() {
    this.navCtrl.push(ChangePasswordPage);
  }
}
