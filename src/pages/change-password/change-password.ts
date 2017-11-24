import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  submitAttempt: boolean;
  changePwdForm: any;
  confirmValid: boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.submitAttempt = false;
    
    this.changePwdForm = formBuilder.group({      
      password: ['', Validators.compose([Validators.required])],
      current_password: ['', Validators.compose([Validators.required])],
      conf_password: ['']
    });
  }

  ionViewDidLoad() {
  }

  onConfChange() {
    if (this.changePwdForm.value.password !== this.changePwdForm.value.conf_password) {
      this.confirmValid = false;
    } else {
      this.confirmValid = true;
    }
  }
  /**
   * Function created for Change current password
   * Created: 10-Nov-2017
   * Creator: Jagdish Thakre
   */
  changePwd() {
    this.submitAttempt = true;
    if (this.changePwdForm.valid && this.confirmValid) {
      if (this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.httpService.postData('user/updatepassword', this.changePwdForm.value).subscribe(data => {
          if (data.status == 200) {
            this.common.dismissLoading();
            this.common.showToast(data.message);
            this.navCtrl.setRoot(SettingPage);
          } else if(data.status == 203){
            this.events.publish("clearSession");
          } else {
            this.common.dismissLoading();
            this.common.showToast(data.message);
          }
        }, error => {
          console.log("Error=> ", error);
          this.common.dismissLoading();
        })
      }
    }
  }
}
