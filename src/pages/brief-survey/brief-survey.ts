import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { SettingsProvider } from './../../providers/settings/settings';
import { CONFIG } from '../../config/config';
import { WelcomePage } from "../welcome/welcome";

@Component({
  selector: 'page-brief-survey',
  templateUrl: 'brief-survey.html',
})
export class BriefSurveyPage {
  briffSurveyForm: FormGroup;
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
    private settings: SettingsProvider
  ) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val; this.toggleChecked(this.selectedTheme);
    });
    this.submitAttempt = false;
    this.briffSurveyForm = formBuilder.group({
      customer_name: ['', Validators.compose([
        Validators.maxLength(100),
        Validators.pattern(CONFIG.ValidExpr.lastname),
        Validators.required])
      ],
      role: ['', Validators.compose([Validators.required])],
      institution: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      diff_btw_therapy_nd_immuno: [false],
      perform: [false],
      asked_price_individually: [false],
      asked_price_combine: [false],
      insurance_coverage: [false],
      insurance_coverage_notes: ["", Validators.compose([Validators.required])],
      provided_feedback: [false],
      provided_feedback_notes: ["", Validators.compose([Validators.required])],
      clinic_trial_interess: [false],
      clinic_trial_interess_notes: ["", Validators.compose([Validators.required])],
      ruleout_report_chemotherapy: [false],
      ruleout_report_chemotherapy_notes: ["", Validators.compose([Validators.required])],
      ruleout_report_radiation: [false],
      ruleout_report_radiation_notes: ["", Validators.compose([Validators.required])],
      compared_test_to_competitors: [false],
      Competitor: [""],
      compared_test_to_competitors_notes: ["", Validators.compose([Validators.required])],
    });
    this.stateList();
    // this.briffSurveyForm.controls['Competitor'].patchValue('Foundation');
    this.briffSurveyForm.controls['role'].patchValue('Pathologist');

  }

  public submitSurvey() {
    this.submitAttempt = true;
    if (this.briffSurveyForm.valid) {
      if (this.networkPro.checkNetwork() == true) {
        this.common.presentLoading();
        this.httpService.postData("survey/add", this.briffSurveyForm.value).subscribe(data => {
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
          console.log("Error=> ", error);
          this.common.dismissLoading();
        });
      }
    }
  }

  public stateList() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      this.httpService.getData("state/getlist").subscribe(data => {
        this.common.dismissLoading();
        if (data.status == 200) {
          this.states = data.data;
          this.briffSurveyForm.controls['state'].patchValue(this.states[0]._id);
        } else if (data.status == 203) {
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
