import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';

import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';
import { SettingsProvider } from './../providers/settings/settings';
import { SqliteStorageProvider } from '../providers/sqlite-storage/sqlite-storage';
import { NetworkProvider } from '../providers/network/network';
import { CONFIG } from '../config/config';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { QuizPage } from '../pages/quiz/quiz';
import { FaqPage } from '../pages/faq/faq';
import { AskQuestionPage } from '../pages/ask-question/ask-question';
import { SettingPage } from '../pages/setting/setting';
import { CompanionPage } from '../pages/companion/companion';
import { CancerPage } from '../pages/cancer/cancer';
import { GenelistPage } from '../pages/genelist/genelist';
import { GenedetailPage } from '../pages/genedetail/genedetail';
import { CompanionDetailPage } from '../pages/companion-detail/companion-detail';
import { WelcomePage } from '../pages/welcome/welcome';
import { PodcastDetailPage } from '../pages/podcast-detail/podcast-detail';
import { BriefSurveyPage } from '../pages/brief-survey/brief-survey';
import { PodcastPage } from '../pages/podcast/podcast';
import { ComprehensivePage } from '../pages/comprehensive/comprehensive';
import { VideoDetailPage } from '../pages/video-detail/video-detail';
//import { from } from 'rxjs/observable/from';

