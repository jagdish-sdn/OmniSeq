import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';
import { Storage } from '@ionic/storage';

import { DomSanitizer } from "@angular/platform-browser"
@IonicPage()
@Component({
  selector: 'page-histology',
  templateUrl: 'histology.html',
})
export class HistologyPage {
  showMe: any;
  cancerDetail: any = [];
  pageTitle: any;
  constructor(
    public navCtrl: NavController,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public navParams: NavParams,
    private storage: Storage,
    public events: Events,
    private sanitized: DomSanitizer,
  ) {
    this.getDetail();
    this.pageTitle = this.navParams.data.item.name
    this.common.trackPage(CONFIG.GAnalyticsPageName.histology);
  }

  /**Function for get the total no cancerDetail type
   * Created: 20-Mar-2018
   * Creatot: Jagdish Thakre
   */
  getDetail() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("complementaryDetail/getByCancerType?id="+this.navParams.data.item._id).subscribe(data => {
        if (data.status == 200) {
          this.storage.set("cancerDetail", data.data);
          this.showMe = "show";
          this.common.dismissLoading();
          this.cancerDetail = data.data;
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
      this.storage.get("cancerDetail").then((val) => {
        this.cancerDetail = val;
        this.showMe = "show";
        this.common.dismissLoading();
      });
    }
  }

}
