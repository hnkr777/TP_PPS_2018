import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';



@Injectable()
export class AbmClienteProvider {
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
  /**
   * Instancia Variables necesarias
   * @param http Variable del plugin HttpClient
   * @param objFirebase Variable del plugin AngularFirestore
   */
  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello AbmClienteProvider Provider');

  }
    /**
   * Trae Todos los usuarios de la base de datos y los devuelve junto con una promesa
   * @returns Todos los usuarios junto con una promesa
   */
  traerUsuarios(): Observable<Usuario[] | any[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios);
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
  }
  /**
   * Trae Todos los usuarios de la base de datos segun su perfil (chofer,cliente o supervisor) y los devuelve junto con una promesa
   * @returns Todos los usuarios junto con una promesa
   */
  traerUsuariosPorPerfil(perfil: string): Observable<any[]> 
    {
      console.log('ServicioUsuariosProvider.cargarUsuarios()');
      let coleccionTipadaFirebase = this.objFirebase.collection<any>(this.tablaUsuarios, ref => ref.where('perfil', '==', perfil));
      let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
      return ListadoUsuariosObservable;
    }
  /**
   * Recibe un usuario y lo guarda en la base datos, luego devuelve una promesa.
   * @param nuevo Usuario a guardar en la base
   * @returns Una Promesa Junto con los datos de respuesta de la base
   */
    guardarNuevoCliente(nuevo: any): Promise<any> {
      console.log("esta guardando en el service");
      let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
      return this.objFirebase.collection<any>(this.tablaUsuarios).add(objetoJsonGenerico);
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
    modificarUsuario(usuario: any ): Promise<any>  {
      console.log('ServicioUsuariosProvider.modificarUsuario()');
      //this.objFirebase.collection<Usuario>(this.tablaUsuarios).ref.doc().update().then();
      let coleccionTipadaFirebase = this.objFirebase.collection<any>(this.tablaUsuarios, ref => ref.where('correo', '==', usuario.correo));
     return coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().correo == usuario.correo) {
            doc.ref.update(usuario);
            
           // console.log('Usuario ' + usuario.email + ' modificado correctamente.');
          }
        });
      })
      .catch(function(error) {
        console.log('Error al modificar el usuario ' + usuario.email + ' - ' + error);
      });
      
    }

      /**
       * Recibe una patente y devuelve el vehiculo encontrado junto con una promesa
       * @param patente Patente del vehiculo a buscar
       */
  traerVehiculoPorPatente(patente:any): Observable<Usuario[] | any[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<any>('vehiculos', ref => ref.where('patente', '==',patente));
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
  }


}