declare var cordova: any;
declare var window: any;
@Component({
  selector: 'page-app',
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  profile : any = {};
  userId = localStorage.getItem('UserId');
  selectedTheme: String;
  pages: Array<{ title: string, component: any, icon: any }>;
  sideMenu: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private events: Events,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    private fcm: FCM,
    private settings: SettingsProvider,
    public menu: MenuController,
    public sqlite: SqliteStorageProvider,
    public networkPro: NetworkProvider,
    private appVersion: AppVersion,
    private market: Market
  ) {
    this.sideMenu = "report";
    /*used for an example of ngFor and navigation*/
    this.pages = [
      { title: 'Home', component: WelcomePage, icon: "home.png" },
      { title: 'OmniSeq Report Card', component: HomePage, icon: "reportcard.png" },
      { title: 'Comprehensive', component: ComprehensivePage, icon: "comprehnsv.png" },
      { title: 'Call-de Brief Survey', component: BriefSurveyPage, icon: "survey.png" },
      { title: 'Podcast', component: PodcastPage, icon: "podcast.png" },
      { title: 'Settings', component: SettingPage, icon: "Settings.png" },
    ];

    this.events.subscribe("userProfile", () => {
      this.profileInfo();
    });
    this.events.subscribe("clearSession", () => {
      this.clearSession();
    });
    this.events.subscribe("logout", () => {
      this.logOut();
    });
    this.events.subscribe("sqliteStorage", () => {
      this.storeData();
    });
    this.events.subscribe("sideMenuBlog", (data) => {
      if (data == 'welcome') {
        this.pages = [
          { title: 'Home', component: WelcomePage, icon: "home.png" },
          { title: 'OmniSeq Report Card', component: HomePage, icon: "reportcard.png" },
          { title: 'Comprehensive', component: ComprehensivePage, icon: "comprehnsv.png" },
          { title: 'Call-de Brief Survey', component: BriefSurveyPage, icon: "survey.png" },
          { title: 'Podcast', component: PodcastPage, icon: "podcast.png" },
          { title: 'Settings', component: SettingPage, icon: "Settings.png" }
        ];
      } else if (data == 'report') {
        this.pages = [
          { title: 'Home', component: WelcomePage, icon: "home.png" },
          { title: 'OmniSeq / LabCorp', component: HomePage, icon: "menu-icon.png" },
          { title: 'Gene LookUp', component: GenelistPage, icon: "GeneLookup_sidemenu.png" },
          { title: 'Companion / Complementary Dx', component: CompanionPage, icon: "CancerImmuneCycle_sidemenu.png" },
          { title: 'Cancer Immune Cycle', component: CancerPage, icon: "Companion_ComplementaryDx_sidemenu.png" },
          { title: 'FAQ', component: FaqPage, icon: "FAQs_sidemenu.png" },
          { title: 'Ask a Question', component: AskQuestionPage, icon: "AskaQuestion_sidemenu.png" },
          { title: 'Quiz', component: QuizPage, icon: "QuizMe_sidemenu.png" },
          { title: 'Settings', component: SettingPage, icon: "Settings.png" },
        ];
      } else if (data == 'comprehnsive') {
        this.pages = [
          { title: 'Home', component: WelcomePage, icon: "home.png" },
          { title: 'Comprehensive', component: ComprehensivePage, icon: "comprehnsv.png" },
          { title: 'Comprehensive Gene LookUp', component: GenelistPage, icon: "GeneLookup_sidemenu.png" },
          { title: 'Companion / Complementary Dx', component: CompanionPage, icon: "CancerImmuneCycle_sidemenu.png" },
          { title: 'FAQ', component: FaqPage, icon: "FAQs_sidemenu.png" },
          { title: 'Ask a Question', component: AskQuestionPage, icon: "AskaQuestion_sidemenu.png" },
          { title: 'Quiz', component: QuizPage, icon: "QuizMe_sidemenu.png" },
          { title: 'Settings', component: SettingPage, icon: "Settings.png" },
        ];
      }
    });
    this.profile.email = '';
    if (this.userId) {
      if (this.networkPro.checkOnline() == true) {
        this.httpService.getData("user/checklogin").subscribe(data => {
          if (data.status == 200) {
            localStorage.setItem("UserId", data.data.user._id);
            localStorage.setItem("User", JSON.stringify(data.data.user));
            this.storeData();
            this.profileInfo();
            this.rootPage = WelcomePage;
          } else if (data.status == 203) {
            this.clearSession();
          } else {
            this.storeData();
          }
        }, error => {
          this.common.showToast(CONFIG.MESSAGES.SessionMsg);
          this.clearSession();
          console.log("Error=> ", error);
        });
      } else {
        this.storeData();
        this.profileInfo();
        this.rootPage = WelcomePage;
      }
    } else {
      this.rootPage = LoginPage;
    }

    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.checkFileWritePermission();
      this.push();
      this.checkVersion();
      this.trackGoogleAnalytics();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#1a5293');
      this.statusBar.overlaysWebView(false);
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // cordova.plugins.Keyboard.disableScroll(true);
      }
      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
        let view = this.nav.getActive();
        if (this.menu.isOpen()) {
          this.menu.close()
        } else if (view.component.name == 'QuizCongratulationPage') {
          this.nav.setRoot(HomePage);
        } else if (view.component.name == 'HomePage') {
          this.nav.setRoot(WelcomePage);
        } else if (view.component.name == 'ComprehensivePage') {
          this.nav.setRoot(WelcomePage);
        } else if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          const alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: 'Ok',
              handler: () => {
                this.platform.exitApp(); // Close this application
              }
            }]
          });
          alert.present();
        }
      });
    });
  }

  push() {
    /**Notification */
    if (this.platform.is('cordova')) {
      this.fcm.getToken().then(token => {
        localStorage.setItem("device_token", token);
      })

      this.fcm.onNotification().subscribe(data => {
        console.log("notification data", data)
        if (data.wasTapped) {
          switch (data.type) {
            case "new_gene":
              this.nav.push(GenedetailPage, { data: { '_id': data.id } });
              break;
            case "new_companion":
              this.nav.push(CompanionDetailPage, { id: data.id })
              break;
            case "new_genecomprehensive":
              this.nav.push(GenedetailPage, { data: { '_id': data.id }, type: 'comprehnsiveList' })
              break;
            case "new_episode":
              this.nav.push(PodcastDetailPage, { id: data.id })
              break;
            case "new_video":
              this.nav.push(VideoDetailPage, { id: data.id })
              break;
          }
        } else { }
      })
    } else {
      localStorage.setItem("device_token", "fTXe0lTVUSU:APA91bGGrbHYkcGTZrSM9mwUSa7XO6Yshm9NXpFPU70nnJ0QuPIfvVS-WjtvhEwsy5_bF6Fv15yu79t6tf-R6z_MVEpBQphU52jOuEvmho6FGCZiqKGUugbBkv6VkcChS3jF0oru36E6");
    }
  }

  checkVersion() {
    if (this.networkPro.checkOnline() == true) {
      if (this.platform.is('cordova')) {
        this.httpService.getData("user/getappversion").subscribe(data => {
          if (data.status == 200) {
            this.appVersion.getVersionNumber().then((val) => {
              const alert = this.alertCtrl.create({
                title: 'OmniSeq',
                message: "update available",
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      if (this.platform.is('ios')) {
                        this.market.open('com.healthcare.omniseq');
                        // window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://
                      } else if (this.platform.is('android')) {
                        // this.market.open('com.medikabazaar.app');
                        window.open('market://details?id=com.healtcare.omniseq');
                      }
                    }
                  }
                ]
              });
              if (this.platform.is('android')) {
                if (val !== data.data.android_play_store_version) {
                  alert.present();
                }
              } else if (this.platform.is('ios')) {
                if (val !== data.data.apple_itune_version) {
                  alert.present();
                }
              } else {
                alert.present();
              }
            });
          } else if (data.status == 203) {
            this.clearSession();
          } else {
            this.common.showToast(data.message);
          }
        }, error => {
          console.log("Error=> ", error);
        });
      }
    }
  }

  openPage(page) {
    if ((page.component == AskQuestionPage) || (page.component == QuizPage)) {
      if (this.networkPro.checkOnline() == true) {
        this.nav.push(page.component);
      } else {
        this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
      }
    } else if (page.title === "Home") {
      this.nav.setRoot(page.component);
    } else if (page.title === "OmniSeq / LabCorp") {
      this.nav.setRoot(page.component);
    } else if (page.title === "OmniSeq Report Card") {
      this.nav.setRoot(page.component);
    } else if (page.title === "Gene LookUp") {
      this.nav.push(page.component, { type: 'geneList' });
    } else if (page.title === "Comprehensive") {
      this.nav.setRoot(page.component);
    } else if (page.title === "Comprehensive Gene LookUp") {
      this.nav.push(page.component, { type: 'comprehnsiveList' });
    } else {
      this.nav.push(page.component);
    }
  }

  /**
   * Function using for clear application localstorage
   * Created: 08-Nov-2017
   * Create By: Jagdish Thakre
   */
  logOut() {
    if (this.networkPro.checkOnline() == true) {
      const alert = this.alertCtrl.create({
        title: 'Logout',
        message: "Are you sure, You want to logout!",
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.common.presentLoading();
              this.httpService.postData("user/applogout", {}).subscribe(data => {
                this.common.dismissLoading();
                if (data.status == 200 || data.status == 203) {
                  let device_token = localStorage.getItem("device_token");
                  localStorage.clear();
                  localStorage.setItem("device_token", device_token);
                  this.menu.enable(false, 'myMenu');
                  this.nav.setRoot(LoginPage);
                } else {
                  this.common.showToast(data.message);
                }
              }, error => {
                console.log("Error=> ", error);
                this.common.dismissLoading();
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    } else {
      this.common.showToast('Nerwork is not available!!');
    }
  }

  /**
  * Function using for get profile information
  * Created: 08-Nov-2017
  * Create By: Jagdish Thakre
  */
  profileInfo() {
    this.profile = JSON.parse(localStorage.getItem("User"));
  }

  /**Logout function for clear storage when session has been expired */
  clearSession() {
    this.common.logoutLoading();
    let device_token = localStorage.getItem("device_token");
    localStorage.clear();
    localStorage.setItem("device_token", device_token);
    this.common.dismissLoading();
    this.nav.setRoot(LoginPage);
  }

  /**
   * Function created for store data in local database
   * Created: 11-12-17
   * Created By: Jagdish Thakre
   */
  storeData() {
    this.sqlite.storeOfflineData();
  }

  /**Function created for file write permission
   * Created : 16 Feb 2018
   * Creator : Jagdish Thakre
   */
  checkFileWritePermission() {
    if (this.platform.is('cordova') && this.platform.is("android")) {
      let permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
        if (!status.hasPermission) {
          var errorCallback = function () {
            console.warn('Storage permission is not turned on');
            return false;
          }
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                console.log("you have permission");
                return true;
                // continue with downloading/ Accessing operation 
                // this.downloadfile();
              }
            },
            errorCallback);
        }
      }, null);
    } else { }
  }

  /**Function created for google analysis*/
  trackGoogleAnalytics(){
    if(this.userId){
      this.common.setUserId(this.profile.email);
    }
  }
}

