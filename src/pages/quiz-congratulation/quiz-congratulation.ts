import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    let navparam = this.navParams.data;
    let points = navparam.correct_answer * 10;
    this.totalPoints = points + navparam.extra_points;
    this.message = '';
    this.message += points+" points("+ navparam.correct_answer +" out of "+navparam.totalQue+")";
    this.message += (navparam.extra_points != 0) ? " + "+navparam.extra_points+" points time bonus" : '';    
  }

  public nextScreen(){
    this.navCtrl.setRoot(HomePage)
  }

}
