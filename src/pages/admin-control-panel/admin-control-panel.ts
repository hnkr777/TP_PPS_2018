import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'admin-control-panel',
  templateUrl: 'admin-control-panel.html',
})
export class AdminControlPanelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Control Panel Page');
  }

}
