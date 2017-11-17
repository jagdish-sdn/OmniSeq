import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  faqArr : any;
  page = 0;
  limit = 5;
  totalRecords = 0;
  showMe;
  infiScroll;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
  ) {
    this.faqArr = [];
    this.faqList();
  }

  ionViewDidLoad() {
  }

  public faqList() {
    if (this.networkPro.checkNetwork() == true) {
      this.page +=1;
      if(this.page == 1){
        this.common.presentLoading();
      }
      let queryString = "?limit="+this.limit+"&page="+this.page;
      this.httpService.getData("faq/getall"+queryString).subscribe(data => {
        if (data.status == 200) {
          this.totalRecords = data.total_count;
          if(this.page == 1){
            this.faqArr = data.data.data;
            this.common.dismissLoading();
          } else {            
            for (let i = 0; i < data.data.data.length; i++) {
              this.faqArr.push( data.data.data[i] );
            }
          }        
        } else {
          this.common.showToast(data.message);
          if(this.page == 1){
            this.common.dismissLoading();
          }
        }
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
        this.showMe = "show";
        if(this.page ==1){
          this.common.dismissLoading();
        }
      });
    }
  }
  doInfinite(infiniteScroll) {
    this.infiScroll = "scroll";
    this.faqList();
    setTimeout(() => {
      this.infiScroll = "end";
      infiniteScroll.complete();
    }, 500);
  }

}
