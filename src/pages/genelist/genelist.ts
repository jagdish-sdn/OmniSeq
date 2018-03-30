import { Component } from '@angular/core';
import { NavController, Events, NavParams, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenedetailPage } from '../genedetail/genedetail';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../config/config';

@Component({
  selector: 'page-genelist',
  templateUrl: 'genelist.html',
})
export class GenelistPage {
  geneList: any;
  searchText: any;
  arr = [];
  showMe: any;
  type: any = 'geneList';
  listUrl: any = 'gene/search';
  constructor(
    public navCtrl: NavController,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    public navparam: NavParams,
    private storage: Storage,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.searchText = {};
    this.geneList = [];
    if (this.navparam.data.searchText) {
      this.searchText.name = this.navparam.data.searchText;
    }
    if (this.navparam.data.type) {
      this.type = this.navparam.data.type;
      if (this.type == 'geneList') {
        this.listUrl = 'gene/search';
        this.common.trackPage(CONFIG.GAnalyticsPageName.rcGeneList);
      } else {
        this.common.trackPage(CONFIG.GAnalyticsPageName.ComprehensiveGeneList);
        this.listUrl = 'genecomprehensive/search';
      }
    }
    this.getGeneList(this.searchText.name ? this.searchText.name : '');
  }

  /**Function for get the total no of Gene/marker/Functions
   * Created: 13-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList(q) {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData(this.listUrl).subscribe(data => {
        if (data.status == 200) {
          this.storage.set(this.type, data.data);
          this.showMe = "show";
          this.common.dismissLoading();
          this.geneList = data.data;
          this.arr = data.data;
          if (q != '') {
            this.search(q);
          }
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
      this.storage.get(this.type).then((val) => {
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
      if (this.type == 'geneList') {
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
        });
      } else {
        this.geneList = Object.assign([], this.arr).filter(
          item => {
            if (item.gene_symbol.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              return true;
            }
            else if (item.gene_name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              return true;
            }
            else if (item.gene_type.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              return true;
            }
        });
      }
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
    this.navCtrl.push(GenedetailPage, { data: item, type: this.type });
  }
}
