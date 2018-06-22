import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Injectable } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { TranslateService } from '@ngx-translate/core';

import { PagesModalPage } from "../pages-modal/pages-modal";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { environment } from "../../environments/environment";
import { AbmChofer } from '../pages';
import { ContentPage } from '../content/content';
import { EncuestaChoferPage } from '../encuesta-chofer/encuesta-chofer';


@IonicPage()
@Component({
  selector: 'chofer-panel',
  templateUrl: 'chofer-panel.html',
})
export class ChoferPanelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Control Panel Page');
  }

  irEncuestaChofer() {
    //this.navCtrl.push(ContentPage); // escaner QR
    this.navCtrl.push(EncuestaChoferPage);
  }

  irVisorViajes() {
    this.navCtrl.push(ContentPage); // escaner QR
  }

}
