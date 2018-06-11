import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';

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
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes);
    let ListadoViajesObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoViajesObservable;
    /*let ob = ListadoViajesObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los viajes: ", x);
      viajes = x;
      ob.unsubscribe();
    });*/
  }

  // trae todos los viajes de un determinado perfil, devuelve con un Promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  traerUsuariosPorPerfil(perfil: string): Observable<Viaje[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes, ref => ref.where('perfil', '==', perfil));
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
  guardarNuevoUsuario(nuevo: Viaje | any): Promise<any> {
    let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
    return this.objFirebase.collection<Viaje>(this.tablaViajes).add(objetoJsonGenerico);
    /*.then( successCallback // si el viaje se guardó bien, invoca al callback del viaje
      //ret => { console.log('Viaje '+ nuevo.nombre +' guardado correctamente.');}
    )
    .catch( errorCallback // si hubo error, llama al callback de error...
      //error => {console.error(error);}
    );*/
  }

  // modificamos el viaje en firebase pasado como parámetro, lo identifica por el email, que es único para cada viaje
  modificarUsuario(viaje: Viaje | any) {
    console.log('ServicioUsuariosProvider.modificarUsuario()');
    //this.objFirebase.collection<Viaje>(this.tablaViajes).ref.doc().update().then();
    let coleccionTipadaFirebase = this.objFirebase.collection<Viaje>(this.tablaViajes, ref => ref.where('correo', '==', viaje.correo));
    coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().correo == viaje.correo) {
          doc.ref.update(viaje);
          console.log('Viaje ' + viaje.correo + ' modificado correctamente.');
        }
      });
    })
    .catch(function(error) {
      console.log('Error al modificar el viaje ' + viaje.correo + ' - ' + error);
    });
    
  }

}
