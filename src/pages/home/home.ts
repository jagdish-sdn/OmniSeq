import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { GenedetailPage } from '../genedetail/genedetail';
import { GenelistPage } from '../genelist/genelist';
import { FaqPage } from '../faq/faq';
import { CompanionPage } from '../companion/companion';
import { AskQuestionPage } from '../ask-question/ask-question';
import { CancerPage } from '../cancer/cancer';
import { QuizPage } from '../quiz/quiz';
import { NotificationsPage } from '../notifications/notifications';
import { CONFIG } from '../../config/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchedItems: any;
  selectedItme: any;
  autoCompleteArr;
  searchText;
  counter: any = 0;
  constructor(
    public navCtrl: NavController,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events
  ) {
    this.autoCompleteArr = [];
    this.searchedItems = [];
    this.searchText = {};
  }

  public returnBlank() {
      this.searchedItems = Object.assign([], this.selectedItme);
  }

  public ionViewDidEnter(){
    this.getNotifications();
  }

  /**Autocomplete filter function
   * created : 13-Nov-2017
   * Creator: Jagdish Thakre
   */
  public search(value) {
    this.searchText.name = '';
    this.navCtrl.push(GenelistPage, {searchText : value});
  }

  /**Select searched option and sending on result page
   * Created : 13-Nov-2017
   * Creator : Jagdish Thakre
   */
  public selectItem(item) {
      this.navCtrl.push(GenedetailPage, {data: item});
  }

  /**Functino for send gene list page
   * Created : 14-Nov-2017
   * Creator : Jagdish Thakre
   */
  public genelist() {
    this.navCtrl.push(GenelistPage);
  }

  public faqPage(){
    this.navCtrl.push(FaqPage);
  }

  public goToAskquestion(){
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(AskQuestionPage);
    }else {
      this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    }
  }

  public goToCompanion(){
    this.navCtrl.push(CompanionPage);
  }

  public goToCancer(){
    this.navCtrl.push(CancerPage);
  }

  public goToQuiz(){
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(QuizPage);
    }else {
      this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    }
  }
  
  public goToNoti(){
    if (this.networkPro.checkOnline() == true) {
      this.navCtrl.push(NotificationsPage);
    }else {
      this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    }
  }

  public getNotifications() {
    if (this.networkPro.checkOnline() == true) {
      // this.common.presentLoading();
      this.httpService.getData("appuser/getmynotifications").subscribe(data => {
        // this.common.dismissLoading();
        if (data.status == 200) {
          this.counter = data.data.length;                    
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        // this.common.dismissLoading();
      });
    }
  }
}
