import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenelistPage } from '../genelist/genelist';

@Component({
  selector: 'page-cancer',
  templateUrl: 'cancer.html',
})
export class CancerPage {
  searchText = {};
  geneList = {
    stage1: [],
    stage2: [],
    stage3: [],
    stage4: [],
    stage5: [],
    stage6: [],
    stage7: []
  };
  showMe : any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.getGeneList();
  }

  ionViewDidLoad() {
  }

  /**Function for got the total no of Gene/marker
   * Created: 23-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          data.data.map((item:any) => {
            this.geneList['stage'+item.stage].push({ marker: item.marker, target: item.druggable_target });
          });    
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

  search(value) {
    this.navCtrl.setRoot(GenelistPage, {searchText : value});
  }

}
