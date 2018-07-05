import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';
import { Encuesta } from '../../clases/encuesta';

/*
  Generated class for the ServicioEncuestasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicioEncuestasProvider {

  private readonly tablaUsuarios: string = 'encuestas'; // nombre/ruta de la tabla de usuarios en firebase
  
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;

  constructor(public http: HttpClient, private objFirebase: AngularFirestore) {
    console.log('Hello ServicioEncuestasProvider Provider');
  }

  guardarNuevoEncuesta(nuevo: Encuesta): Promise<any> {
    console.log("esta guardando en el service");
    let objetoJsonGenerico = JSON.parse(JSON.stringify(nuevo));
    return this.objFirebase.collection<Encuesta>(this.tablaUsuarios).add(objetoJsonGenerico);
    /*.then( successCallback // si el usuario se guardó bien, invoca al callback del usuario
      //ret => { console.log('Usuario '+ nuevo.nombre +' guardado correctamente.');}
    )
    .catch( errorCallback // si hubo error, llama al callback de error...
      //error => {console.error(error);}
    );*/
  }

  traerEncuestas(): Observable<Usuario[] | any[]> {
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

}
