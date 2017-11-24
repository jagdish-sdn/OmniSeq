import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

import { CompanionDetailPage } from '../companion-detail/companion-detail';

@Component({
  selector: 'page-companion',
  templateUrl: 'companion.html',
})
export class CompanionPage {
  companyList = [];
  showMe: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.getCompanyList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanionPage');
  }

  /**Function for got the total no of Gene/marker
   * Created: 23-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getCompanyList() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("companion/getall").subscribe(data => {
        if (data.status == 200) {
            this.companyList = data.data.data;  
        } else if(data.status == 203){
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
        this.showMe = "show";
        this.common.dismissLoading();
      });
    }    
  }

  goToDetail(id){
    this.navCtrl.push(CompanionDetailPage, {id: id})
  }

}
