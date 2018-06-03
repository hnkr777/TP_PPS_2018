import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, DateTime } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { FirebaseObjectObservable,AngularFireDatabase } from 'angularfire2/database-deprecated';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { LoginPage } from "../../pages/login/login";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';

/*
  Generated class for the AbmClienteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AbmClienteProvider {

  cardItems: Array<any>;
  public cameraImage : String
  public imgs: string[];
  public opcion: number;
  private spinner;
  
  private coleccionTipadaFirebase: AngularFirestoreCollection<any>;
  private ListadoCreditosObservable: Observable<any[]>;

  constructor(public http: HttpClient,
    public storage: Storage,
    public modalCtrl: ModalController,
    private camera: Camera,
    private objFirebase: AngularFirestore,
   // private navCtrl: NavController
  ) {
    console.log('Hello AbmClienteProvider Provider');
    this.cardItems = new Array<any>();

  }

  Alta(cliente)
  {
    alert(" Entro al service");
    this.spin(true);
    this.objFirebase.collection<any>("usuarios").add(cliente)
    .then(ret => {
      this.spin(false);    
    })
    .catch( error => {
      this.spin(false);
      alert("ocurrio un error");
      console.error(error);
     // this.Modal('Error', 'Detalle: '+error);
    });
}


private spin(status: boolean) {
  if(this.spinner === undefined && status === true) {
    this.spinner = this.modalCtrl.create(SpinnerPage);
    this.spinner.present();
  } else if(this.spinner !== undefined && status === false) {
    this.spinner.dismiss();
    this.spinner = undefined;
  }
}


}
