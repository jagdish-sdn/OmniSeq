import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenedetailPage } from '../genedetail/genedetail';

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
    public navparam: NavParams
  ) {
    this.searchText = {};
    this.geneList = [];
    console.log("this.navparam ", this.navparam);
    if (this.navparam.data.searchText) {
      this.searchText.name = this.navparam.data.searchText;
    }
    this.getGeneList(this.searchText.name ? this.searchText.name : '');
  }

  ionViewDidLoad() {
  }

  /**Function for got the total no of Gene/marker/Functions
   * Created: 13-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList(q) {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          this.geneList = data.data;
          this.arr = data.data;
          if (q != '') {
            this.search(q);
          }
          this.common.dismissLoading();
        } else {
          this.common.showToast(data.message);
          this.common.dismissLoading();
        }
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
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
          // else if (item.mechanism_of_action.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          //   return true;
          // }
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
