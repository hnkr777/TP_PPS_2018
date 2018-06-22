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
  coleccionTipadaFirebase:AngularFirestoreCollection<vehiculo>;
  ListadoDeVehiculosObservable:Observable<vehiculo[]>;
  constructor(public http: HttpClient,private objFirebase: AngularFirestore) {
    console.log('Hello ServicioVehiculoProvider Provider');
  }

  public verificarPatente(patente){ //RECIBE PATENTE Y DEVUELVE TRUE SI LA ENCUENTRA , FALSE SI NO LA ENCUENTRA
    let aux = false;
    this.coleccionTipadaFirebase= this.objFirebase.collection<vehiculo>('vehiculos'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.ListadoDeVehiculosObservable=this.coleccionTipadaFirebase.valueChanges();
    this.ListadoDeVehiculosObservable.subscribe(x => {
        console.info("conexión correcta con Firebase",x);
        x.forEach(vehiculo => {
          if (vehiculo.patente == patente) {
            aux = true;
          }
        });
    })
    return aux;
  }

}
