import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

 /*
  *  Servicio de fotos (cámara)
  *
  * Saca fotos y las carga de la librería, devolviendo una imagen en base64 o binaria
  *  
  */

@Injectable()
export class ServicioFotosProvider {

  constructor(private camera: Camera) {
    console.log('Inicia ServicioFotosProvider Provider');
  }

  // esta función devuelve un promise para hacerle un then() con lo que devuelve, 
  // y obtener una foto en base64 de la cámara del celu
  takePhoto(): Promise<any> {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    return this.camera.getPicture(options);
    //this.savePhoto(options);
  }

  // esta función devuelve un promise para hacerle un then() con lo que devuelve, 
  // y obtener una foto en base64 de la librería de fotos del celu
  addLibraryPhoto(): Promise<any> {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    return this.camera.getPicture(options);
    //this.savePhoto(options);
  }

  // fuera de combate
  savePhoto (options): Promise<any> {
      return this.camera.getPicture(options);
      /*.then((imageData) => {
        //let base64Image = 'data:image/jpeg;base64,' + imageData;
        //return this.uploadImage(imageData, this.guardarArchivoPost());

      }, (err) => {
        console.log('Error' + err);
        // this.Modal('Error', err);
      }).catch((erro) => { 
        console.log('Error' + erro);
      });*/
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

  // fuera de servicio...
  uploadImage(image: string, path: string): any {
    // this.spin(true);
    let data = this.getBlob(image);
    // let storageRef =  firebase.storage().ref();
    // let imageRef = storageRef.child(path);
    // imageRef.put(data).then((snapshot) => {
      // console.log('Imagen subida exitosamente: '+path);
      // this.spin(false);
      // console.log('Archivo', 'Imagen subida exitosamente.');
      //this.traerArchivoPost();
    // });
    // return imageRef.putString(image, 'data_url');
    // return imageRef.putString(image);
    // return imageRef.putString(image, firebase.storage.StringFormat.DATA_URL);
  }

}
