import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { Storage } from '@ionic/storage';
import { HistologyPage } from '../histology/histology';

@IonicPage()
@Component({
  selector: 'page-cancertype',
  templateUrl: 'cancertype.html',
})
export class CancertypePage {
  cancers : any[] = [];
  showMe: any;
  constructor(
    public navCtrl: NavController,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public navParams: NavParams,
    private storage: Storage,
    public events: Events,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.getcancers();
    this.common.trackPage(CONFIG.GAnalyticsPageName.cancerslist);
  }

  /**Function for get the total no cancers type
   * Created: 20-Mar-2018
   * Creatot: Jagdish Thakre
   */
  getcancers() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("complementaryDetail/getCancerTypes").subscribe(data => {
        if (data.status == 200) {
          this.storage.set("Cancers", data.data);
          this.showMe = "show";
          this.common.dismissLoading();
          this.cancers = data.data;
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        this.showMe = "show";
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.common.presentLoading();
      this.storage.get("Cancers").then((val) => {
        this.cancers = val;
        this.showMe = "show";
        this.common.dismissLoading();
      });
    }
  }

  /**Function created for send on histology view*/
  goToHistology(item){
    this.navCtrl.push(HistologyPage, {item: item});
  }

}
