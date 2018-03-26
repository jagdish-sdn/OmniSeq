import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenedetailPage } from '../genedetail/genedetail';
import { CompanionDetailPage } from '../companion-detail/companion-detail';
import { PodcastDetailPage } from '../podcast-detail/podcast-detail';
import { CONFIG } from '../../config/config';
import { VideoDetailPage } from '../video-detail/video-detail'

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notiList: any = [];
  showMe: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    // this.getNotifications();
  }

  ionViewDidEnter() {
    this.getNotifications();
  }

  /**Function for get the total notifications list from server
   * Created: 28-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getNotifications() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("appuser/getmynotifications?type=" + this.navParams.data.type).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          this.notiList = data.data;
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
        this.showMe = "show";
      }, error => {
        this.showMe = "show";
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.common.showToast('Nerwork is not available!!');
      this.showMe = "show";
    }
  }

  public viewDetails(notificationData: any) {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.postData("appuser/updatemynotifications", {
        "_id": notificationData._id
      }).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          switch (notificationData.data.type) {
            case "new_gene":
              this.navCtrl.push(GenedetailPage, { data: { '_id': notificationData.data.id } });
              break;
            case "new_companion":
              this.navCtrl.push(CompanionDetailPage, { id: notificationData.data.id })
              break;
            case "new_genecomprehensive":
              this.navCtrl.push(PodcastDetailPage, { id: data.id, type: 'comprehnsiveList' })
              break;
            case "new_episode":
              this.navCtrl.push(PodcastDetailPage, { id: data.id })
              break;
            case "new_video":
              this.navCtrl.push(VideoDetailPage, { id: data.id })
              break;
          }
        }
      }, error => {
        this.common.dismissLoading();
      });
    }
  }

}
