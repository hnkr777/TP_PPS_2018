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
  private readonly tablaViajes: string = 'viajes'; // nombre/ruta de la tabla de viajes en firebase
  
  coleccionTipadaFirebase: AngularFirestoreCollection<Viaje>;
  ListadoViajesObservable: Observable<Viaje[]>;
  //private Viajes: Array<Viaje>;

  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello ServicioViajesProvider Provider');

  }

  // trae TODOS los Viajes, devuelve con un promise
  // debería hacer unsuscribe al finalizar la carga de datos?
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
  modificarViaje(viaje: Viaje | any) {
    console.log('ServicioViajesProvider.modificarViaje()');
    //this.objFirebase.collection<Viaje>(this.tablaViajes).ref.doc().update().then();
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes, ref => ref.where('id', '==', viaje.fechaRegistro));
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

  geoCoding(direccion: string): Promise<any> {
    let url: string = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ direccion +'&key=' + environment.googleMapsApiKey;
    return this.http.get(url).toPromise();
  }

}
