import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { vehiculo } from '../../clases/vehiculo';
/*
  Generated class for the ServicioVehiculoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicioVehiculoProvider {
  /**
   *  Contiene el nombre/ruta de la tabla de vehiculos en firebase
   */
  private tablaVehiculos: string = 'vehiculos';
  /**
   * Colleccion de firestore de tipo vehiculo
   */
  coleccionTipadaFirebase:AngularFirestoreCollection<vehiculo>;
  /**
   * Observable de tipo vehiculo[]
   */
  ListadoDeVehiculosObservable:Observable<vehiculo[]>;
  /**
   * Instancia Variables necesarias
   * @param http Variable del plugin HttpClient
   * @param objFirebase Variable del plugin AngularFirestore
   */
  constructor(public http: HttpClient,private objFirebase: AngularFirestore) {
    console.log('Hello ServicioVehiculoProvider Provider');
  }
  // public verificarPatente(patente){
  //   this.coleccionTipadaFirebase= this.objFirebase.collection<vehiculo>(this.tablaVehiculos); 
  //   //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
  //   this.ListadoDeVehiculosObservable=this.coleccionTipadaFirebase.valueChanges();
  //   this.ListadoDeVehiculosObservable.subscribe(x => {
  //       console.info("conexión correcta con Firebase",x);
  //       x.forEach(vehiculo => {
  //         if (vehiculo.patente == patente) {
  //         }
  //       });
  //   })
  // }
  /**
   * Devuelve todos los vehiculos en la base junto con una promesa
   */

   /**
   * @api Traer Todos Los Vehiculos
   * @apiName traerVehiculos
   * @apiGroup Vehiculos
   * @apiSuccess {Promise} Una Promesa Junto con los datos de respuesta de la base
   * @apiDescription Devuelve todos los vehiculos en la base junto con una promesa
   */
  public traerVehiculos(){ // trae todos los vehiculos
    this.coleccionTipadaFirebase= this.objFirebase.collection<vehiculo>(this.tablaVehiculos); 
    this.ListadoDeVehiculosObservable = this.coleccionTipadaFirebase.valueChanges();
    return this.ListadoDeVehiculosObservable;
    /*this.ListadoDeVehiculosObservable.subscribe(x => {
        console.info("conexión correcta con Firebase",x);
        x.forEach(vehiculo => {
          if (vehiculo.patente == patente) {
          }
        });
    })*/
  }
  /**
   * Recibe un vehiculo y lo guarda remplazando su original buscandolo por la patente
   * @param vehiculo Vehiculo Modificado
   */

  /**
   * @api Modificar Vehiculo
   * @apiName modificarVehiculo
   * @apiGroup Vehiculos
   * @apiParam {Vehiculo} [vehiculo]  Vehiculo Modificado
   * @apiDescription Recibe un vehiculo y lo guarda remplazando su original buscandolo por la patente
   */
  modificarVehiculo(vehiculo: vehiculo) {
    console.log('ServicioVehiculoProvider.modificarVehiculo()');
    //this.objFirebase.collection<Usuario>(this.tablaUsuarios).ref.doc().update().then();
    let coleccionTipadaFirebase = this.objFirebase.collection<vehiculo>(this.tablaVehiculos, ref => ref.where('patente', '==', vehiculo.patente));
    coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().patente == vehiculo.patente) {
          doc.ref.update(vehiculo);
          console.log('Vehículo ' + vehiculo.patente + ' modificado correctamente.');
        }
      });
    })
    .catch(function(error) {
      console.log('Error al modificar el usuario ' + vehiculo.patente + ' - ' + JSON.stringify(error));
    });
    
  }
  /**
   * Recibe un Estado y busca por patente al vehiculo para cambiarlo de estado
   * @param patente Patente a buscar
   * @param estado Numero del estado
   */

   /**
   * @api Cambiar El Estado Al Vehiculo
   * @apiName cambiarEstadoVehiculoPorPatente
   * @apiGroup Vehiculos
   * @apiParam {string} [patente]  Patente a buscar
   * @apiParam {number} [estado]  Numero del estado
   * @apiDescription Recibe un Estado y busca por patente al vehiculo para cambiarlo de estado
   */
  cambiarEstadoVehiculoPorPatente(patente: string, estado: number) {
    console.log('ServicioVehiculoProvider.cambiarEstadoVehiculoPorPatente()');
    //this.objFirebase.collection<Usuario>(this.tablaUsuarios).ref.doc().update().then();
    let vehi;
    let coleccionTipadaFirebase = this.objFirebase.collection<vehiculo>(this.tablaVehiculos, ref => ref.where('patente', '==', patente));
    coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        vehi = doc.data();
        if(vehi.patente == patente) {
          vehi.estado = estado;
          doc.ref.update(vehi);
          console.log('Vehículo ' + patente + ' modificado correctamente.');
        }
      });
    })
    .catch(function(error) {
      console.log('Error al modificar el usuario ' + patente + ' - ' + JSON.stringify(error));
    });
    
  }

}
