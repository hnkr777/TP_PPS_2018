import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';
import { environment } from '../../environments/environment';

/*
  Servicio/Provider de viajes, para traer todos, o por filtros, o para guardar uno nuevo, etc
  
*/
@Injectable()
export class ServicioViajesProvider {
    /**
   *  Contiene el nombre/ruta de la tabla de viajes en firebase
   */
  private readonly tablaViajes: string = 'viajes'; // nombre/ruta de la tabla de viajes en firebase
    /**
   * Colleccion de firestore de tipo viaje
   */
  coleccionTipadaFirebase: AngularFirestoreCollection<Viaje>;
    /**
   * Observable de tipo Viaje[]
   */
  ListadoViajesObservable: Observable<Viaje[]>;
  //private Viajes: Array<Viaje>;
  /**
   * Instancia Variables necesarias
   * @param http Variable del plugin HttpClient
   * @param objFirebase Variable del plugin AngularFirestore
   */
  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello ServicioViajesProvider Provider');

  }

  // trae TODOS los Viajes, devuelve con un promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  /**
   * Devuelve todos los viajes registrados en la base de datos junto con una promesa
   * @returns Una promesa junto con los datos de la base
   * 
   */

   /**
   * @api Traer Todos Los viajes
   * @apiName traerViajes
   * @apiGroup Viajes
   * @apiSuccess {Observable} Un observable junto con los datos de la base
   * @apiDescription Recibe un Estado y busca por patente al vehiculo para cambiarlo de estado
   */
  traerViajes(): Observable<Viaje[] | any[]> {
    console.log('ServicioViajesProvider.traerViajes()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes);
    let ListadoViajesObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoViajesObservable;
    /*let ob = ListadoViajesObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los viajes: ", x);
      viajes = x;
      ob.unsubscribe();
    });*/
  }

  // trae todos los viajes de un determinado filtro, devuelve con un Promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  /**
   * Trae los viajes filtrados segun un criterio
   * @param campo Campo a comparar
   * @param criterio Criterio de comparacion
   * @param filtro Valor con el cual se compara
   * @returns Una promesa junto con los datos de la base
   */

   /**
   * @api Traer Todos Los viajes Filtrados
   * @apiName traerViajesFiltrados
   * @apiGroup Viajes
   * @apiParam {String} [campo]  Campo a comparar
   * @apiParam {String} [criterio]  Criterio de comparacion
   * @apiParam {String} [filtro]  Valor con el cual se compara
   * @apiSuccess {Observable} Un observable junto con los datos de la base
   * @apiDescription Trae los viajes filtrados segun un criterio
   */
  traerViajesFiltrados(campo: string, criterio, filtro: string): Observable<Viaje[]> {
    //console.log('ServicioUsuariosProvider.traerViajesFiltrados()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes, ref => ref.where(campo, criterio, filtro));
    let ListadoViajesObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoViajesObservable;
    /*let ob = ListadoViajesObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los viajes: ", x);
      viajes = x;
      ob.unsubscribe();
    });*/
  }
  
  // guarda un nuevo viaje en la base de datos, en caso de bien o mal ejecuta los callbacks correspondientes...
  // TODO: implementar chequeo de restricción de email y dni único
  /**
   * Guarda un viaje en la base de datos y devuelve una promesa
   * @param nuevo Viaje a ser guardado
   * @returns Una promesa junto con la respuesta de la base
   */

   /**
   * @api Guardar Nuevo Viaje
   * @apiName guardarNuevoViaje
   * @apiGroup Viajes
   * @apiParam {Viaje} [nuevo]  Viaje a ser guardado
   * @apiSuccess {Promise} Una promesa junto con la respuesta de la base
   * @apiDescription Guarda un viaje en la base de datos y devuelve una promesa
   */
  guardarNuevoViaje(nuevo: Viaje | any): Promise<any> {
    let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
    return this.objFirebase.collection<Viaje>(this.tablaViajes).add(objetoJsonGenerico);
    /*.then( successCallback // si el viaje se guardó bien, invoca al callback del viaje
      //ret => { console.log('Viaje '+ nuevo.nombre +' guardado correctamente.');}
    )
    .catch( errorCallback // si hubo error, llama al callback de error...
      //error => {console.error(error);}
    );*/
  }

  // modificamos el viaje en firebase pasado como parámetro, lo identifica por id, que es único para cada viaje
  /**
   * Recibe un viaje modificado y guarda remplazando el viaje encontrado por la fecha de registro
   * @param viaje Viaje Modificado a guardar
   */

   /**
   * @api Modificar ModificarViaje
   * @apiName modificarViaje
   * @apiGroup Viajes
   * @apiParam {Viaje} [viaje]  Viaje Modificado a guardar
   * @apiDescription Recibe un viaje modificado y guarda remplazando el viaje encontrado por la fecha de registro
   */
  modificarViaje(viaje: Viaje | any) {
    console.log('ServicioViajesProvider.modificarViaje()');
    //this.objFirebase.collection<Viaje>(this.tablaViajes).ref.doc().update().then();
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes, ref => ref.where('fechaRegistro', '==', viaje.fechaRegistro));
    coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().fechaRegistro == viaje.fechaRegistro) {
          doc.ref.update(viaje);
          console.log('Viaje ' + viaje.fechaRegistro + ' modificado correctamente.');
        }
      });
    })
    .catch(function(error) {
      console.log('Error al modificar el viaje ' + viaje.fechaRegistro + ' - ' + error);
    });
    
  }
  /**
   * Recibe una direccion y la transforma en latitud y longitud
   * @param direccion Direccion a transformar
   * @returns Una promesa junto con la respuesta de la api
   * 
   */

   /**
   * @api Transformar Direccion en Lat y Lng
   * @apiName geoCoding
   * @apiGroup Viajes
   * @apiParam {String} [direccion]  Direccion a transformar
   * @apiSuccess {Promise} Una promesa junto con la respuesta de la api
   * @apiDescription Recibe una direccion y la transforma en latitud y longitud
   */
  geoCoding(direccion: string): Promise<any> {
    let url: string = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ direccion +'&key=' + environment.googleMapsApiKey;
    return this.http.get(url).toPromise();
  }

}
