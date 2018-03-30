import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events, NavParams, Content, MenuController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenelistPage } from '../genelist/genelist';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../config/config';

@Component({
  selector: 'page-cancer',
  templateUrl: 'cancer.html',
})
export class CancerPage {
  @ViewChild(Content) content: Content;
  @ViewChild('zoom') zoom: ElementRef;
  showControls: boolean = true;
  scale: number = 1;
  searchText = {};
  geneList = {
    stage1: [],
    stage2: [],
    stage3: [],
    stage4: [],
    stage5: [],
    stage6: [],
    stage7: []
  };
  showMe: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    public storage: Storage,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.getGeneList();
    this.common.trackPage(CONFIG.GAnalyticsPageName.cancerImmuneCycle);
  }

  ionViewDidEnter(): void {
    // Page must be fully rendered, ionViewDidLoad, doesnt work for this. Because it shows clientHeight without the margin of the header
    this.common._pinchZoom(this.zoom.nativeElement, this.content);
  }

  /**Function for got the total no of Gene/marker
   * Created: 23-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getGeneList() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('geneList', data.data);
          data.data.map((item: any) => {
            this.geneList['stage' + item.stage].push({ marker: item.marker, target: item.druggable_target });
          });
        } else if (data.status == 203) {
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
      this.storage.get('geneList').then((val) => {
        val.map((item: any) => {
          this.geneList['stage' + item.stage].push({ marker: item.marker, target: item.druggable_target });
        });
        this.common.dismissLoading();
      });
    }
  }

  search(value) {
    this.navCtrl.push(GenelistPage, { searchText: value });
  }

  afterZoomIn(event) {
    console.log('After ZoomIn Event: ', event);
  }

  afterZoomOut(event) {
    console.log('After ZoomOut Event: ', event);
  }

  
}
