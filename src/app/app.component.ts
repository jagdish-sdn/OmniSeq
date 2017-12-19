import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { AppVersion } from '@ionic-native/app-version';

import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';
import { SettingsProvider } from './../providers/settings/settings';
import { SqliteStorageProvider } from '../providers/sqlite-storage/sqlite-storage';
import { NetworkProvider } from '../providers/network/network';

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

declare var cordova: any;
declare var window: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  profile = {};
  userId = localStorage.getItem('UserId');
  selectedTheme: String;
  pages: Array<{ title: string, component: any, icon: any }>;

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
    private appVersion: AppVersion
  ) {
    if (this.userId) {
      if (this.networkPro.checkOnline() == true) {
        this.httpService.getData("user/checklogin").subscribe(data => {
          if (data.status == 200) {
            localStorage.setItem("UserId", data.data.user._id);
            localStorage.setItem("User", JSON.stringify(data.data.user));
            this.storeData();
            this.profileInfo();
            this.rootPage = HomePage;
          } else {
            this.events.publish("clearSession");
          }
        }, error => {
          console.log("Error=> ", error);
        });
      } else {
        this.storeData();
        this.profileInfo();
        this.rootPage = HomePage;
      }
    } else {
      this.rootPage = LoginPage;
    }

    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.statusBar.backgroundColorByHexString('#1a5293');
    this.initializeApp();

    /*used for an example of ngFor and navigation*/
    this.pages = [
      { title: 'OmniSeq / LabCorp', component: HomePage, icon: "menu-icon.png" },
      { title: 'Gene LookUp', component: GenelistPage, icon: "GeneLookup_sidemenu.png" },
      { title: 'Companion / Complementary Dx', component: CompanionPage, icon: "CancerImmuneCycle_sidemenu.png" },
      { title: 'Cancer Immune Cycle', component: CancerPage, icon: "Companion_ComplementaryDx_sidemenu.png" },
      { title: 'FAQ', component: FaqPage, icon: "FAQs_sidemenu.png" },
      { title: 'Ask a Question', component: AskQuestionPage, icon: "AskaQuestion_sidemenu.png" },
      { title: 'Quiz', component: QuizPage, icon: "QuizMe_sidemenu.png" },
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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.push();
      this.checkVersion();
      this.statusBar.styleDefault();
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);
      }
      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
        let view = this.nav.getActive();
        console.log(view.component.name);
        if (this.menu.isOpen()) {
          this.menu.close()
        } else if (view.component.name == 'QuizCongratulationPage') {
          this.nav.setRoot(HomePage);
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
        if (data.wasTapped) {
          switch (data.type) {
            case "new_gene":
              this.nav.push(GenedetailPage, { data: { '_id': data.id } });
              break;
            case "new_companion":
              this.nav.push(CompanionDetailPage, { id: data.id })
              break;
          }
        } else {}
      })
    } else {
      localStorage.setItem("device_token", "fTXe0lTVUSU:APA91bGGrbHYkcGTZrSM9mwUSa7XO6Yshm9NXpFPU70nnJ0QuPIfvVS-WjtvhEwsy5_bF6Fv15yu79t6tf-R6z_MVEpBQphU52jOuEvmho6FGCZiqKGUugbBkv6VkcChS3jF0oru36E6");
    }
  }

  checkVersion() {
    if (this.platform.is('cordova')) {
      const alert = this.alertCtrl.create({
        title: 'OmniSeq',
        message: "update available",
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              if (this.platform.is('ios')) {
                window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://
              } else if (this.platform.is('android')) {
                window.open('market://details?id=com.pluz.app');
              }
            }
          }
        ]
      });
      // this.httpService.postData("user/applogout", {}).subscribe(data => {
      //   if (data.status == 200) {
      //   } else {
      //     this.common.showToast(data.message);
      //   }
      // }, error => {
      //   console.log("Error=> ", error);
      // });
      this.appVersion.getVersionNumber().then((val) => {
        console.log("this.appVersion) ", val);
        if (val == "0.0.1") {
          alert.present();
        }
      });
    }
  }

  openPage(page) {
    if ((page.component == AskQuestionPage) || (page.component == QuizPage)) {
      if (this.networkPro.checkOnline() == true) {
        this.nav.push(page.component);
      } else {
        this.common.showToast('Nerwork is not available!!');
      }
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
}
