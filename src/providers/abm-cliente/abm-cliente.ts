import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';


/*
  Generated class for the AbmClienteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AbmClienteProvider {
  private readonly tablaUsuarios: string = 'usuarios'; // nombre/ruta de la tabla de usuarios en firebase
  
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;

  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello AbmClienteProvider Provider');

  }

  traerUsuarios(): Observable<Usuario[] | any[]> {
    console.log('ServicioUsuariosProvider.cargarUsuarios()');
    let coleccionTipadaFirebase = this.objFirebase.collection<Usuario>(this.tablaUsuarios);
    let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
    return ListadoUsuariosObservable;
  }
  
  traerUsuariosPorPerfil(perfil: string): Observable<any[]> 
    {
      console.log('ServicioUsuariosProvider.cargarUsuarios()');
      let coleccionTipadaFirebase = this.objFirebase.collection<any>(this.tablaUsuarios, ref => ref.where('perfil', '==', perfil));
      let ListadoUsuariosObservable = coleccionTipadaFirebase.valueChanges();
      return ListadoUsuariosObservable;
    }

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

    modificarUsuario(usuario: any ): Promise<any>  {
      console.log('ServicioUsuariosProvider.modificarUsuario()');
      //this.objFirebase.collection<Usuario>(this.tablaUsuarios).ref.doc().update().then();
      let coleccionTipadaFirebase = this.objFirebase.collection<any>(this.tablaUsuarios, ref => ref.where('id', '==', usuario.id));
     return coleccionTipadaFirebase.ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().id == usuario.id) {
            doc.ref.update(usuario);
            
           // console.log('Usuario ' + usuario.email + ' modificado correctamente.');
          }
        });
      })
      .catch(function(error) {
        console.log('Error al modificar el usuario ' + usuario.email + ' - ' + error);
      });
      
    }
    


}




