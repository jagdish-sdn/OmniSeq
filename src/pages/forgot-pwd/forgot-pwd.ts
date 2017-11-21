import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forgot-pwd',
  templateUrl: 'forgot-pwd.html',
})
export class ForgotPwdPage {
  forgotPwdForm: FormGroup;
  submitAttempt: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public formBuilder: FormBuilder
  ) {
    this.submitAttempt = false;
    this.forgotPwdForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9_.+-]+@[a-z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
      ]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPwdPage');
  }

  forgotPwd() {
    this.submitAttempt = true;
    if(this.forgotPwdForm.valid) {
      if(this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.httpService.postData("user/reqresetpassword", this.forgotPwdForm.value).subscribe(data => {
          this.common.dismissLoading();
          if(data.status == 200) {
            //this.common.showToast(data.message);
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.common.showToast(data.message);
          }
        }, error => {
          console.log("Error=> ", error);
          this.common.dismissLoading();
        });
      }
    }
  } 

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
