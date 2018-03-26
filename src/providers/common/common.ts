/** Provider file created for use common function 
 * Created: 29-Oct-2017
 * Creator: Jagdish Thakre
*/
import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { AlertController, Platform, LoadingController, Gesture, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/map';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { CONFIG } from '../../config/config';

@Injectable()
export class CommonProvider {
  @ViewChild(Content) content: Content;
  @ViewChild('zoom') zoom: ElementRef;
  loading: any;
  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    public http: Http,
    public toast: Toast,
    public loadingCtrl: LoadingController,
    private ga: GoogleAnalytics
  ) {
  }

  /**
   * Function created for show toast message
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  showToast(message) {
    if (this.platform.is('cordova')) {
      this.toast.show(message, '5000', 'top').subscribe(
        toast => {
        }
      );
    } else {
      this.showAlert(message);
    }
  }
  /**
   * Function created for show alert message
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  /**
   * Function created for show loader bar
   * Created: 29-Oct-2017
   * Creator: Jagdish Thakre
   */
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

  logoutLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Session has been expired...'
    });  
    this.loading.present();
  }

  presentDownloading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait, Downloading is in progress...'
    });
  
    this.loading.present();
  }

  millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60);
    let seconds = parseInt((millis % 60).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  /**Function created for pinch zoom
   * Created : 28-Feb-2018
   * Created By: Jagdish Thakre
   */
  /**Pinch Zoom */
  public _pinchZoom(elm: HTMLElement, content: Content): void {
    const _gesture = new Gesture(elm);

    // max translate x = (container_width - element absolute_width)px
    // max translate y = (container_height - element absolute_height)px
    let ow = 0;
    let oh = 0;
    for (let i = 0; i < elm.children.length; i++) {
      let c = <HTMLElement>elm.children.item(i);
      ow = c.offsetWidth;
      oh += c.offsetHeight;
    }
    const original_x = content.contentWidth - ow;
    const original_y = content.contentHeight - oh;
    let max_x = original_x;
    let max_y = original_y;
    let min_x = 0;
    let min_y = 0;
    let x = 0;
    let y = 0;
    let last_x = 0;
    let last_y = 0;
    let scale = 1;
    let base = scale;
    
    _gesture.listen();
    _gesture.on('pan', onPan);
    _gesture.on('panend', onPanend);
    _gesture.on('pancancel', onPanend);
    _gesture.on('tap', onTap);
    _gesture.on('pinch', onPinch);
    _gesture.on('pinchend', onPinchend);
    _gesture.on('pinchcancel', onPinchend);

    function onPan(ev) {   
      setCoor(ev.deltaX, ev.deltaY);
      transform();
    }
    function onPanend() {
      // remembers previous position to continue panning.
      last_x = x;
      last_y = y;
    }
    function onTap(ev) {
      if (ev.tapCount === 2) {
        let reset = false;
        scale += .5;
        if (scale > 2) {
          scale = 1;
          reset = true;
        }
        setBounds();
        reset ? transform(max_x/2, max_y/2) : transform();
      }
    }
    function onPinch(ev) {
      // formula to append scale to new scale
      scale = base + (ev.scale * scale - scale)/scale

      setBounds();
      transform();
    }
    function onPinchend(ev) {
      if (scale > 4) {
        scale = 4;
      }
      if (scale < 0.5) {
        scale = 0.5;
      }
      // lets pinch know where the new base will start
      base = scale;
      setBounds();
      transform();
    }
    function setBounds() {
      // I am scaling the container not the elements
      // since container is fixed, the container scales from the middle, while the
      // content scales down and right, with the top and left of the container as boundaries
      // scaled = absolute width * scale - already set width divided by 2;
      let scaled_x = Math.ceil((elm.offsetWidth * scale - elm.offsetWidth) / 2);
      let scaled_y = Math.ceil((elm.offsetHeight * scale - elm.offsetHeight) / 2);
      // for max_x && max_y; adds the value relevant to their overflowed size
      let overflow_x = Math.ceil(original_x * scale - original_x); // returns negative
      let overflow_y = Math.ceil(oh * scale - oh);
      
      max_x = original_x - scaled_x + overflow_x;
      min_x = 0 + scaled_x;
      // remove added height from container
      max_y = original_y + scaled_y - overflow_y;
      min_y = 0 + scaled_y;

      setCoor(-scaled_x, scaled_y);
      // console.info(`x: ${x}, scaled_x: ${scaled_x}, y: ${y}, scaled_y: ${scaled_y}`)
    }
    function setCoor(xx: number, yy: number) {
      x = Math.min(Math.max((last_x + xx), max_x), min_x);
      y = Math.min(Math.max((last_y + yy), max_y), min_y);
    }
    // xx && yy are for resetting the position when the scale return to 1.
    function transform(xx?: number, yy?: number) {
      elm.style.webkitTransform = `translate3d(${xx || x}px, ${yy || y}px, 0) scale3d(${scale}, ${scale}, 1)`;
    }
  }

  /**Function created for set Google analytics track
   * Created : 15-03-18
   * Created By: Jagdish Thakre
  */
  trackPage(pageName){
    if(this.platform.is("cordova")){
      this.ga.startTrackerWithId(CONFIG.GoogleAnyId)
      .then(() => {
          this.ga.trackView(pageName);
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
    }
  }

  /**Function created for set userid on google analytics
   * created: 15-03-18
   * Created By: Jagdish Thakre
   */
  setUserId(userId){
    if(this.platform.is("cordova")){
      this.ga.startTrackerWithId(CONFIG.GoogleAnyId)
      .then(() => {
          this.ga.setUserId(userId);
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
    }
  }
}
