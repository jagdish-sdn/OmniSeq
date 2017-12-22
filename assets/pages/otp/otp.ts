import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  passcode : any = '';
  mobileNo : any;
  obj : any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }

  add(value) {
    if(this.passcode.length < 4) {
        this.passcode = this.passcode + value;
        if(this.passcode.length == 4) {

          setTimeout(() => {

            // this.loading = this.loadingCtrl.create({
            //   content: 'Please wait...'
            // });

            // this.loading.present();
           
            console.log("The four digit code was entered");

            let method = "signup/verifyOtp";
            let UserID = localStorage.getItem('UserID');
            let data_parameters = {"OTP":this.passcode, "UserId":UserID};

			      // this.authService.postData(data_parameters,method).then((result) => {

			      //    this.obj = result;

            //    if(this.obj.ResponseCode == 200){

            //     this.loading.dismiss();
            //     this.presentToast(this.obj.Message);
            //     this.navCtrl.push(TabsPage)
            //     localStorage.setItem("IsUserVerify",  '1');
            //    }else{
            //     //  this.loading.dismiss();
            //      this.presentToast(this.obj.Message);
            //      this.passcode = this.passcode.substring(0, 0);
            //      localStorage.setItem("IsUserVerify",  '0');
            //    }

			      // }, (err) => {
            //      this.loading.dismiss();
            //      this.presentToast(err);
            //      localStorage.setItem("IsUserVerify",  '0');
			      // });
            
          }, 500);
        }else{
           console.log('test');
        }
     }
  }

  delete() {
    if(this.passcode.length > 0) {
        this.passcode = this.passcode.substring(0, this.passcode.length - 1);
    }
  }

}
