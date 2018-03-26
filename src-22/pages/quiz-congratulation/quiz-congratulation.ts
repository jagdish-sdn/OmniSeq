import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ComprehensivePage} from '../comprehensive/comprehensive';
import { CommonProvider } from '../../providers/common/common';
import { CONFIG } from '../../config/config';

@IonicPage()
@Component({
  selector: 'page-quiz-congratulation',
  templateUrl: 'quiz-congratulation.html',
})
export class QuizCongratulationPage {
  message: any;
  totalPoints: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public common: CommonProvider
  ) {
    if(this.navParams.data.type == 'report') {
      this.common.trackPage(CONFIG.GAnalyticsPageName.rcQuiz);
    } else {
      this.common.trackPage(CONFIG.GAnalyticsPageName.ComprehensiveQuiz);
    }
  }

  ionViewDidLoad() {
    let navparam = this.navParams.data;
    let points = navparam.correct_answer * 10;
    this.totalPoints = points + navparam.extra_points;
    this.message = '';
    this.message += points+" points("+ navparam.correct_answer +" out of "+navparam.totalQue+")";
    this.message += (navparam.extra_points != 0) ? " + "+navparam.extra_points+" points time bonus" : '';    
  }

  public nextScreen(){
    if(this.navParams.data.type == 'report') {
      this.navCtrl.setRoot(HomePage);
    } else {
      this.navCtrl.setRoot(ComprehensivePage);
    }
  }

  ionViewWillLeave() {
    this.nextScreen();
  }

}
