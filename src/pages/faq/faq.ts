import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.faqArr = [];
    this.faqList('');
  }

  ionViewDidLoad() {
  }

  /**Function for get faq list from server 
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   * */
  public faqList(q) {
    if (this.networkPro.checkNetwork() == true) {
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
        } else if(data.status == 203){
          this.events.publish("clearSession");
        }else {
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
    }
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

}
