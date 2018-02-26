import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { QuizCongratulationPage } from '../quiz-congratulation/quiz-congratulation';
import { CONFIG } from '../../config/config';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {
  queLimit: number = 5;
  queArr = [];
  currentIndex = 0;
  currentQue = {};
  selected: any;
  selectedItem: any = {};
  correctAns = 0;
  wrongAns = 0;
  timer: any;
  interval: any;
  extratPoints: any;
  ansSelected: boolean;
  contentType : any = 'report';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    public platform: Platform
  ) {

    if (this.navParams.data.type) {
      this.contentType = this.navParams.data.type;
    } else {}
    if (this.networkPro.checkOnline() == true) {
      this.getQuestions();
      this.timer = 10;
      this.extratPoints = 0;
      this.ansSelected = false;
    } else {
      this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
      this.navCtrl.push(HomePage);
    }
  }

  /**Function are useing for get quiz questions from server 
   * Created : 27-Nov-2017
   * Creator : Jagdish Thakre
  */
  getQuestions() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      let queryString = '?limit='+this.queLimit;
      if(this.contentType == 'report') {
        queryString += "&type="+1;
      } else {
        queryString += "&type="+2;
      }

      this.httpService.getData("quiz/getquiz" + queryString).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          this.queArr = data.data;
          this.countTime();
          this.currentQue = this.queArr[this.currentIndex];
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        this.common.dismissLoading();
      });
    }
  }

  countTime() {
    this.interval = setInterval(() => {
      if (this.timer != 0) {
        this.timer = this.timer - 1;
        if (this.timer == 0) {
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }

  answer(item) {
    this.ansSelected = true;
    // console.log("this.ansSelected = true;", this.ansSelected)
    if (!this.selectedItem._id) {
      this.selectedItem = item;
      if (this.selectedItem.correct_answer == true) {
        this.correctAns += 1;
        if (this.timer <= 10 || this.timer >= 9) {
          this.extratPoints += 2;
        } else if (this.timer <= 8 || this.timer >= 6) {
          this.extratPoints += 1.5;
        } else if (this.timer <= 5 || this.timer >= 1) {
          this.extratPoints += 1;
        }
      } else {
        this.wrongAns += 1;
      }
    }
  }

  nextQue() {
    this.ansSelected = false;
    this.selectedItem = {};
    if (this.queArr.length > (this.currentIndex + 1)) {
      if (this.timer != 0) {
        clearInterval(this.interval);
      }
      this.currentIndex += 1
      this.currentQue = this.queArr[this.currentIndex];
      this.timer = 10;
      this.countTime();
    } else {
      clearInterval(this.interval);
      this.currentQue = {};
      this.navCtrl.push(QuizCongratulationPage, { totalQue: this.queArr.length, correct_answer: this.correctAns, wrong: this.wrongAns, extra_points: this.extratPoints, type: this.contentType })
    }
  }

}
