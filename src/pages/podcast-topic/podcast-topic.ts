import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

import { PodcastPage } from '../podcast/podcast';

@Component({
  selector: 'page-podcast-topic',
  templateUrl: 'podcast-topic.html',
})
export class PodcastTopicPage {
  topics: any = [];
  searchText: any = {};
  page = 1;
  limit = 9;
  totalRecords: any = 0;
  showMe; 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    public httpService: HttpServiceProvider,
    public events: Events
  ) {
    this.topicsList('');
  }

  ionViewWillEnter() {
    console.log("viewwillenter");
    if (localStorage.getItem("currentaudio") && localStorage.getItem("trackplay")) {
      localStorage.setItem("currentaudio", "");
      localStorage.setItem("trackplay", "");
    }
  }

  /**Function for get podcast topics list from server 
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   * */
  public topicsList(q) {
    if (this.networkPro.checkOnline() == true) {
      if (this.page == 1) {
        this.common.presentLoading();
      }
      let queryString = "?limit=" + this.limit + "&page=" + this.page;
      if (q != '') {
        queryString += "&title=" + q;
      }
      this.httpService.getData("podcast/getTopics" + queryString).subscribe(data => {
        if (data.status == 200) {
          this.totalRecords = parseInt(data.data.total_count);
          if (this.page == 1 || q != '') {
            this.topics = data.data.data;
          } else {
            for (let i = 0; i < data.data.data.length; i++) {
              this.topics.push(data.data.data[i]);
            }
          }
          if (data.data.data.length > 0) {
            this.page += 1;
          }
        } else if(data.status == 203) {
          this.events.publish("clearSession");
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
    }
  }

  public prodcastList(item){
    this.navCtrl.push(PodcastPage, {item: item});
  }

  /**Function podcast topics infinite scrolling
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   */
  doInfinite(infiniteScroll) {
    this.topicsList('');
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

  /**Function created for podcast topics search
   * Created : 13-Feb-2018
   * Creator : Jagdish Thakre
  */
  search(q) {
    this.page = 1;
    this.topicsList(q);
  }
}
