import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

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
    private file: File
  ) {
    this.getCompanyList();
    this.fileDir = this.file.dataDirectory;
    this.isOnline = this.networkPro.checkOnline();
  }

  ionViewDidLoad() {
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
        } else {
          this.common.showToast(data.message);
        }
        this.common.dismissLoading();
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
        this.showMe = "show";
        this.common.dismissLoading();
      });
    } else {
      this.common.presentLoading();
      this.storage.get('companionList').then((val) => {
        console.log("Companion ", val);
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
