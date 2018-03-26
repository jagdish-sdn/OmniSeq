import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, Platform } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
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
  selector: 'page-video-detail',
  templateUrl: 'video-detail.html',
})
export class VideoDetailPage {
  showMe: boolean = false;
  videoDetail: any = {};
  isDownloaded: any = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private streamingMedia: StreamingMedia,
    public common: CommonProvider,
    public httpService: HttpServiceProvider,
    public events: Events,
    private transfer: FileTransfer,
    private file: File,
    public alertCtrl: AlertController,
    public platform: Platform,
    private storage: Storage,
    public networkPro: NetworkProvider
  ) {
    if (this.platform.is('cordova') && this.platform.is("android")) {
      let permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
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
    } else { }
    this.getVideoDetail();
    this.common.trackPage(CONFIG.GAnalyticsPageName.videoDetail);
  }

  startVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      // orientation: 'portrait'
    };

    this.streamingMedia.playVideo(this.videoDetail.src, options);
  }

  /**Function for get episode details
   * Created: 14-Nov-2017
   * Creatot: Jagdish Thakre
   */
  getVideoDetail() {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentLoading();
      this.httpService.getData("video/getById?id=" + this.navParams.data.id).subscribe(data => {
        if (data.status == 200) {
          this.videoDetail = data.data;
          let fileurl = this.videoDetail.src;
          let imgSplit = fileurl.split('/');
          let filename = imgSplit[imgSplit.length - 1];
          let target = '';
          if (this.platform.is("android")) {
            target = this.file.externalRootDirectory + 'OmniSeq/';
          } else if (this.platform.is("ios")) {
            target = this.file.documentsDirectory;
          } else {
            target = this.file.dataDirectory;
          }
          this.file.checkFile(target, filename).then((response) => {
            this.videoDetail.isDownloaded = true;
            this.videoDetail.src = target + filename;
          }, (error) => {
            this.videoDetail.src = fileurl;
            this.videoDetail.isDownloaded = false;
          })
          this.showMe = true;
        } else if (data.status == 203) {
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
      this.storage.get("videos").then((val) => {
        this.showMe = true;
        this.videoDetail = val.find((item: any) => { return item.id == this.navParams.data.id });
        if (this.videoDetail) {
          let fileurl = this.videoDetail.src;
          let imgSplit = fileurl.split('/');
          let filename = imgSplit[imgSplit.length - 1];
          let target = '';
          if (this.platform.is("android")) {
            target = this.file.externalRootDirectory + 'OmniSeq/';
          } else if (this.platform.is("ios")) {
            target = this.file.documentsDirectory;
          } else {
            target = this.file.dataDirectory;
          }
          this.file.checkFile(target, filename).then((response) => {
            this.videoDetail.isDownloaded = true;
            this.videoDetail.src = target + filename;
          }, (error) => {
            this.videoDetail.src = fileurl;
            this.videoDetail.isDownloaded = false;
          })
        }
      }, (error) => {
        // this.storage.set("videos", this.videos[i]);
      });
    }
  }

  millisToMinutesAndSeconds(msec) {
    return this.common.millisToMinutesAndSeconds(msec);
  }

  downloadfile(fileurl) {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentDownloading()
      const fileTransfer: FileTransferObject = this.transfer.create();
      let audImgSplit = this.videoDetail.art.split('/');
      let audImgfilename = audImgSplit[audImgSplit.length - 1];
      let target = '';
      if (this.platform.is("android")) {
        target = this.file.externalRootDirectory + 'OmniSeq/';
      } else if (this.platform.is("ios")) {
        target = this.file.documentsDirectory;
      } else {
        target = this.file.dataDirectory;
      }

      /**Image download start */
      fileTransfer.download(this.videoDetail.art, target + audImgfilename).then((entry) => {
        this.videoDetail.art = target + audImgfilename;
      }, (error) => {
      });
      /**Image download end */
      let imgSplit = fileurl.split('/');
      let filename = imgSplit[imgSplit.length - 1];
      fileTransfer.download(fileurl, target + filename).then((entry) => {
        this.common.dismissLoading()
        this.videoDetail.isDownloaded = true;
        this.videoDetail.src = target + filename;
        this.storage.get("videos").then((val) => {
          if (val == null) {
            val = [this.videoDetail];
          } else {
            val.push(this.videoDetail);
          }
          this.storage.set("videos", val);
        }, (error) => {
          // this.storage.set("videos", this.videoDetail);
        });
        this.common.showToast("Download successfully!")
      }, (error) => {
        console.log("Error ", error)
        this.videoDetail.isDownloaded = false;
        this.common.dismissLoading();
        this.common.showToast("Download Failed!");
      });
    }
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
              target = this.file.externalRootDirectory + 'OmniSeq/';
            } else if (this.platform.is("ios")) {
              target = this.file.documentsDirectory;
            } else {
              target = this.file.dataDirectory;
            }
            this.file.removeFile(target, filename).then((response) => {
              this.common.dismissLoading();
              this.storage.get("videos").then((val) => {
                for (let k = 0; k < val.length; k++) {
                  if (val[k].id == this.videoDetail.id) {
                    val.splice(k, 1);
                    this.storage.set("videos", val);
                  }
                }
                if (this.networkPro.checkOnline() == false) {
                  this.navCtrl.setRoot(WelcomePage);
                }
              }, (error) => {
                console.log("error in remove")
                this.common.showToast("error in remove");

              });
              this.videoDetail.isDownloaded = false;
              this.videoDetail.src = contentUrl;
            }, (error) => {
              this.videoDetail.src = fileurl;
              this.common.dismissLoading();
              this.videoDetail.isDownloaded = true;
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
