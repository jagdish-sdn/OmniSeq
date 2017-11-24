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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchedItems: any;
  selectedItme: any;
  autoCompleteArr;
  searchText;
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

  returnBlank() {
      this.searchedItems = Object.assign([], this.selectedItme);
  }

  /**Autocomplete filter function
   * created : 13-Nov-2017
   * Creator: Jagdish Thakre
   */
  search(value) {
    this.navCtrl.setRoot(GenelistPage, {searchText : value});
      /*if (!value) {
        this.returnBlank();
      } else {
        if(this.networkPro.checkNetwork() == true) {
          this.common.presentLoading();
          this.httpService.getData("gene/search?q="+value).subscribe(data => {
            this.common.dismissLoading();
            if(data.status == 200) {
              this.autoCompleteArr = data.data;
              this.searchedItems = Object.assign([], this.autoCompleteArr).filter(
                item => {
                    if (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        return true;
                    } else if (item.marker.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        return true;
                    }
                })
            } else if(data.status == 203) {
              this.events.publish("clearSession");
            } else {
              this.common.showToast(data.message);
            }
          }, error => {
            console.log("Error=> ", error);
            this.common.dismissLoading();
          });
        }
      }*/
  }

  /**Select searched option and sending on result page
   * Created : 13-Nov-2017
   * Creator : Jagdish Thakre
   */
  selectItem(item) {
      this.navCtrl.push(GenedetailPage, {data: item});
  }

  /**Functino for send gene list page
   * Created : 14-Nov-2017
   * Creator : Jagdish Thakre
   */
  genelist() {
    this.navCtrl.push(GenelistPage);
  }

  faqPage(){
    this.navCtrl.push(FaqPage);
  }

  public goToAskquestion(){
    this.navCtrl.push(AskQuestionPage);
  }

  public goToCompanion(){
    this.navCtrl.push(CompanionPage);
  }

  public goToCancer(){
    this.navCtrl.push(CancerPage);
  }
}
