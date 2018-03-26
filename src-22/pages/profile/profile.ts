import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  typeLibrary: string = 'PHOTOLIBRARY';
  typeCamera: string = 'CAMERA';
  imageUploading = false;
  uploadProfileImage: any;
  updateAttempt: boolean;
  updateProfileForm: any;
  userImage: any;
  profile: any;
  states = [];
  positions = [];
  contactLength = CONFIG.ValidExpr.contactLength;
  maxDate;
  zipLength = 5;
  userStorage: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera
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
      address: [''],
      gender: [''],
      dob: [''],
      twitter_handle: [''],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      zip: ['']
    });
    this.profile = {};
    this.getProfile();
    this.getStates();
    let todayDate = new Date();
    let todaymonth = todayDate.getMonth() + 1;
    this.maxDate = todayDate.getFullYear() + '-' + todaymonth + '-' + todayDate.getDate();
    this.common.trackPage(CONFIG.GAnalyticsPageName.profile);
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
          this.updateProfileForm.controls["position"].patchValue(this.profile.position);
          this.updateProfileForm.controls["state"].patchValue(this.profile.state);
          this.userImage = this.profile.profile_image;
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        }  else {
          this.common.showToast(data.message);
        }
      }, error => {
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
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
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        }  else {
          this.common.showToast(data.message);
        }
      }, error => {
        // this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
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
            this.userStorage = JSON.parse(localStorage.getItem("User"));
            this.userStorage.name = this.updateProfileForm.value.name;
            this.userStorage.phone = this.updateProfileForm.value.phone;
            localStorage.setItem("User",JSON.stringify(this.userStorage));
            this.events.publish("userProfile");
            this.common.dismissLoading();
            this.common.showToast(data.message);
            this.navCtrl.push(SettingPage);
          } else if(data.status == 203) {
            this.events.publish("clearSession");
          }  else {
            this.common.dismissLoading();
            this.common.showToast(data.message);
          }
        }, error => {
          this.common.dismissLoading();
          this.common.showToast(CONFIG.MESSAGES.ServerMsg);
        })
      }
    }
  }

  /**Image picker */
  public importPicture(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Image',
      cssClass: 'upload-image',
      buttons: [
        {
          text: 'Gallery',
          icon: !this.platform.is('ios') ? 'md-image' : null,
          handler: () => {
            this.uploadImage(this.typeLibrary);
          }
        },
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            this.uploadImage(this.typeCamera);
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**Upload image */
  public uploadImage(type){
    // alert(type);
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: type==this.typeCamera?this.camera.PictureSourceType.CAMERA:this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: 800,
      targetHeight:800
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.uploadProfileImage = 'data:image/jpeg;base64,' + imageData;
      /** upload profile image to server */
      if(this.uploadProfileImage){
        this.imageUploading = true;
       this.httpService.postData('user/updateprofilepic',{image: this.uploadProfileImage}).subscribe(data=>{
          this.imageUploading = false;
          if(data.status==200){
            this.userImage = this.uploadProfileImage;
            // this.getUserDetails();
            this.common.showToast(data.message);
          } else if(data.status == 203) {
            this.events.publish("clearSession");
          }  else{
            this.common.showToast(data.message);
          }
        },err=>{
          this.imageUploading = false;
        });
      }
    }, (err) => {
      // Handle error
    });
  }
}
