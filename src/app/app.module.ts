import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import { FCM } from '@ionic-native/fcm';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';

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
import { CompanionDetailPage } from '../pages/companion-detail/companion-detail';
import { QuizCongratulationPage } from '../pages/quiz-congratulation/quiz-congratulation';
import { NotificationsPage } from '../pages/notifications/notifications';
import { WelcomePage } from '../pages/welcome/welcome';
import { ComprehensivePage } from '../pages/comprehensive/comprehensive';
import { BriefSurveyPage } from '../pages/brief-survey/brief-survey';
import { PodcastPage } from '../pages/podcast/podcast';
import { PodcastTopicPage } from '../pages/podcast-topic/podcast-topic';
import { PodcastDetailPage } from '../pages/podcast-detail/podcast-detail';
import { BusinessSurveyPage } from '../pages/business-survey/business-survey';
import { VideosPage } from '../pages/videos/videos';
import { VideoDetailPage } from '../pages/video-detail/video-detail';
import { CompTypePage } from '../pages/comp-type/comp-type';
import { CancertypePage } from '../pages/cancertype/cancertype';
import { HistologyPage } from '../pages/histology/histology';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkProvider } from '../providers/network/network';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';
import { SettingsProvider } from './../providers/settings/settings';
import { SqliteStorageProvider } from '../providers/sqlite-storage/sqlite-storage';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ZoomAreaModule } from 'ionic2-zoom-area';

import { IonicAudioModule, WebAudioProvider, CordovaMediaProvider, defaultAudioProviderFactory } from 'ionic-audio';
/**
 * Sample custom factory function to use with ionic-audio
 */
export function myCustomAudioProviderFactory() {
  return (window.hasOwnProperty('cordova')) ? new CordovaMediaProvider() : new WebAudioProvider();
}
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
    AboutusPage,
    CompanionDetailPage,
    QuizCongratulationPage,
    NotificationsPage,
    WelcomePage,
    ComprehensivePage,
    BriefSurveyPage,
    PodcastPage,
    PodcastTopicPage,
    PodcastDetailPage,
    BusinessSurveyPage,
    VideosPage,
    VideoDetailPage,
    CompTypePage,
    CancertypePage,
    HistologyPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    // BrowserAnimationsModule,
    // ZoomAreaModule,
    IonicModule.forRoot(MyApp, {backButtonText: ' '}),
    IonicAudioModule.forRoot(defaultAudioProviderFactory), 
    IonicStorageModule.forRoot({
      name: '__omnidb',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    })
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
    AboutusPage,
    CompanionDetailPage,
    QuizCongratulationPage,
    NotificationsPage,
    WelcomePage,
    ComprehensivePage,
    BriefSurveyPage,
    PodcastPage,
    PodcastTopicPage,
    PodcastDetailPage,
    BusinessSurveyPage,
    VideosPage,
    VideoDetailPage,
    CompTypePage,
    CancertypePage,
    HistologyPage
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
    Camera,
    SqliteStorageProvider,
    FileTransfer,
    File,
    AppVersion,
    Market,
    IonicAudioModule,
    StreamingMedia,
    GoogleAnalytics,
    // ZoomAreaModule,
  ]
})
export class AppModule {}

