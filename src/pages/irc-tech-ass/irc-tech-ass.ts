import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, MenuController } from 'ionic-angular';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-irc-tech-ass',
  templateUrl: 'irc-tech-ass.html',
})
export class IrcTechAssPage {
  @ViewChild(Content) content: Content;
  headerTxt: any = "Immune Report Card Comprehensive Immune Profiling (CIP) Medical Diagnostic Dossier";
  footerTxt: any = "OmniSeq, Inc., Proprietary and Confidential – Not for Distribution (DRAFT 3/22/2018)";
  next_index = 0;
  indexes;
  prev_index = 0;
  public scrollAmount = 0;
  topShow: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
  }

  scrollHandler(event) {
    // console.log('ScrollEvent:', event)
    if(event.scrollTop >900 ){
      this.topShow = true;
    } else {
      this.topShow = false;
    }
    this.zone.run(() => {
      // since scrollAmount is data-binded,
      // the update needs to happen in zone
      this.scrollAmount++
    })
  }

  search(txt) {
    // $("#find").on('click', function () {
    // if (txt) {
      this.prev_index = 0;
      this.next_index = 0;
      let span = $("#Test").find('span');
      if ($(span).length) {
        $(span).contents().unwrap();
      }
      let find = txt;//$("#find_me").val();
      console.log(find);
      let text = $("#Test").text();
      let rg = new RegExp(find, "g");
      let indexes = text.match(rg);
      $("#Test").html(function (_, html) {
        return html.replace(rg, '<span class="red">' + find + '</span>');
      });
    // }
    // });
    // $("#next").on('click', function () {
    //   $("body").find('span.red').eq(this.prev_index).removeClass('selected');
    //   if (this.prev_index > 0) {
    //     this.next_index = this.prev_index + 1;
    //     this.prev_index = -1;
    //   } else if (this.next_index > this.indexes.length - 1) {
    //     this.next_index = 0;
    //   }
    //   console.log(this.next_index);
    //   $("body").find('span.red').eq(this.next_index - 1).removeClass('selected');
    //   $("body").find('span.red').eq(this.next_index).addClass('selected');
    //   this.next_index++;
    // });

    // $("#prev").on('click', function () {
    //   $("body").find('span.red').eq(this.next_index).removeClass('selected');
    //   if (this.next_index > 0) {
    //     this.prev_index = this.next_index - 1;
    //     this.next_index = -1;
    //   } else if (this.prev_index < 0) {
    //     this.prev_index = this.indexes.length - 1;
    //   }
    //   console.log(this.prev_index);

    //   this.prev_index--;

    //   $("body").find('span.red').eq(this.prev_index + 1).removeClass('selected');
    //   $("body").find('span.red').eq(this.prev_index).addClass('selected');

    // });
  }

  scrollToTop() {
    this.content.scrollToTop();
  }
}
