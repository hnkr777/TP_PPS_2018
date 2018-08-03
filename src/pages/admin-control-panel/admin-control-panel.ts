import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
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
import { AbmClientesPage } from '../abm-clientes/abm-clientes';
import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { AbmSupervisoresPage } from '../abm-supervisores/abm-supervisores';
import { VisorViajesPage } from '../visor-viajes/visor-viajes';
import { AbmVehiculosPage } from '../abm-vehiculos/abm-vehiculos';
import { LoginPage } from '../login/login';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { MyApp } from '../../app/app.component';
import { ThemeProvider } from '../../providers/theme/theme';


@IonicPage()
@Component({
  selector: 'admin-control-panel',
  templateUrl: 'admin-control-panel.html',
})
export class AdminControlPanelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public servicioAudio:ServicioAudioProvider,
    public platform: Platform,
    private themes: ThemeProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Control Panel Page');
    this.themes.refreshTheme();
  }

  irAbmChofer() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(AbmChofer);
  }

  irAbmCliente() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(AbmClientesPage);
  }

  irAbmSupervisor() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(AbmSupervisoresPage);
  }

  irVisorViajes() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(VisorViajesPage);
  }
  
  irAbmVehiculos() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(AbmVehiculosPage, {data:"Lista"});
  }

  pedirViaje() {
    this.servicioAudio.reproducirClick();
    this.navCtrl.push(NuevoViajePage);
  }
  logout(){
    this.servicioAudio.reproducirClick();
    sessionStorage.clear();
    localStorage.removeItem('usuario');
    this.platform.exitApp();
    this.navCtrl.setRoot(MyApp);
  }
}
