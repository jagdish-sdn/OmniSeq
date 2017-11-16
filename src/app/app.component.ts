import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';
import { SettingsProvider } from './../providers/settings/settings';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { QuizPage } from '../pages/quiz/quiz';
import { FaqPage } from '../pages/faq/faq';
import { AskQuestionPage } from '../pages/ask-question/ask-question';
import { SettingPage } from '../pages/setting/setting';
import { CompanionPage } from '../pages/companion/companion';
import { CancerPage } from '../pages/cancer/cancer';
import { GenelistPage } from '../pages/genelist/genelist';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  profile = {};
  userId = localStorage.getItem('UserId');  
  selectedTheme: String;
  pages: Array<{title: string, component: any, icon:any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private events: Events,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    private fcm: FCM,
    private settings: SettingsProvider
  ) {
    if(this.userId) {
      this.profileInfo();
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.statusBar.backgroundColorByHexString('#1a5293');
    this.initializeApp();

    /* used for an example of ngFor and navigation*/
    this.pages = [
      { title: 'Dashboard', component: HomePage, icon: "menuicon.png" },      
      { title: 'Gene LookUp', component: GenelistPage, icon: "GeneLookup_sidemenu.png" },      
      { title: 'Companion / Complementary Dx', component: CompanionPage, icon: "CancerImmuneCycle_sidemenu.png" },      
      { title: 'Cancer Immune Cycle', component: CancerPage, icon: "Companion_ComplementaryDx_sidemenu.png" },      
      { title: 'Faq', component: FaqPage, icon: "FAQs_sidemenu.png" },
      { title: 'Ask a Question', component: AskQuestionPage, icon: "AskaQuestion_sidemenu.png" },
      { title: 'Quiz', component: QuizPage, icon: "QuizMe_sidemenu.png" },
      { title: 'Settings', component: SettingPage, icon: "Settings.png" },
    ];
    this.events.subscribe("userProfile",()=>{
        this.profileInfo();
    });
    this.events.subscribe("clearSession",()=>{
        this.clearSession();
    });
    this.events.subscribe("logout",()=>{
        this.logOut();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      /**Notification */
      if (!this.platform.is('cordova')) {
        this.fcm.subscribeToTopic('marketing');
        
        this.fcm.getToken().then(token=>{
          localStorage.setItem("device_token", token);
          console.log("Device Token", token)
          // backend.registerToken(token);
        })
        
        this.fcm.onNotification().subscribe(data=>{
          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        })
        
        this.fcm.onTokenRefresh().subscribe(token=>{
          // backend.registerToken(token);
        })
        
        this.fcm.unsubscribeFromTopic('marketing');
      } else {
        localStorage.setItem("device_token", "fTXe0lTVUSU:APA91bGGrbHYkcGTZrSM9mwUSa7XO6Yshm9NXpFPU70nnJ0QuPIfvVS-WjtvhEwsy5_bF6Fv15yu79t6tf-R6z_MVEpBQphU52jOuEvmho6FGCZiqKGUugbBkv6VkcChS3jF0oru36E6");
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

 /**
  * Function using for clear application localstorage
  * Created: 08-Nov-2017
  * Create By: Jagdish Thakre
  */
  logOut() {
    const alert = this.alertCtrl.create({
      title: 'Logout',
      message: "Are you sure, You want to logout!",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            // localStorage.clear();
            // this.nav.setRoot(LoginPage);
            this.common.presentLoading();
            this.httpService.postData("user/applogout", {}).subscribe(data => {
              this.common.dismissLoading();
              if(data.status == 200 || data.status == 203) {
                localStorage.clear();
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
    localStorage.clear();
    this.common.dismissLoading();
    this.nav.setRoot(LoginPage);    
  }
}
