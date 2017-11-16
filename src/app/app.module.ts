import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import { FCM } from '@ionic-native/fcm';
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPwdPage } from '../pages/forgot-pwd/forgot-pwd';
import { HomePage } from '../pages/home/home';
import { QuizPage } from '../pages/quiz/quiz';
import { FaqPage } from '../pages/faq/faq';
import { AskQuestionPage } from '../pages/ask-question/ask-question';
import { SettingPage } from '../pages/setting/setting';
import { CompanionPage } from '../pages/companion/companion';
import { CancerPage } from '../pages/cancer/cancer';
import { GenedetailPage } from '../pages/genedetail/genedetail';
import { GenelistPage } from '../pages/genelist/genelist';
import { ProfilePage } from '../pages/profile/profile';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { AboutusPage } from '../pages/aboutus/aboutus';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkProvider } from '../providers/network/network';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';
import { SettingsProvider } from './../providers/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ForgotPwdPage,
    HomePage,
    QuizPage,
    FaqPage,
    AskQuestionPage,
    SettingPage,
    CompanionPage,
    CancerPage,
    GenedetailPage,
    GenelistPage,
    ProfilePage,
    ChangePasswordPage,
    AboutusPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ForgotPwdPage,
    HomePage,
    QuizPage,
    FaqPage,
    AskQuestionPage,
    SettingPage,
    CompanionPage,
    CancerPage,
    GenedetailPage,
    GenelistPage,
    ProfilePage,
    ChangePasswordPage,
    AboutusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NetworkProvider,
    Network,
    HttpServiceProvider,
    CommonProvider,
    SettingsProvider,
    Toast,
    FCM,
    DatePicker
  ]
})
export class AppModule {}
