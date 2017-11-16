/** Network file created for check mobile device internet avalability
 * Created: 31-Oct-2017
 * Creator: Jagdish Thakre
*/
import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var cordova: any;
@Injectable()
export class NetworkProvider {

  constructor(
    public http: Http,
    private network: Network,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
  }
  /**
   * Function created for check internet connection
   * Created: 31-Oct-2017
   * Creator: Jagdish Thakre
   */
  checkNetwork() {
      let type:string;      
      type = this.network.type;
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        return true;
      } else {     
        return this.check(type);      
      }
  }

  check(type) {
    if(type == "unknown" || type == "none" || type == undefined){
        this.showNetworkAlert();        
      } else {
        return true;
      }
  }

  showNetworkAlert() {
    let networkAlert = this.alertCtrl.create({
      title: 'No Internet Connection',
      message: 'Please check your internet connection.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Open Settings',
          handler: () => {
            networkAlert.dismiss().then(() => {
              this.showSettings();
            })
          }
        }
      ]
    });
    networkAlert.present();
  }
  /**
   * Function created for redirect on mobile internet setting
   * Created: 31-Oct-2017
   * Creator: Jagdish Thakre
   */
  private showSettings() {
    if (cordova.plugins.diagnostic.switchToWifiSettings) {
      cordova.plugins.diagnostic.switchToWifiSettings();
    } else {
      cordova.plugins.diagnostic.switchToSettings();
    }
  }

}
