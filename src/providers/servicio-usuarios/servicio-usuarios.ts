import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';

/**
 * Servicio/Provider de usuarios, para traer a todos, o por tipo, o para guardar uno nuevo, etc
 */
@Injectable()
export class ServicioUsuariosProvider {
  /**
   *  Contiene el nombre/ruta de la tabla de usuarios en firebase
   */
  private readonly tablaUsuarios: string = 'usuarios'; // nombre/ruta de la tabla de usuarios en firebase
  /**
   * Colleccion de firestore de tipo usuario
   */
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  /**
   * Observable de tipo usuario[]
   */
  ListadoUsuariosObservable: Observable<Usuario[]>;


  //private usuarios: Array<Usuario>;
  /**
   * Instancia Variables necesarias
   * @param http Variable del plugin HttpClient
   * @param objFirebase Variable del plugin AngularFirestore
   */
  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello ServicioUsuariosProvider Provider');

  }

  /**
   * Trae Todos los usuarios de la base de datos y los devuelve junto con una promesa
   * @returns Todos los usuarios junto con una promesa
   */
   /**
   * @api Traer Todos Los usuarios
   * @apiName traerUsuarios
   * @apiGroup Usuarios
   * @apiSuccess {Promise} Todos los usuarios junto con una promesa
   * @apiDescription Trae Todos los usuarios de la base de datos y los devuelve junto con una promesa
   */
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


  /**
   * Trae Todos los usuarios de la base de datos segun su perfil (chofer,cliente o supervisor) y los devuelve junto con una promesa
   * @returns Todos los usuarios junto con una promesa
   */

   /**
   * @api Traer Todos Los usuarios Por Perfil
   * @apiName traerUsuariosPorPerfil
   * @apiGroup Usuarios
   * @apiSuccess {Promise} Todos los usuarios junto con una promesa
   * @apiDescription Trae Todos los usuarios de la base de datos segun su perfil (chofer,cliente o supervisor) y los devuelve junto con una promesa
   */
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
  /**
   * Trae un usuario de la base de datos segun un email y los devuelve junto con una promesa
   * @param correo correo a buscar en la base
   * @returns El usuario encontrado junto con una promesa
   */
  /**
   * @api Usuario Traer Por Correo
   * @apiName traerUsuarioPorEmail
   * @apiGroup Usuarios
   * @apiParam {String} [correo]  correo a buscar en la base
   * @apiSuccess {Promise} El usuario encontrado junto con una promesa
   * @apiDescription Trae un usuario de la base de datos segun un email y los devuelve junto con una promesa
   */
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

  /**
   * Recibe un usuario y lo guarda en la base datos, luego devuelve una promesa.
   * @param nuevo Usuario a guardar en la base
   * @returns Una Promesa Junto con los datos de respuesta de la base
   */

  /**
   * @api Guardar GuardarUsuario
   * @apiName guardarNuevoUsuario
   * @apiGroup Usuarios
   * @apiParam {Usuario} [nuevo]  Usuario a guardar en la base
   * @apiSuccess {Promise} Una Promesa Junto con los datos de respuesta de la base
   * @apiDescription Recibe un usuario y lo guarda en la base datos, luego devuelve una promesa.
   */
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

  /**
   * Recibe un usuario modificado y lo sube a la base remplazando al anterior que use le mismo correo.
   * @param usuario Usuario modificado
   */

  /**
   * @api Modificar ModificarUsuario
   * @apiName modificarUsuario
   * @apiGroup Usuarios
   * @apiParam {Usuario} [usuario]  Usuario modificado
   * @apiDescription Recibe un usuario modificado y lo sube a la base remplazando al anterior que use le mismo correo.
   */
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
