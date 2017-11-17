import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { DatePicker } from '@ionic-native/date-picker';

import { CommonProvider } from '../../providers/common/common';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  updateAttempt: boolean;
  updateProfileForm: any;
  profile: any;
  states = [];
  positions = [];
  contactLength = 10;
  maxDate;
  zipLength = 5;
  userStroage: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private datePicker: DatePicker
  ) {
    this.positions = [
      { name: 'Oncologist' },
      { name: 'Pathologist' },
      { name: 'Clinical Support' },
      { name: 'Researcher' },
      { name: 'Sales Executive' },
      { name: 'Other' }
    ];
    this.updateAttempt = false;
    this.updateProfileForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      position: ['', Validators.compose([Validators.required])],
      institution: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      address: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zip: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.zipLength),
        Validators.maxLength(this.zipLength)
      ])]
    });
    this.profile = {};
    this.getProfile();
    this.getStates();
    let todayDate = new Date();
    let todaymonth = todayDate.getMonth() + 1;
    this.maxDate = todayDate.getFullYear() + '-' + todaymonth + '-' + todayDate.getDate();
  }

  ionViewDidLoad() {

  }
  /**Function are useing for get profile detail from server 
   * Created : 15-Nov-2017
   * Creator : Jagdish Thakre
  */
  getProfile() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("user/getprofile").subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          this.profile = data.data;
          this.profile.phone = this.profile.phone.replace('+1', '');
          if(this.profile.dob){
            this.profile.dob = new Date(this.profile.dob).toISOString();
          }          
          this.updateProfileForm.controls["position"].patchValue(this.profile.position);
          this.updateProfileForm.controls["gender"].patchValue(this.profile.gender);
          this.updateProfileForm.controls["state"].patchValue(this.profile.state);
          if(this.profile.dob){
            this.updateProfileForm.controls["dob"].patchValue(this.profile.dob);
          }
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    }
  }

  /**Function are useing for get profile detail from server 
   * Created : 15-Nov-2017
   * Creator : Jagdish Thakre
  */
  getStates() {
    if (this.networkPro.checkNetwork() == true) {
      // this.common.presentLoading();
      this.httpService.getData("state/getlist").subscribe(data => {
        // this.common.dismissLoading();
        if (data.status == 200) {
          this.states = data.data;
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        // this.common.dismissLoading();
      });
    }
  }

  /**
   * Function created for update profile detail
   * Created: 15-Nov-2017
   * Creator: Jagdish Thakre
   */
  updateprofile() {
    this.updateAttempt = true;
    if (this.updateProfileForm.valid) {
      if (this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.updateProfileForm.value.phone = '+1' + this.updateProfileForm.value.phone
        this.httpService.postData('user/updateprofile', this.updateProfileForm.value).subscribe(data => {
          if (data.status == 200) {
            this.userStroage = JSON.parse(localStorage.getItem("User"));
            this.userStroage.name = this.updateProfileForm.value.name;
            this.userStroage.phone = this.updateProfileForm.value.phone;
            localStorage.setItem("User",JSON.stringify(this.userStroage));
            this.events.publish("userProfile");
            this.common.dismissLoading();
            this.common.showToast(data.message);
            this.navCtrl.setRoot(SettingPage);
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

  showDatePicker() {
    this.datePicker.show({
      //date: !this.profile.dob ? new Date() : this.profile.dob,
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
      );
  }

}
