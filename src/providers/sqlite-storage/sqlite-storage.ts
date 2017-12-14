import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NetworkProvider } from '../../providers/network/network';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CommonProvider } from '../../providers/common/common';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()
export class SqliteStorageProvider {

  constructor(
    private storage: Storage,
    public networkPro: NetworkProvider,
    public httpService: HttpServiceProvider,
    public common: CommonProvider,
    public events: Events,
    private transfer: FileTransfer, 
    private file: File
  ) {
    
  }

  /**
   * Function created for store total offline data in local database
   * Created: 11-12-2017
   * Created By: Jagdish Thakre
   */
  storeOfflineData(){
    this.storeGeneList();
    this.storeFaqList();
    this.storeCompanionList();
  }

  /**Function for get the total no of Gene/marker/Functions
   * Created: 11-12-2017
   * Creatot: Jagdish Thakre
   */
  storeGeneList() {
    if (this.networkPro.checkOnline() == true) {
      this.httpService.getData("gene/search").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('geneList', data.data);
        } else {
          this.storage.set('geneList', []);
        }       
      }, error => {
        console.log("Error=> ", error);
      });
    }
  }

  /**Function for get the total faq list
   * Created: 12-12-2017
   * Creatot: Jagdish Thakre
   */
  storeFaqList() {
    if (this.networkPro.checkOnline() == true) {
      this.httpService.getData("faq/getall").subscribe(data => {
        if (data.status == 200) {
          this.storage.set('faqList', data.data);
        } else{
          this.storage.set('faqList', []);
        }       
      }, error => {
        console.log("Error=> ", error);
      });
    }
  }

  /**Function for get the companion list
   * Created: 13-12-2017
   * Creatot: Jagdish Thakre
   */
  storeCompanionList() {
    if (this.networkPro.checkOnline() == true) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      this.httpService.getData("companion/getall").subscribe(data => {
        let tempArr = JSON.parse(JSON.stringify(data.data.data));
        if (data.status == 200) {
          for(let i=0; i<tempArr.length; i++){
            let imgSplit = tempArr[i].logo.split('/');
            let url = tempArr[i].logo;
            let filename = imgSplit[imgSplit.length - 1 ];
            tempArr[i].basename = filename;
            fileTransfer.download(url, this.file.dataDirectory + filename).then((entry) => {
            }, (error) => {
              console.log("image download error ", error);
              // handle error
            });
            if(i==(data.data.data.length - 1)) {
              console.log('companionList', tempArr);
              // setTimeout(() => {
                this.storage.set('companionList', tempArr);
              // }, 1000);              
            }
          }       
          
        } else{
          this.storage.set('companionList', []);
        }       
      }, error => {
        console.log("Error=> ", error);
      });
    }
  }

}
