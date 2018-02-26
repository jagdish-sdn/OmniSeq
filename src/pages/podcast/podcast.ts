import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Events, Platform, AlertController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { CommonProvider } from '../../providers/common/common';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

import { AudioProvider, ITrackConstraint } from 'ionic-audio';
import { PodcastDetailPage } from '../podcast-detail/podcast-detail';

declare var cordova: any;

@Component({
  selector: 'page-podcast',
  templateUrl: 'podcast.html',
})
export class PodcastPage {
  topicDetail: any = {};
  searchText: any = {};
  podcasts: any = [];
  pageTitel: any;
  page = 1;
  limit = 10;
  totalRecords: any = 0;
  showMe;
  currentPlay: any = {};
  trackPlay: boolean = false;
  inItTrack: boolean = false;

  myTracks: ITrackConstraint[] = [];
  playlist: ITrackConstraint[] = [];

  currentIndex: number = -1;
  currentTrack: ITrackConstraint;
  selectedTrack: any = 0;
  allTracks: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public networkPro: NetworkProvider,
    public common: CommonProvider,
    public httpService: HttpServiceProvider,
    public events: Events,
    private _cdRef: ChangeDetectorRef,
    private _audioProvider: AudioProvider,
    private transfer: FileTransfer,
    private file: File,
    public platform: Platform,
    public alertCtrl: AlertController,
    private storage: Storage,
  ) {

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

    // this.podcastList('');
  }

  ionViewWillEnter() {
    this.showMe = "";
    this.page = 1;
    this.myTracks = [];
    this.podcasts = [];
    this.podcastList('');
    let current = localStorage.getItem("currentaudio");
    let trackp = localStorage.getItem("trackplay") ? JSON.parse(localStorage.getItem("trackplay")) : null;
    if ((current || current != null || current != undefined) && (trackp == true)) {
      this.currentPlay = JSON.parse(localStorage.getItem("currentaudio"));
      this.trackPlay = JSON.parse(localStorage.getItem("trackplay"));
    }
  }

  ionViewCanLeave() {
    if (this.trackPlay == true) {
      document.getElementById('yourId').click();
    }
    if (localStorage.getItem("currentaudio") && localStorage.getItem("trackplay")) {
      this.saveCurrent();
    }
  }

  /**Function for get faq list from server 
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   * */
  public podcastList(q) {
    if (this.networkPro.checkOnline() == true) {
      if (this.page == 1) {
        this.common.presentLoading();
      }
      let queryString = "?limit=" + this.limit + "&page=" + this.page;
      if (q != '') {
        queryString += "&title=" + q;
      }
      this.httpService.getData("podcast/getEpisodes" + queryString).subscribe(data => {
        if (data.status == 200) {
          this.totalRecords = parseInt(data.data.total_count);
          this.podcasts = [];
          this.myTracks = [];
          for (let i = 0; i < data.data.data.length; i++) {
            data.data.data[i].isPlaying = false;
            let fileurl = data.data.data[i].src;
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
              data.data.data[i].isDownloaded = true;
              data.data.data[i].src = target + filename;
            }, (error) => {
              data.data.data[i].src = fileurl;
              data.data.data[i].isDownloaded = false;
            })
            this.myTracks.push(data.data.data[i]);
            this.podcasts.push(data.data.data[i]);
          }
          if (data.data.data.length > 0) {
            this.currentPlay = this.myTracks[0];
          }
          // this.common.dismissLoading();
          console.log("mytracks files", this.myTracks);
          if (data.data.data.length > 0) {
            this.page += 1;
          }
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.showToast(data.message);
          if (this.page == 1) {
            // this.common.dismissLoading();
          }
        }
        this.common.dismissLoading();
        this.showMe = "show";
      }, error => {
        console.log("Error=> ", error);
        this.showMe = "show";
        if (this.page == 1) {
          this.common.dismissLoading();
        }
      });
    } else {
      this.storage.get("podcasts").then((val) => {
        this.showMe = "show";
        let temparr = val;
        if (q == '') {
          this.podcasts = val;
          this.myTracks = val;
          if(this.trackPlay == true){
            document.getElementById('yourId').click();
          }
          this.currentPlay = this.myTracks[0];
        } else {
          if (!q) {
            this.podcasts = Object.assign([], temparr);
            this.myTracks = Object.assign([], temparr);
            this.currentPlay = {};
          } else {
            this.podcasts = Object.assign([], temparr).filter(
              item => {
                if (item.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                  return true;
                }
              })
            this.myTracks = Object.assign([], temparr).filter(
              item => {
                if (item.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                  return true;
                }
            })
          }
        }
        console.log("mytracks files", this.myTracks);
      }, (error) => {
        // this.storage.set("podcasts", this.podcasts[i]);
      });
    }
  }

  checkPlay(currentTrack, index) {
    if (this.podcasts[index].isDownloaded == true) {
      this.play(currentTrack, index);
      // this.podcasts[index].isPlaying = true;
      this.checkPlayPause(index, true);
      this.playAudio(index);
      this.inItTrack = true;
    } else {
      if (this.networkPro.checkOnline() == true) {
        this.play(currentTrack, index);
        // this.podcasts[index].isPlaying = true;
        this.checkPlayPause(index, true);
        this.playAudio(index);
        this.inItTrack = true;
      } else {
        this.common.showToast("You can't play!");
      }
    }
    console.log("pod ", this.podcasts);
  }

  pauseaudio(podcast, index) {
    // this.podcasts[index].isPlaying = false;
    this.checkPlayPause(index, false);
    this.playPauseSong();
    document.getElementById('yourId').click();
  }

  checkPlayPause(index, type) {
    for (let i = 0; i < this.podcasts.length; i++) {
      if (i == index) {
        this.podcasts[i].isPlaying = type;
      } else if (type !== false) {
        this.podcasts[i].isPlaying = !type;
      }
    }
  }

  playPauseSong() {
    console.log("play status");
    this.trackPlay = !this.trackPlay;
  }

  playAudio(index) {
    this.selectedTrack = index;
    this.currentPlay = this.myTracks[index];
    this.trackPlay = true;
  }

  /**Function for podcast list infinite scrolling
   * Created : 17-Nov-2017
   * Creator : Jagdish Thakre
   */
  doInfinite(infiniteScroll) {
    this.podcastList('');
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

  /**Funcion for redirect on podcast detail page */
  goToPodcastDetail(item) {
    // if (this.networkPro.checkOnline() == true) {
    if (this.trackPlay == true) {
      document.getElementById('yourId').click();
    }
    // this.pauseSelectedTrack();
    this.navCtrl.push(PodcastDetailPage, { id: item.id });
    // } else {
    //   this.common.showToast(CONFIG.MESSAGES.NetworkMsg);
    // }
  }

  /**Audio Player functionality start*/
  add(track: ITrackConstraint) {
    this.playlist.push(track);
  }

  play(track: ITrackConstraint, index: number) {
    this.currentTrack = track;
    this.currentIndex = index;
    this.saveCurrent();
  }

  saveCurrent() {
    localStorage.setItem('currentaudio', JSON.stringify(this.currentTrack));
    localStorage.setItem('trackplay', JSON.stringify(this.trackPlay));
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

  onTrackFinished(track: any) {
    this.trackPlay = !this.trackPlay;
    this.inItTrack = true;
    console.log("this.trackPlay ", this.trackPlay);
    // this.next();
  }

  playMe() {
    this.play(this.myTracks[0], 0);
  }

  ngAfterContentInit() {
    // get all tracks managed by AudioProvider so we can control playback via the API
    this.allTracks = this._audioProvider.tracks;
  }

  pauseSelectedTrack() {
    // use AudioProvider to control selected track
    if (this._audioProvider.tracks[0].id) {
      this._audioProvider.pause(this._audioProvider.tracks[0].id);
    }
  }

  playSelectedTrack(plays) {
    this.currentPlay = plays;
    // use AudioProvider to control selected track 
    this._audioProvider.play(plays.id);
  }

  /**
   * Function created for subscribe topic
   * Created: 12-Jan-2018
   * Creator: Jagdish Thakre
  */
  subscribe() {
    if (this.networkPro.checkNetwork() == true) {
      this.common.presentLoading();
      let req = { user_id: localStorage.getItem("UserId"), topic_id: this.navParams.data.topic_id, status: (this.topicDetail.is_subscribe == false) ? 1 : 0 };

      this.httpService.postData('podcast/subscribetopic', req).subscribe(data => {
        if (data.status == 200) {
          this.common.dismissLoading();
          this.topicDetail.is_subscribe = (req.status == 0) ? false : true;
          this.common.showToast(data.message);
        } else if (data.status == 203) {
          this.events.publish("clearSession");
        } else {
          this.common.dismissLoading();
          this.common.showToast(data.message);
        }
      }, error => {
        console.log("Error=> ", error);
        this.common.dismissLoading();
      })
    }
  }

  /**Function created for podcast episode search
   * Created : 13-Feb-2018
   * Creator : Jagdish Thakre
  */
  searchepisode(q) {
    this.page = 1;
    this.podcastList(q);
  }

  /**Function created for download audio file
   * Created : 16-Feb-2018
   * Creator : Jagdish Thakre
  */
  downloadfile(fileurl, i) {
    if (this.networkPro.checkOnline() == true) {
      this.common.presentDownloading()
      const fileTransfer: FileTransferObject = this.transfer.create();
      let audImgSplit = this.podcasts[i].art.split('/');
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
      fileTransfer.download(this.podcasts[i].art, target + audImgfilename).then((entry) => {
        if (this.platform.is("ios")) {
          let imgsrc = target + audImgfilename;
          this.podcasts[i].art = imgsrc.replace(/^file:\/\//, '');
        } else {
          this.podcasts[i].art = target + audImgfilename;
        }
      }, (error) => {
      });
      /**Image download end */
      let imgSplit = fileurl.split('/');
      let filename = imgSplit[imgSplit.length - 1];

      fileTransfer.download(fileurl, target + filename).then((entry) => {
        this.common.dismissLoading();
        this.podcasts[i].isDownloaded = true;
        if (this.platform.is("ios")) {
          let audsrc = target + filename;
          this.podcasts[i].src = audsrc.replace(/^file:\/\//, '');
        } else {
          this.podcasts[i].src = target + filename;
        }
        this.common.showToast("Download successfully!");

        this.storage.get("podcasts").then((val) => {
          if (val == null) {
            val = [this.podcasts[i]];
          } else {
            val.push(this.podcasts[i]);
          }
          this.storage.set("podcasts", val);

        }, (error) => {
          // this.storage.set("podcasts", this.podcasts[i]);
        });
      }, (error) => {
        this.podcasts[i].src = fileurl;
        this.common.dismissLoading();
        this.common.showToast("Download Failed!");
      });
    }
  }

  /**Function created for file downloaded or not
   * Cretaed : 19-Feb-2018
   * Creator : Jagdish Thakre
   */
  checkFiledDownloaded(fileurl) {
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
      console.log("status check", response);
      return "green";
    }, (error) => {
      return "blue";
    })
  }

  deletefile(fileurl, i, contentUrl) {
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
              this.podcasts[i].isDownloaded = false;
              this.podcasts[i].src = contentUrl;
              this.storage.get("podcasts").then((val) => {
                for (let k = 0; k < val.length; k++) {
                  if (val[k].id == this.podcasts[i].id) {
                    val.splice(k, 1);
                    this.storage.set("podcasts", val);
                  }
                }
                if (this.networkPro.checkOnline() == false) {
                  for (let l = 0; l < this.podcasts.length; l++) {
                    if (this.podcasts[l].id == this.podcasts[i].id) {
                      this.podcasts.splice(l, 1);
                      this.storage.get("podcasts").then((curval) => {
                        console.log("currentplay ", curval)
                        // if(curval != null){
                        this.currentPlay = curval[0];
                        // }
                      });
                    }
                    if (this.currentPlay.id == this.podcasts[l].id) {
                      if (this.trackPlay == true) {
                        document.getElementById('yourId').click();
                      }
                    }
                  }
                }
              }, (error) => {
                console.log("error in remove")
              });
            }, (error) => {
              this.common.dismissLoading();
              this.podcasts[i].src = fileurl;
              this.podcasts[i].isDownloaded = true;
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

  millisToMinutesAndSeconds(msec) {
    return this.common.millisToMinutesAndSeconds(msec);
  }
}
