import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, Platform, AlertController } from 'ionic-angular';
import { ITrackConstraint } from 'ionic-audio';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../welcome/welcome';
import { CONFIG } from '../../config/config';

declare var cordova: any;
@Component({
  selector: 'page-podcast-detail',
  templateUrl: 'podcast-detail.html',
})
export class PodcastDetailPage {
  showMe: boolean = false;
  podDetail: any = {};
  trackPlay: boolean = false;
  inItTrack: boolean = false;
  myTracks: ITrackConstraint[];
  playlist: ITrackConstraint[] = [];
  isDownloaded: any = false;

  currentIndex: number = -1;
  currentTrack: ITrackConstraint;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    public httpService: HttpServiceProvider,
    public events: Events,
    private _cdRef: ChangeDetectorRef,
    private transfer: FileTransfer,
    private file: File,
    public alertCtrl: AlertController,
    public platform: Platform,
    private storage: Storage,
  ) {
    
    if (this.platform.is('cordova') && this.platform.is("android")) {
      let permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function(status){
        if (!status.hasPermission) {
          var errorCallback = function () {
            // console.warn('Storage permission is not turned on');
            return false;
          }
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (!status.hasPermission) {
                errorCallback();
              } else {
                // console.log("you have permission");
                return true;
                // continue with downloading/ Accessing operation 
                // this.downloadfile();
              }
            },
            errorCallback);
        }
      }, null);
    } else {}

    
    this.getEpisodeDetail();
    this.common.trackPage(CONFIG.GAnalyticsPageName.podcastDetail);
  }

  /**Function for get episode details
   * Created: 14-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getEpisodeDetail() {    
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("podcast/getEpisode?id="+this.navParams.data.id).subscribe(data => {        
        if (data.status == 200) {
          this.podDetail = data.data;
          this.myTracks = [data.data]
          let fileurl = this.podDetail.src;
          let imgSplit = fileurl.split('/');
          let filename = imgSplit[imgSplit.length - 1];
          let target = '';
          if (this.platform.is("android")) {
            target = this.file.externalRootDirectory + CONFIG.LocalDir;
          } else if (this.platform.is("ios")) {
            target = this.file.documentsDirectory;
          } else {
            target = this.file.dataDirectory;
          }
          this.file.checkFile(target, filename).then((response) => {
            this.podDetail.isDownloaded = true;
            this.podDetail.src = target + filename;
          }, (error) => {
            this.podDetail.src = fileurl;
            this.podDetail.isDownloaded = false;
          })
          this.showMe = true;
        } else if(data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
          this.showMe = true;
        }
        this.common.dismissLoading();
        this.showMe = true;
      }, error => {
        this.showMe = true;
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      });
    } else {
      this.storage.get("podcasts").then((val) => {
        this.showMe = true;
        this.podDetail = val.find((item:any) => { return item.id == this.navParams.data.id });
        this.myTracks = [this.podDetail];
      }, (error) => {
        // this.storage.set("podcasts", this.podcasts[i]);
      });
    }
  }

  add(track: ITrackConstraint) {
    this.playlist.push(track);
  }

  play(track: ITrackConstraint, index: number) {
    this.currentTrack = track;
    this.currentIndex = index;
  }

  next() {
    // if there is a next track on the list play it
    if (this.playlist.length > 0 && this.currentIndex >= 0 && this.currentIndex < this.playlist.length - 1) {
      let i = this.currentIndex + 1;
      let track = this.playlist[i];
      this.play(track, i);
      this._cdRef.detectChanges();  // needed to ensure UI update
    } else if (this.currentIndex == -1 && this.playlist.length > 0) {
      // if no track is playing then start with the first track on the list
      // this.play(this.playlist[0], 0);
    }
  }

  ionViewWillEnter(){
    if(localStorage.getItem("currentaudio") && localStorage.getItem("currentindex")){
      let currentPlay = JSON.parse(localStorage.getItem("currentaudio"));
      if(currentPlay.id == this.podDetail.id){
        this.play(currentPlay, 0);
        this.trackPlay = true;
      }      
    }
  }
  
  ionViewCanLeave() {
    if(this.trackPlay == true){
      document.getElementById('trackDId').click();
    }
  }

  onTrackFinished(track: any) {
    // this.next();
  }

  clear() {
    this.playlist = [];
  }

  playMe() {
    this.play(this.myTracks[0], 0);
  }

  playPauseSong() {
    this.trackPlay = !this.trackPlay;
  }

  /**
   * Function created for subscribe topic
   * Created: 12-Jan-2018
   * Creator: Jagdish Thakre
   */
  subscribe() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      let req = {user_id: localStorage.getItem("UserId"), topic_id: this.navParams.data.topic_id};
      this.httpService.postData('podcast/subscribetopic', req).subscribe(data => {
        if (data.status == 200) {
          this.common.dismissLoading();
          this.common.showToast(data.message);
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.dismissLoading();
          this.common.showToast(data.message);
        }
      }, error => {
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.ServerMsg);
      })
    }
  }

  /**Function created for download audio file
   * Created : 16-Feb-2018
   * Creator : Jagdish Thakre
   */
  downloadfile(fileurl) {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentDownloading()     
      const fileTransfer: FileTransferObject = this.transfer.create();
      let audImgSplit = this.podDetail.art.split('/');
      let audImgfilename = audImgSplit[audImgSplit.length - 1];
      let target = '';
      if (this.platform.is("android")) {
        target = this.file.externalRootDirectory + CONFIG.LocalDir;
      } else if (this.platform.is("ios")) {
        target = this.file.documentsDirectory;
      } else {
        target = this.file.dataDirectory;
      }
      
      /**Image download start */
      fileTransfer.download(this.podDetail.art, target + audImgfilename).then((entry) => {
        this.podDetail.art = target + audImgfilename;
      }, (error) => {
      });
      /**Image download end */
      let imgSplit = fileurl.split('/');
      let filename = imgSplit[imgSplit.length - 1];
      fileTransfer.download(fileurl, target + filename).then((entry) => {
        this.common.dismissLoading()
        this.podDetail.isDownloaded = true;
        this.podDetail.src = target+filename;
        this.storage.get("podcasts").then((val) => {
          if(val == null){
            val = [this.podDetail];
          } else {
            val.push(this.podDetail);
          }          
          this.storage.set("podcasts", val);          
        }, (error) => {
          // this.storage.set("podcasts", this.podDetail);
        });
        this.common.showToast(CONFIG.MESSAGES.DownloadSuccess)
      }, (error) => {
        this.podDetail.isDownloaded = false;
        this.common.dismissLoading();
        this.common.showToast(CONFIG.MESSAGES.DownloadFailed);
      });
    }
  }

  millisToMinutesAndSeconds(msec){
    return this.common.millisToMinutesAndSeconds(msec);
  }

  /**Function created for file downloaded or not
   * Cretaed : 19-Feb-2018
   * Creator : Jagdish Thakre
   */
  checkFiledDownloaded(fileurl){
    let imgSplit = fileurl.split('/');
    let filename = imgSplit[imgSplit.length - 1];
    let target = '';
    if (this.platform.is("android")) {
      target = this.file.externalRootDirectory + CONFIG.LocalDir;
    } else {
      target = this.file.documentsDirectory;
    }
    this.file.checkFile(target,filename).then((response) => {
      return true;
    }, (error) => {
      return false;
    })
  }

  deletefile(fileurl, contentUrl) {
    const alert = this.alertCtrl.create({
      title: 'Podcast',
      message: "Are you sure, You want to delete!",
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.common.presentDownloading()
            let imgSplit = fileurl.split('/');
            let filename = imgSplit[imgSplit.length - 1];
            let target = '';
            if (this.platform.is("android")) {
              target = this.file.externalRootDirectory + CONFIG.LocalDir;
            } else if (this.platform.is("ios")) {
              target = this.file.documentsDirectory;
            } else {
              target = this.file.dataDirectory;
            }
            this.file.removeFile(target, filename).then((response) => {
              this.common.dismissLoading();
              this.storage.get("podcasts").then((val) => {
                for(let k=0; k<val.length; k++){
                  if(val[k].id == this.podDetail.id){
                    val.splice(k, 1);
                    this.storage.set("podcasts", val);
                  }
                }
                if(this.networkPro.checkOnline() == false){
                    this.navCtrl.setRoot(WelcomePage);
                }
              }, (error) => {
                console.log("error in remove")
                this.common.showToast("error in remove");
                
              });
              this.podDetail.isDownloaded = false;
              this.podDetail.src = contentUrl;
            }, (error) => {
              this.podDetail.src = fileurl;
              this.common.dismissLoading();
              this.podDetail.isDownloaded = true;
            })
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

}
