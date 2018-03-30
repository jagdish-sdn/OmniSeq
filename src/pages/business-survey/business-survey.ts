import { Component } from '@angular/core';
import { NavController, Events, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { SettingsProvider } from './../../providers/settings/settings';
import { CONFIG } from '../../config/config';
import { WelcomePage } from "../welcome/welcome";

@Component({
  selector: 'page-business-survey',
  templateUrl: 'business-survey.html',
})
export class BusinessSurveyPage {
  contactLength: any;
  BussinessDevSurveyForm: FormGroup;
  submitAttempt: boolean;
  states: any = [];
  selectedTheme: String;
  nightmode: boolean;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private settings: SettingsProvider,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.contactLength = CONFIG.ValidExpr.contactLength;
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val; this.toggleChecked(this.selectedTheme);
    });
    this.submitAttempt = false;
    this.BussinessDevSurveyForm = formBuilder.group({
      contact_name: ['', 
        Validators.compose([
        Validators.maxLength(100),
        Validators.pattern(CONFIG.ValidExpr.lastname),
        Validators.required])
      ],
      clinic_type: ['', Validators.compose([Validators.required])],
      institution: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5)
      ])],
      phone: ['', Validators.compose([
      Validators.required,
      Validators.minLength(this.contactLength),
      Validators.maxLength(this.contactLength),
      Validators.pattern(CONFIG.ValidExpr.number)
      ])],
      type: [false],
      collaboration_type: ["", Validators.compose([Validators.required])],
      sample_type: [''],
      sample_count: [""],
      note: ["", Validators.compose([Validators.required])],
      type_of_work: [""],
      site_count: [""],
      type_of_tech: [""],
      type_of_work_req: [""],
    });
    this.BussinessDevSurveyForm.controls['collaboration_type'].patchValue('Academic');
  }

  public submitSurvey() {
    this.submitAttempt = true;
    if (this.BussinessDevSurveyForm.valid) {
      if(this.BussinessDevSurveyForm.value.collaboration_type == 'Academic'){
        if(this.BussinessDevSurveyForm.value.sample_type == ''){
          this.common.showToast("Please enter sample type");
          return false;
        }
        if(this.BussinessDevSurveyForm.value.sample_count == ''){
          this.common.showToast("Please enter sample count");
          return false;
        }
      }
      if(this.BussinessDevSurveyForm.value.collaboration_type == 'Pharma'){
        if(this.BussinessDevSurveyForm.value.type_of_work == ''){
          this.common.showToast("Please enter type of work");
          return false;
        } else {}
        if(this.BussinessDevSurveyForm.value.site_count == ''){
          this.common.showToast("Please enter site count");
          return false;
        } else {}
      }
      if(this.BussinessDevSurveyForm.value.collaboration_type == 'Industry'){
        if(this.BussinessDevSurveyForm.value.type_of_tech == ''){
          this.common.showToast("Please enter type of technology");
          return false;
        }
        if(this.BussinessDevSurveyForm.value.type_of_work_req == ''){
          this.common.showToast("Please enter type of work requested");
          return false;
        }
      }
      if (this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.httpService.postData("bizdevsurvey/add", this.BussinessDevSurveyForm.value).subscribe(data => {
          this.common.dismissLoading();
          if (data.status == 200) {
            this.common.showToast(data.message);
            this.navCtrl.setRoot(WelcomePage);
          } else if (data.status == 203) {
            this.events.publish("clearSession");
          } else {
            this.common.showToast(data.message);
          }
        }, error => {          
          this.common.dismissLoading();
          this.common.showToast(CONFIG.MESSAGES.ServerMsg);
        });
      } else {}
    }
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'dark-theme') {
      this.settings.setActiveTheme('blue-theme');
      this.toggleChecked('blue-theme');
    } else {
      this.settings.setActiveTheme('dark-theme');
      this.toggleChecked('dark-theme');
    }
  }

  toggleChecked(selectedTheme) {
    if (selectedTheme == 'dark-theme') {
      this.nightmode = true;
    } else {
      this.nightmode = false;
    }
  }
}
