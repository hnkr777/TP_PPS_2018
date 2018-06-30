import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';

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

  // trae TODOS los usuarios, devuelve con un promise
  // debería hacer unsuscribe al finalizar la carga de datos?
  traerUsuarios(): Observable<Usuario[] | any[]> {
    console.log('ServicioUsuariosProvider.traerUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios);
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
    console.log('ServicioUsuariosProvider.traerUsuariosPorPerfil()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios, ref => ref.where('perfil', '==', perfil));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
    /*let ob = ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los usuarios: ", x);
      usuarios = x;
      ob.unsubscribe();
    });*/
  }
  traerUsuarioPorEmail(correo: string): Observable<Usuario[]> {
    console.log('ServicioUsuariosProvider.traerUsuarioPorEmail()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios, ref => ref.where('correo', '==', correo));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
    /*let ob = ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Trayendo todos los usuarios: ", x);
      usuarios = x;
      ob.unsubscribe();
    });*/
  }

  // guarda un nuevo usuario en la base de datos, en caso de bien o mal ejecuta los callbacks correspondientes...
  // TODO: implementar chequeo de restricción de email y dni único
  guardarNuevoUsuario(nuevo: Usuario | any): Promise<any> {
    console.log('ServicioUsuariosProvider.guardarNuevoUsuario()');
    let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
    return this.objFirebase.collection<Usuario>(this.tablaUsuarios).add(objetoJsonGenerico);
    /*.then( successCallback // si el usuario se guardó bien, invoca al callback del usuario
      //ret => { console.log('Usuario '+ nuevo.nombre +' guardado correctamente.');}
    )
    .catch( errorCallback // si hubo error, llama al callback de error...
      //error => {console.error(error);}
    );*/
  }

  // modificamos el usuario en firebase pasado como parámetro, lo identifica por el email, que es único para cada usuario
  modificarUsuario(usuario: Usuario | any) {
    console.log('ServicioUsuariosProvider.modificarUsuario()');
    //this.objFirebase.collection<Usuario>(this.tablaUsuarios).ref.doc().update().then();
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios, ref => ref.where('correo', '==', usuario.correo));
    coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().correo == usuario.correo) {
          doc.ref.update(usuario);
          console.log('Usuario ' + usuario.correo + ' modificado correctamente.');
        }
      });
    })
    .catch(function(error) {
      console.log('Error al modificar el usuario ' + usuario.correo + ' - ' + error);
    });
    
  }

}
