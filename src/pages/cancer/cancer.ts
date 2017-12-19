import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenelistPage } from '../genelist/genelist';
import { Storage } from '@ionic/storage';

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
    public events: Events,
    public storage: Storage
  ) {
    this.getGeneList();
  }

  /**Function for got the total no of Gene/marker
   * Created: 23-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('geneList', data.data);
          data.data.map((item:any) => {
            this.geneList['stage'+item.stage].push({ marker: item.marker, target: item.druggable_target });
          });    
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    } else {
      this.common.presentLoading();
      this.storage.get('geneList').then((val) => {
        val.map((item:any) => {
          this.geneList['stage'+item.stage].push({ marker: item.marker, target: item.druggable_target });
        });
        this.common.dismissLoading();
      });
    }
  }

  search(value) {
    this.navCtrl.push(GenelistPage, {searchText : value});
  }

}
