import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html',
})
export class AskQuestionPage {
  contactLength: number = 10;
  askQueForm: FormGroup;
  askQueOrderForm: FormGroup;
  askQueTechForm: FormGroup;
  submitAttempt: boolean = false;
  orderAttempt: boolean = false;
  techAttempt: boolean = false;
  shownGroup = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public formBuilder: FormBuilder,
    public events: Events
  ) {
    this.askQueForm = formBuilder.group({
      question: ['', Validators.compose([
        Validators.required
      ])
      ],
      phone: ['', Validators.compose([
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
    this.askQueOrderForm = formBuilder.group({
      question: ['', Validators.compose([
        Validators.required
      ])
      ],
      phone: ['', Validators.compose([
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
    this.askQueTechForm = formBuilder.group({
      question: ['', Validators.compose([
        Validators.required
      ])
      ],
      phone: ['', Validators.compose([
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
    this.shownGroup = 1;
  }

  ionViewDidLoad() {
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  askQuestion(){
    this.submitAttempt = true;
    this.askQueForm.value.question_type = "app";    
     
    if(!this.askQueForm.value.phone && (this.askQueForm.value.get_call_back)){
      this.common.showToast("Please enter phone no.");
      return false;
    }
    if(this.askQueForm.valid) {
      if(this.askQueForm.value.get_call_back) {
        this.askQueForm.value.get_call_back = "yes";
      } else {
        this.askQueForm.value.get_call_back = "no";
        this.askQueForm.value.phone = '';
      }
      this.addQuestion(this.askQueForm.value);
    }    
  }

  askOrderQuestion(){
    this.orderAttempt = true;
    this.askQueOrderForm.value.question_type = "order";    
     
    if(!this.askQueOrderForm.value.phone && (this.askQueOrderForm.value.get_call_back)){
      this.common.showToast("Please enter phone no.");
      return false;
    }
    if(this.askQueOrderForm.valid){
      if(this.askQueOrderForm.value.get_call_back) {
        this.askQueOrderForm.value.get_call_back = "yes";
      } else {
        this.askQueOrderForm.value.get_call_back = "no";
        this.askQueOrderForm.value.phone = '';
      }
      this.addQuestion(this.askQueOrderForm.value);    
    }    
  }

  askTechQuestion(){
    this.techAttempt = true;
    this.askQueTechForm.value.question_type = "technical";
    
    if(!this.askQueTechForm.value.phone && (this.askQueTechForm.value.get_call_back)){
      this.common.showToast("Please enter phone no.");
      return false;
    }
    if(this.askQueTechForm.valid){
      if(this.askQueTechForm.value.get_call_back) {
        this.askQueTechForm.value.get_call_back = "yes";
      } else {
        this.askQueTechForm.value.get_call_back = "no";
        this.askQueTechForm.value.phone = '';
      }
      this.addQuestion(this.askQueTechForm.value);
    }
  }
  
  addQuestion(formdata){
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.postData("query/send",formdata).subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          this.common.showToast(data.message);
        } else if(data.status == 203){
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      });
    }
  }
  
  public checkme(form){
    switch(form){
      case 'askQueOrderForm':
        if(this.askQueOrderForm.value.get_call_back) {
          this.askQueOrderForm.value.get_call_back = true;//"yes";
        } else {
          this.askQueOrderForm.value.get_call_back = false; //"no";
        }
      break;
      
      case 'askQueTechForm':
        if(this.askQueTechForm.value.get_call_back) {
          this.askQueTechForm.value.get_call_back = true;//"yes";
        } else {
          this.askQueTechForm.value.get_call_back = false;//"no";
        }
      break;

      case 'askQueForm':
        if(this.askQueForm.value.get_call_back) {
          this.askQueForm.value.get_call_back = true;
        } else {
          this.askQueForm.value.get_call_back = false;
        }
      break;
    }    
  }
}
