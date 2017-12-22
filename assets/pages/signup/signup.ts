import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;
  submitAttempt: boolean;
  confirmValid: boolean;
  contactLength: any;
  genders: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider
  ) {
    this.genders = [
      {
        name: 'Male',
        value: 'male'
      },
      {
        name: 'Female',
        value: 'female'
      }
    ]
    this.contactLength = CONFIG.ValidExpr.contactLength;
    this.submitAttempt = false;
    // this.confirmValid = true;
    this.signupForm = formBuilder.group({
      fullname: ['', Validators.compose([
        Validators.maxLength(30),
        Validators.pattern(CONFIG.ValidExpr.string),
        Validators.required])
      ],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
        Validators.pattern(CONFIG.ValidExpr.number)
      ])],
      email: ['', Validators.compose([
          Validators.required,
          Validators.pattern(CONFIG.ValidExpr.email)
        ])
      ],
      city: ['', Validators.compose([Validators.required])],
      dob: [''],
      gender: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  public signup(){
    this.submitAttempt = true;
  }
}
