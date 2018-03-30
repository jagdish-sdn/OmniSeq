import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { CancertypePage } from '../cancertype/cancertype';
import { CompanionPage } from '../companion/companion';

@IonicPage()
@Component({
  selector: 'page-comp-type',
  templateUrl: 'comp-type.html',
})
export class CompTypePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
  }

  public goToCancerType(){
    this.navCtrl.push(CancertypePage);
  }

  public goToTherapic(){
    this.navCtrl.push(CompanionPage);
  }
}