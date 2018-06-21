import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';

 /*
  *  Servicio de fotos (cámara)
  *
  * Saca fotos y/o las carga de la librería 
  * también guarda la imagen en firestorage, devolviendo la ruta pública de la imagen (web)
  */

@Injectable()
export class ServicioFotosProvider {

  constructor(private camera: Camera, private objFirebase: AngularFirestore) {
    console.log('Inicia ServicioFotosProvider Provider');
  }

  // esta función devuelve un promise para hacerle un then() con lo que devuelve, 
  // y obtener la ruta web en firestorage de la foto recien subida
  takePhoto(ruta: string): Promise<any> {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    return this.savePhoto(options, ruta);
  }

  // esta función devuelve un promise para hacerle un then() con lo que devuelve, 
  // y obtener la ruta web en firestorage de la foto recien subida
  addLibraryPhoto(ruta: string): Promise<any> {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    
    return this.savePhoto(options, ruta);
  }

  savePhoto (options: CameraOptions, ruta: string): Promise<any> {
      return this.camera.getPicture(options)
      .then((imageData) => {
        //let base64Image = 'data:image/jpeg;base64,' + imageData;
        return this.uploadImage(imageData, ruta);
      }, (err) => {
        console.log('Error' + err);
        // this.Modal('Error', err);
      }).catch((erro) => {
        console.log('Error' + erro);
      });
  }

  // con esta función convertimos la imagen desde base64 a binaria, imagen_base64 => imagen_binaria
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
  
  getImageURL(path: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(path);
    return imageRef.getDownloadURL();
  }

  uploadImage(image: string, path: string): Promise<any> {
    //this.spin(true);
    let data = this.getBlob(image);
    let storageRef =  firebase.storage().ref();
    let imageRef = storageRef.child(path);
    return imageRef.put(data)
    .then((snapshot) => {
      console.log('Imagen subida exitosamente: '+path);
      //this.spin(false);
      //this.Modal('Archivo', 'Imagen subida exitosamente.');
      return imageRef.getDownloadURL();
    });
    // return imageRef.putString(image, 'data_url');
    // return imageRef.putString(image);
    // return imageRef.putString(image, firebase.storage.StringFormat.DATA_URL);
  }

}
