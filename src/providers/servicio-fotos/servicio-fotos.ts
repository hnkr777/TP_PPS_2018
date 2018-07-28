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
  /**
   * Instancia la variable del plugin
   * @param camera Variable del plugin camera
   */
  constructor(private camera: Camera) {
    console.log('Inicia ServicioFotosProvider Provider');
  }

  // esta función devuelve un promise para hacerle un then() con lo que devuelve, 
  // y obtener la ruta web en firestorage de la foto recien subida
  /**
   * Recibe la ruta donde guarda la imagen y devuelve un promise luego de guardarla
   * @param ruta La ruta donde guardar la imagen
   * @returns Una promesa luego de guardar la imagen 
   */

  /**
  * @api Tomar Foto Camara
  * @apiName takePhoto
  * @apiGroup Fotos
  * @apiParam {String} [ruta]  La ruta donde guardar la imagen
  * @apiSuccess {Promise} promesa Devuelve Una promesa luego de guardar la imagen
  * @apiDescription Recibe la ruta donde guarda la imagen y devuelve un promise luego de guardarla
  */
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

  /**
  * Abre La libreria para cargar una foto ya guardada de tu celular
  * 
  * @param ruta La ruta de acceso a la imagen
  * @returns Una promesa luego de guardar la imagen 
  */

  /**
   * @api Tomar Foto Libreria
   * @apiName addLibraryPhoto
   * @apiGroup Fotos
   * @apiParam {String} [ruta]  La ruta de acceso a la imagen
   * @apiSuccess {Promise} promesa Devuelve Una promesa luego de guardar la imagen
   * @apiDescription Abre La libreria para cargar una foto ya guardada de tu celular
   */
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
  /**
   * Guarda la imagen en la base de datos firestore
   * @param options Opciones de la camara
   * @param ruta La ruta donde guardar la imagen
   */


  /**
   * @api Guardar Foto
   * @apiName savePhoto
   * @apiGroup Fotos
   * @apiParam {CameraOptions} [options]  Opciones de la camara
   * @apiParam {String} [ruta]  La ruta donde guardar la imagen
   * @apiSuccess {Promise} promesa Devuelve Una promesa luego de guardar la imagen
   * @apiDescription Guarda la imagen en la base de datos firestore
   */
  savePhoto(options: CameraOptions, ruta: string): Promise<any> {
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
  /**
   * Recibe una imagen en base64 y la transforma en binaria
   * @param b64Data Imagen en Base64 a ser transformada
   */

  /**
   * @api Conversor de imagen a Binario
   * @apiName getBlob
   * @apiGroup Fotos
   * @apiParam {String} [b64Data]  Imagen en Base64 a ser transformada
   * @apiSuccess {Promise} Devuelve la imagen en binario
   * @apiDescription Recibe una imagen en base64 y la transforma en binaria
   */
  getBlob(b64Data): any {
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

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  /**
   * Recibe una ruta y devuelve el link de la imagen buscada
   * @param path Ruta de donde deberia buscar la imagen
   * @returns Link de la imagen buscada
   */

   /**
   * @api Obtener Url de la imagen
   * @apiName getImageURL
   * @apiGroup Fotos
   * @apiParam {String} [path]  Ruta de donde deberia buscar la imagen
   * @apiSuccess {Promise} Link de la imagen buscada
   * @apiDescription Recibe una ruta y devuelve el link de la imagen buscada
   */
  getImageURL(path: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(path);
    return imageRef.getDownloadURL();
  }
  /**
   * Se encarga de subir a la base la imagen en binario
   * @param image Imagen en base64
   * @param path Ruta donde guardar la imagen
   */

  /**
   * @api Subir Imagen
   * @apiName getImageURL
   * @apiGroup Fotos
   * @apiParam {String} [image]  Imagen en base64
   * @apiParam {String} [path]  Ruta donde guardar la imagen
   * @apiSuccess {Promise} Link de la imagen Subida
   * @apiDescription Se encarga de subir a la base la imagen en binario
   */
  uploadImage(image: string, path: string): Promise<any> {
    //this.spin(true);
    let data = this.getBlob(image);
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(path);
    return imageRef.put(data)
      .then((snapshot) => {
        console.log('Imagen subida exitosamente: ' + path);
        //this.spin(false);
        //this.Modal('Archivo', 'Imagen subida exitosamente.');
        return imageRef.getDownloadURL();
      });
    // return imageRef.putString(image, 'data_url');
    // return imageRef.putString(image);
    // return imageRef.putString(image, firebase.storage.StringFormat.DATA_URL);
  }

}
