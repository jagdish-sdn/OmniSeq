import { Component } from '@angular/core';
import { NavController, Events, NavParams, Platform, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { CONFIG } from '../../config/config';

import { CompanionDetailPage } from '../companion-detail/companion-detail';

@Component({
  selector: 'page-companion',
  templateUrl: 'companion.html',
})
export class CompanionPage {
  companyList = [];
  showMe: any;
  isOnline: any;
  fileDir: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private storage: Storage, 
    private file: File,
    public platform: Platform,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.getCompanyList();
    if (this.platform.is("android") && this.platform.is("cordova")) {
      this.fileDir = this.file.externalRootDirectory + 'OmniSeq/';
    } else if (this.platform.is("ios") && this.platform.is("cordova")) {
      let imgsrc = this.file.documentsDirectory;;
      this.fileDir = imgsrc.replace(/^file:\/\//, '');
    }
    // this.fileDir = this.file.externalRootDirectory + 'OmniSeq/';//this.file.dataDirectory;
    this.isOnline = this.networkPro.checkOnline();
  }

  /**Function for got the total no of Gene/marker
   * Created: 23-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getCompanyList() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("companion/getall").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('companionList', data.data.data);
            this.companyList = data.data.data;  
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
        this.showMe = "show";
      }, error => {
        this.showMe = "show";
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.common.presentLoading();
      this.storage.get('companionList').then((val) => {
        this.companyList = val;
        this.showMe = "show";
        this.common.dismissLoading();
      });
    }  
  }

  goToDetail(id){
    this.navCtrl.push(CompanionDetailPage, {id: id})
  }

  public imageName(url){
    let imgSplit = url.split('/');
    return imgSplit[imgSplit.length - 1 ];
  }

}
