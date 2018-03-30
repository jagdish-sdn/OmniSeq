
import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { Storage } from '@ionic/storage';
import { VideoDetailPage } from '../video-detail/video-detail';
import { CONFIG } from '../../config/config';

@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html',
})
export class VideosPage {
  searchText: any = {};
  videos: any = [];
  showMe: any = '';
  totalRecords: any = 0;
  page = 1;
  limit = 10;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    public httpService: HttpServiceProvider,
    public events: Events,
    public platform: Platform,
    private storage: Storage,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.videosList('');
    this.common.trackPage(CONFIG.GAnalyticsPageName.videosList);
  }

  /**Function for get podcast list from server 
   * Created : 06-March-2018
   * Creator : Jagdish Thakre
   **/
  public videosList(q) {
    if (this.networkPro.checkOnline() == true) {
      if (this.showMe == '') {
        this.common.presentLoading();
      }
      let queryString = "?limit=" + this.limit + "&page=" + this.page;
      if (q != '') {
        queryString += "&title=" + q;
      }
      this.httpService.getData("video/getAll" + queryString).subscribe(data => {
        if (data.status == 200) {
          this.totalRecords = parseInt(data.data.total_count);
          this.videos = data.data.data;
          if (data.data.data.length > 0) {
            this.page += 1;
          }
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);          
        }
        if (this.showMe == '') {
          this.common.dismissLoading();
        }
        this.showMe = "show";
      }, error => {        
        if (this.showMe == '') {
          this.common.dismissLoading();
        }
        this.showMe = "show";
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.storage.get("videos").then((val) => {
        this.showMe = "show";
        let temparr = (val != null || val != undefined) ? val : [];
        if (q == '') {
          this.videos = (val != null || val != undefined) ? val : [];
        } else {
          if (!q) {
            this.videos = Object.assign([], temparr);
          } else {
            this.videos = Object.assign([], temparr).filter(
              item => {
                if (item.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                  return true;
                }
              })
          }
        }
      }, (error) => {
      });
    }
  }

  /**Function created for search video's
   * Created : 06-March-2018
   * Creator : Jagdish Thakre
   */
  searchevideos(q) {
    this.page = 1;
    this.videosList(q);
  }

  /**Function created for redirect on video detail page
   * Created : 06-March-2018
   * Creator : Jagdish Thakre
   */
  public goToVideoDetail(item){
    this.navCtrl.push(VideoDetailPage, {id : item.id});
  }

  millisToMinutesAndSeconds(msec){
    return this.common.millisToMinutesAndSeconds(msec);
  }

  doInfinite(infiniteScroll) {
    this.videosList('');
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
