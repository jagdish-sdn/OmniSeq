/** Provider file created for use common function 
 * Created: 29-Oct-2017
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonProvider {
  loading: any;
  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    public http: Http,
    public toast: Toast,
    public loadingCtrl: LoadingController
  ) {
  }

  /**
   * Function created for show toast message
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  showToast(message) {
    if (this.platform.is('cordova')) {
      this.toast.show(message, '5000', 'top').subscribe(
        toast => {
          console.log(toast);
        }
      );
    } else {
      this.showAlert(message);
    }
  }
  /**
   * Function created for show alert message
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  /**
   * Function created for show loader bar
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

  logoutLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Session has been expired...'
    });  
    this.loading.present();
  }

  presentDownloading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait, Downloading is in progress...'
    });
  
    this.loading.present();
  }

  millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60);
    let seconds = parseInt((millis % 60).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
}
