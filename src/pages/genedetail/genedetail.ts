import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

@IonicPage()
@Component({
  selector: 'page-genedetail',
  templateUrl: 'genedetail.html',
})
export class GenedetailPage {
  geneDetail: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.geneDetail = {};
    this.getGeneDetail();
  }

  ionViewDidLoad() {
  }

  /**Function for get gene details
   * Created: 14-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneDetail() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/get?id=" + this.navParams.data.data._id).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {          
          this.geneDetail = data.data;
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    }
  }
  
}