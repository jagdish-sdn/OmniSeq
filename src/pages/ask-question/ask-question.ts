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
  questions = [
    { title: "Ask a question about an order", description: "Type 1 diabetes is an autoimmune disease in which the body’s immune system attacks and destroys the beta cells in the pancreas that make insulin." },
    { title: "Ask a technical question", description: "Multiple sclerosis (MS) is an autoimmune disease in which the body's immune system mistakenly attacks myelin, the fatty substance that surrounds and protects the nerve fibers in the central nervous system." },
    { title: "Ask a question about the app", description: "Crohn's disease and ulcerative colitis (UC), both also known as inflammatory bowel diseases (IBD), are autoimmune diseases in which the body's immune system attacks the intestines." }
  ];

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
        Validators.required,
        Validators.pattern('^[a-z0-9_.+-]+@[a-z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
      ],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
    this.askQueOrderForm = formBuilder.group({
      question: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9_.+-]+@[a-z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
      ],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
    this.askQueTechForm = formBuilder.group({
      question: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9_.+-]+@[a-z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
      ],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength),
      ])],
      get_call_back: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AskQuestionPage');
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
    
    if(this.askQueForm.value.get_call_back) {
      this.askQueForm.value.get_call_back = "yes";
    } else {
      this.askQueForm.value.get_call_back = "no";
    } 
    console.log("ask a question ", this.askQueForm);

    // if(!this.askQueForm.value.phone){
    //   this.common.showToast("Please enter phone no.");
    //   return false;
    // } else if(this.askQueForm.controls.phone.status == "INVALID") {
    //   this.common.showToast("Phone no should be 10 digits.");
    //   return false;
    // } else if(!this.askQueForm.value.question){
    //   this.common.showToast("Please enter question.");
    //   return false;
    // }
    if(this.askQueForm.valid)
    this.addQuestion(this.askQueForm.value);
  }

  askOrderQuestion(){
    this.orderAttempt = true;
    this.askQueOrderForm.value.question_type = "order";
    
    if(this.askQueOrderForm.value.get_call_back) {
      this.askQueOrderForm.value.get_call_back = "yes";
    } else {
      this.askQueOrderForm.value.get_call_back = "no";
    } 

    // if(!this.askQueOrderForm.value.phone){
    //   this.common.showToast("Please enter phone no.");
    //   return false;
    // } else if(this.askQueOrderForm.controls.phone.status == "INVALID") {
    //   this.common.showToast("Phone no should be 10 digits.");
    //   return false;
    // } else if(!this.askQueOrderForm.value.question){
    //   this.common.showToast("Please enter question.");
    //   return false;
    // }
    if(this.askQueOrderForm.valid)
    this.addQuestion(this.askQueOrderForm.value);    
  }

  askTechQuestion(){
    this.techAttempt = true;
    this.askQueTechForm.value.question_type = "technical";
    
    if(this.askQueTechForm.value.get_call_back) {
      this.askQueTechForm.value.get_call_back = "yes";
    } else {
      this.askQueTechForm.value.get_call_back = "no";
    } 

    // if(!this.askQueTechForm.value.phone){
    //   this.common.showToast("Please enter phone no.");
    //   return false;
    // } else if(this.askQueTechForm.controls.phone.status == "INVALID") {
    //   this.common.showToast("Phone no should be 10 digits.");
    //   return false;
    // } else if(!this.askQueTechForm.value.question){
    //   this.common.showToast("Please enter question.");
    //   return false;
    // }
    if(this.askQueTechForm.valid)
    this.addQuestion(this.askQueTechForm.value);
    
  }
  
  addQuestion(formdata){
    console.log("adding question")
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
}
