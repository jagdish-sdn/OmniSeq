import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-genedetail',
  templateUrl: 'genedetail.html',
})
export class GenedetailPage {
  geneDetail: any;
  geneList: any = [];
  showMe: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    public events: Events,
    private storage: Storage
    
  ) {
    this.geneDetail = {};
    this.storage.get('geneList').then((val) => {
      this.geneList = val;
      this.getGeneDetail();
    });    
  }

  /**Function for get gene details
   * Created: 14-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneDetail() {    
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {        
        if (data.status == 200) {
          this.storage.set('geneList', data.data);
          this.geneDetail = this.geneList.find((item:any) => { return item._id == this.navParams.data.data._id });
          console.log("this.geneDetail ", this.geneDetail);
          this.showMe = true;
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
          this.showMe = true;
        }
        this.common.dismissLoading();
        this.showMe = true;
      }, error => {
        this.showMe = true;
        this.common.dismissLoading();
      });
    }else{
      this.common.presentLoading();
      this.geneDetail = this.geneList.find((item:any) => { return item._id == this.navParams.data.data._id });
      this.common.dismissLoading();
      this.showMe = true;
    }
  }
  
}