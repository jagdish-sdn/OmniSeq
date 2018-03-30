import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { CONFIG } from '../../config/config';

import { DomSanitizer } from "@angular/platform-browser"

@IonicPage()
@Component({
  selector: 'page-companion-detail',
  templateUrl: 'companion-detail.html',
})
export class CompanionDetailPage {
  companionId: any;
  companionData: any = {};
  isOnline: any;
  fileDir: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private sanitized: DomSanitizer,
    private storage: Storage, 
    private file: File,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
      this.companionId = navParams.get("id");
      this.getCompanionDetails(this.companionId);
      this.fileDir = this.file.dataDirectory;
      this.isOnline = this.networkPro.checkOnline();
  }

  getCompanionDetails(id){
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("companion/get?id="+id).subscribe(data => {
        if (data.status == 200) {
            this.companionData = data.data;
            this.companionData.data = this.sanitized.bypassSecurityTrustHtml(this.companionData.data);
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
      }, error => {
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.common.presentLoading();
      this.storage.get('companionList').then((val) => {
        this.companionData = val.find((item:any) => { return item._id == this.companionId });
        this.companionData.data = this.sanitized.bypassSecurityTrustHtml(this.companionData.data);
        this.common.dismissLoading();
      });
    }
  }
  public imageName(url){
    let imgSplit = url.split('/');
    return imgSplit[imgSplit.length - 1 ];
  }
}