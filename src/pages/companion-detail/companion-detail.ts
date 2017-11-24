import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

import { DomSanitizer } from "@angular/platform-browser"

@IonicPage()
@Component({
  selector: 'page-companion-detail',
  templateUrl: 'companion-detail.html',
})
export class CompanionDetailPage {
  companionId: any;
  companionData: any = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private sanitized: DomSanitizer
  ) {
      this.companionId = navParams.get("id");
      console.log("this.c", this.companionId);
      this.getCompanionDetails(this.companionId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanionDetailPage');
  }

  getCompanionDetails(id){
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("companion/get?id="+id).subscribe(data => {
        if (data.status == 200) {
            this.companionData = data.data;
            this.companionData.data = this.sanitized.bypassSecurityTrustHtml(this.companionData.data);
            console.log("companino", this.companionData);
        } else if(data.status == 203){
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    }
  }
}
