import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  faqArr: any;
  page = 1;
  limit = 5;
  totalRecords: any = 0;
  showMe;
  searchText = {};
  arr: any = [];
  shownGroup = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private storage: Storage
  ) {
    this.faqArr = [];
    this.faqList('');
  }
  
  /**Function for get faq list from server 
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   * */
  public faqList(q) {
    if (this.networkPro.checkOnline() == true) {
      if (this.page == 1) {
        this.common.presentLoading();
      }
      let queryString = "?limit=" + this.limit + "&page=" + this.page;
      if (q != '') {
        queryString += "&question=" + q;
      }
      this.httpService.getData("faq/getall" + queryString).subscribe(data => {
        if (data.status == 200) {
          this.totalRecords = parseInt(data.data.total_count);
          if (this.page == 1 || q != '') {
            this.faqArr = data.data.data;
          } else {
            for (let i = 0; i < data.data.data.length; i++) {
              this.faqArr.push(data.data.data[i]);
            }
          }
          if (data.data.data.length > 0) {
            this.page += 1;
          }
        } else {
          this.common.showToast(data.message);
          if (this.page == 1) {
            this.common.dismissLoading();
          }
        }
        this.common.dismissLoading();
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
        this.showMe = "show";
        if (this.page == 1) {
          this.common.dismissLoading();
        }
      });
    } else {
      if (q == '') {
        this.common.presentLoading();
      }
      this.storage.get('faqList').then((val) => {
        console.log("val", val);
        this.faqArr = val.data;
        this.arr = val.data;
        this.totalRecords = val.total_count;
        if (q != '') {
          this.searchFaq(q);
        }
        this.showMe = "show";
        if (q == '') {
          this.common.dismissLoading();
        }
      });
    }
  }

  searchFaq(value) {
    if (!value) {
      this.returnBlank();
    } else {
      this.faqArr = Object.assign([], this.arr).filter(
        item => {
          if (item.question.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            return true;
          }
        })
    }
  }

  returnBlank() {
    this.faqArr = Object.assign([], this.arr);
  }

  /**Function for infinite scrolling
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   */
  doInfinite(infiniteScroll) {
    this.faqList('');
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

  /**FAQ search */
  search(q) {
    this.page = 1;
    this.faqList(q);
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };
}
