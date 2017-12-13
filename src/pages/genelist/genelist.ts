import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenedetailPage } from '../genedetail/genedetail';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-genelist',
  templateUrl: 'genelist.html',
})
export class GenelistPage {
  geneList: any;
  searchText: any;
  arr = [];
  showMe: any;
  constructor(
    public navCtrl: NavController,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    public navparam: NavParams,
    private storage: Storage
  ) {
    this.searchText = {};
    this.geneList = [];
    if (this.navparam.data.searchText) {
      this.searchText.name = this.navparam.data.searchText;
    }
    this.getGeneList(this.searchText.name ? this.searchText.name : '');
  }

  ionViewDidLoad() {
  }

  /**Function for get the total no of Gene/marker/Functions
   * Created: 13-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList(q) {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('geneList', data.data);
          this.geneList = data.data;
          this.arr = data.data;
          if (q != '') {
            this.search(q);
          }
        } else {
          this.common.showToast(data.message);
        }
        this.showMe = "show";
        this.common.dismissLoading();
      }, error => {
        this.showMe = "show";
        this.common.dismissLoading();
      });
    } else {
      this.common.presentLoading();
      this.storage.get('geneList').then((val) => {
        this.geneList = val;
        this.arr = val;
        if (q != '') {
          this.search(q);
        }
        this.showMe = "show";
        this.common.dismissLoading();
      });
    }
  }

  /**Search filter function
   * created : 13-Nov-2017
   * Creator: Jagdish Thakre
   */
  search(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.geneList = Object.assign([], this.arr).filter(
        item => {
          if (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          }
          else if (item.marker.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          }
          else if (item.irc_function.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          }
        })
    }
  }

  returnBlank() {
    this.geneList = Object.assign([], this.arr);
  }

  /**Select searched option and sending on result page
   * Created : 16-Nov-2017
   * Creator : Jagdish Thakre
   */
  selectme(item) {
    this.navCtrl.push(GenedetailPage, { data: item });
  }
}
