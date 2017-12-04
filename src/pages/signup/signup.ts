import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;
  submitAttempt: boolean;
  confirmValid: boolean;
  contactLength: any;
  positions = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public alertCtrl: AlertController
  ) {
    this.positions = [
      {name: 'Oncologist'},
      {name: 'Pathologist'},
      {name: 'Clinical Support'},
      {name: 'Researcher'},
      {name: 'Sales Executive'},
      {name: 'Other'}
    ];
    this.contactLength = 10;
    this.submitAttempt = false;
    // this.confirmValid = true;
    this.signupForm = formBuilder.group({
      firstname: ['', Validators.compose([
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]*'),
        Validators.required])
      ],
      lastname: ['', Validators.compose([
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]*'),
        Validators.required])
      ],
      institution: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9]+[a-zA-Z0-9]+[a-zA-Z0-9._]+@[a-z]+\.[a-z.]{2,5}$')
        ])
      ],
      password: ['', Validators.compose([Validators.required])],
      position: ['', Validators.compose([Validators.required])],
      conf_password: [''],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])]
    });
  }

  ionViewDidLoad() {
  }
  /**
   * Function created for register requested user with
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  signup() {
    this.submitAttempt = true;
    if (this.signupForm.valid && this.confirmValid) {
      if (this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.signupForm.value.name= this.signupForm.value.firstname +' '+ this.signupForm.value.lastname;
        this.signupForm.value.phone = '+1'+this.signupForm.value.phone
        this.signupForm.value.email = this.signupForm.value.email.toLowerCase();
        this.httpService.postData('user/registration', this.signupForm.value).subscribe(data => {
          if (data.status == 200) {
            this.common.dismissLoading();
            this.presentOk(data.message);
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
  /**
   * Function created for check password and confirm password validation check
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  onConfChange() {
    if (this.signupForm.value.password !== this.signupForm.value.conf_password) {
      this.confirmValid = false;
    } else {
      this.confirmValid = true;
    }
  }
  /**
   * Function created for show confirm alert after successfully register
   * Created: 01-Nov-2017
   * Creator: Jagdish Thakre
   */
  presentOk(message) {
    const alert = this.alertCtrl.create({
      title: 'Registration Successfull',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }        
      ]
    });
    alert.present();
  }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

}
