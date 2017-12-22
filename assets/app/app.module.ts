import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { Toast } from '@ionic-native/toast';

import { NetworkProvider } from '../providers/network/network';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { CommonProvider } from '../providers/common/common';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { OtpPage } from '../pages/otp/otp';
import { SignupPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    OtpPage,
    SignupPage,
    HomePage,
    ListPage
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
    OtpPage,
    SignupPage,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    Toast,
    NetworkProvider,
    HttpServiceProvider,
    CommonProvider
  ]
})
export class AppModule {}
