import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../config/config';

import { SignupPage } from '../signup/signup';
import { ForgotPwdPage } from '../forgot-pwd/forgot-pwd';
// import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  submitAttempt: boolean;
  device_type:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public formBuilder: FormBuilder,
    public events: Events,
    public platform: Platform
  ) {
    this.submitAttempt = false;
    /**Initializing login form controls name form*/
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(CONFIG.ValidExpr.email)
      ])],
      password: ['', Validators.compose([Validators.required])]
    });

    /**Idendifying device type(Android or IOS)*/
    if(this.platform.is('ios')){
      this.device_type = "iOS"
    } else {
      this.device_type = "Android";
    }
  }

  /**
   * Function created for redirect on registration page
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  goToReg() {
    this.navCtrl.setRoot(SignupPage);
  }
  /**
   * Function created for redirect on forgot password page
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  goToForgotPwd() {
    this.navCtrl.setRoot(ForgotPwdPage);
  }
  /**
   * Function created for login user with api calling
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  login() {
    this.submitAttempt = true;
    // this.navCtrl.setRoot(HomePage);
    if(this.loginForm.valid) {
      if(this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.loginForm.value.device_type = this.device_type;
        let device_token = localStorage.getItem("device_token");
        this.loginForm.value.device_token = device_token ? device_token : "staticwebtoken";
        this.loginForm.value.email = this.loginForm.value.email.toLowerCase();
        this.httpService.postData("user/applogin", this.loginForm.value).subscribe(data => {
          this.common.dismissLoading();
          if(data.status == 200) {
            localStorage.setItem("UserId", data.data.user._id);
            localStorage.setItem("User", JSON.stringify(data.data.user));
            localStorage.setItem("Token", JSON.stringify(data.data.token));
            this.events.publish("userProfile");
            this.events.publish("sqliteStorage");
            this.navCtrl.setRoot(WelcomePage);
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

}
