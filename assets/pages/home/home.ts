import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window: any;  
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public smses:any;
  constructor(public navCtrl: NavController) {
    
  }
  getSMS(){
    let filter = {
      box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      
      // following 4 filters should NOT be used together, they are OR relationship
      read : 0, // 0 for unread SMS, 1 for SMS already read
      // _id : 1234, // specify the msg id
      address : 'DM-NOTICE', // sender's phone number
      
      // following 2 filters can be used to list page up/down
      indexFrom : 0, // start from index 0
      maxCount : 1, // count of SMS to return each time
    };
    if(window.SMS) window.SMS.listSMS(filter,data=>{
        setTimeout(()=>{
            console.log(data);
            this.smses=data;
        },0)
 
    },error=>{
      console.log(error);
    });
  }

}
