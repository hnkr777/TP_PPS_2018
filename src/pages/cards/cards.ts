
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, DateTime } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../tabs/tabs';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';

import { Usuario } from '../../clases/usuario';
import { ArchivoPost } from '../../clases/ArchivoPost';
import { PagesModalPage } from "../pages-modal/pages-modal";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { environment } from "../../environments/environment";
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {

  cardItems: Array<any>;
  public cameraImage : String
  public imgs: string[];
  nombreSala: string[] = ["Cosas Lindas", "Cosas Feas"];
  public opcion: number;
  private spinner;
  public usuario: Usuario;
  private usuarios: Array<Usuario>;
  private coleccionTipadaFirebase: AngularFirestoreCollection<ArchivoPost>;
  private ListadoCreditosObservable: Observable<ArchivoPost[]>;

  constructor (
    public storage: Storage,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private camera: Camera,
    private objFirebase: AngularFirestore,
    public navParams: NavParams,
    public themes: ThemeProvider
  ) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.cardItems = new Array<any>();
      this.opcion = navParams.get('opcion');
      this.cargarUsuarios();
  }

  cargarUsuarios() {
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>('usuarios', ref => ref.orderBy('id','asc'));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    let ob = ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo Usuarios: ", x);
      this.usuarios = x;
      ob.unsubscribe();
    });
  }

  Modal(titulo: string, data: any) {
    this.modalCtrl.create(PagesModalPage, { titulo: titulo, data: data }).present();
  }
  
  ionViewDidLoad() {
    this.themes.refreshTheme();
  }

  ngOnInit() {
    this.traerArchivoPost();
  }

  cargarPosts(post: ArchivoPost) {
    this.getImageURL(post.path).then(data => { // console.log(JSON.stringify(data));
      let fecha = new Date(post.fecha);

      this.cardItems.push(
        {
          user: {
            avatar: data.toString(),
            name: this.usuarios[post.usuario_id-1].nombre
          },
          date: fecha.toLocaleString(),
          image: data.toString(),
          profile: this.usuarios[post.usuario_id-1].perfil,
          id: post.usuario_id
        }
      );
    }).catch(er => { console.log('Error:'+ JSON.stringify(er));});
  }

  guardarArchivoPost(): string {
    this.spin(true);
    let ruta: string = this.nombreSala[this.opcion-1]; // environment.firebase.storageBucket
    let nuevo: ArchivoPost;
    nuevo = new ArchivoPost(ruta, this.usuario.id);
    let objetoJsonGenerico = nuevo.dameJSON();
    this.objFirebase.collection<ArchivoPost>(this.nombreSala[this.opcion-1]).add(objetoJsonGenerico)
    .then(ret => {
      console.log(`id= ${ret.id} ,  path= ${ret.path}`);
      //this.traerArchivoPost();
      this.spin(false);
    })
    .catch( error => {
      this.spin(false);
      console.error(error);
      this.Modal('Error', 'Detalle: '+error);
    });
    return nuevo.path; // devuelvo la ruta completa mientras la llamada asincrónica guarda el valor en la tabla de referencia de indices
  }
  
  traerArchivoPost() {
    this.spin(true);
    //this.cardItems = new Array<any>();
    this.coleccionTipadaFirebase = this.objFirebase.collection<ArchivoPost>(this.nombreSala[this.opcion-1], ref => ref.orderBy('fecha', 'desc') );
    this.ListadoCreditosObservable = this.coleccionTipadaFirebase.valueChanges();
    let handler = this.ListadoCreditosObservable.subscribe(arr => {
      console.info("Conexión correcta con Firebase: Post con imagen de los usuarios", arr);
      this.cardItems = new Array<any>();
      arr.forEach((x: ArchivoPost) => {
        this.cargarPosts(x);
      });
      //handler.unsubscribe();
      this.spin(false);
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    
    this.savePhoto(options);
  }

  addLibraryPhoto () {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    
    this.savePhoto(options);
  }

  savePhoto (options) {
      this.camera.getPicture(options).then((imageData) => {
        //let base64Image = 'data:image/jpeg;base64,' + imageData;
        return this.uploadImage(imageData, this.guardarArchivoPost());
      }, (err) => {
        this.Modal('Error', err);
      }).catch((erro) => { 
        this.Modal('Error', erro);
      });
  }

  getBlob (b64Data): any {
    let contentType = '';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  uploadImage(image: string, path: string): any {
    this.spin(true);
    let data = this.getBlob(image);
    let storageRef =  firebase.storage().ref();
    let imageRef = storageRef.child(path);
    imageRef.put(data).then((snapshot) => {
      console.log('Imagen subida exitosamente: '+path);
      this.spin(false);
      this.Modal('Archivo', 'Imagen subida exitosamente.');
      //this.traerArchivoPost();
    });
    // return imageRef.putString(image, 'data_url');
    // return imageRef.putString(image);
    // return imageRef.putString(image, firebase.storage.StringFormat.DATA_URL);
  }

  traerUsuario(id?: number) {
    this.spin(true);
    let idd: number;
    if(id !== undefined) idd = id;
    else idd = this.usuario.id;
    this.coleccionTipadaFirebase = this.objFirebase.collection<ArchivoPost>(this.nombreSala[this.opcion-1], ref => ref.where('usuario_id', '==', idd) );
    this.ListadoCreditosObservable = this.coleccionTipadaFirebase.valueChanges();
    let handler = this.ListadoCreditosObservable.subscribe(arr => {
      this.cardItems = new Array<any>();
      console.info("Conexión correcta con Firebase: Post con imagen de los usuarios", arr);
      arr.forEach((x: ArchivoPost) => {
        this.cargarPosts(x);
      });
      //handler.unsubscribe();
      this.spin(false);
    });
  }

  getImageURL(path: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(path);
    return imageRef.getDownloadURL();
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

