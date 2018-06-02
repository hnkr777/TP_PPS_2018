import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Usuario } from '../../clases/usuario';
import { Observable } from 'rxjs/Observable';


/*
  Servicio/Provider de usuarios, para traer a todos, o por tipo, o para guardar uno nuevo, etc
  
*/
@Injectable()
export class ServicioUsuariosProvider {
  private readonly tablaUsuarios: string = 'usuarios'; // nombre/ruta de la tabla de usuarios en firebase
  
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;


  //private usuarios: Array<Usuario>;

  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello ServicioUsuariosProvider Provider');

  }

  // trae TODOS los usuarios, ordenados por id, devuelve con un promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  traerUsuarios(): Observable<Usuario[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios, ref => ref.orderBy('id','asc'));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
    /*let ob = ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los usuarios: ", x);
      usuarios = x;
      ob.unsubscribe();
    });*/
  }

  // trae todos los usuarios de un determinado perfil, devuelve con un Promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  traerUsuariosPorPerfil(perfil: string): Observable<Usuario[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios, ref => ref.where('perfil', '==', perfil));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
    /*let ob = ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los usuarios: ", x);
      usuarios = x;
      ob.unsubscribe();
    });*/
  }

  // guarda un nuevo usuario en la base de datos, en caso de bien o mal ejecuta los callbacks correspondientes...
  guardarNuevoUsuario(nuevo: Usuario, successCallback, errorCallback) {
    let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
    this.objFirebase.collection<Usuario>(this.tablaUsuarios).add(objetoJsonGenerico)
    .then( successCallback // si el usuario se guardó bien, invoca al callback del usuario
      //ret => { console.log('Usuario '+ nuevo.nombre +' guardado correctamente.');}
    )
    .catch( errorCallback // si hubo error, llama al callback de error...
      //error => {console.error(error);}
    );
  }

}
