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
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';
import { VisorViajesChoferPage } from '../../pages/visor-viajes-chofer/visor-viajes-chofer';
import { Usuario } from '../../clases/usuario';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'chofer-panel',
  templateUrl: 'chofer-panel.html',
})
export class ChoferPanelPage {
  chofer: Usuario;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private servicioViajes: ServicioViajesProvider,
    private servUsuarios: ServicioUsuariosProvider
  ) {
    
    this.chofer = JSON.parse(sessionStorage.getItem('usuario'));
    if(this.chofer == undefined) {
      console.error('Error al cargar el usuario');
    }
    console.log('Estado: '+this.chofer.estado);
  }

  irCerrarSesion() {
    if(this.chofer.estado == 1) {
      this.chofer.estado = 0;
      this.cambiarEstadoChofer();
    }
  }
  
  cambiarEstadoChofer() {
    sessionStorage.setItem('usuario', JSON.stringify(this.chofer));
    this.servUsuarios.modificarUsuario(this.chofer);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Control Panel Page');
    this.chofer = JSON.parse(sessionStorage.getItem('usuario'));
  }

  irEncuestaChofer() {
    this.navCtrl.push(ContentPage, { data: 'encuesta_chofer'}); // para test en celular
    //this.navCtrl.push(EncuestaChoferPage); // para test en PC
  }

  irEmpezarATrabajar() {
    this.navCtrl.push(ContentPage, { data: 'chofer'}); // escaner QR
  }

  irVisorViajesParaChofer()
  {
    this.navCtrl.push(VisorViajesChoferPage);
  }

  logOut(){
    this.navCtrl.setRoot(LoginPage);
  }

}
