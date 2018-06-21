
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { Usuario } from '../../clases/usuario';
import { ServicioViajesProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';

/**
 * página de visor de viajes, solo lo tiene que poder usar el administrador o superusuario...
 * 
 * 
 */

@IonicPage()
@Component({
  selector: 'visor-viajes',
  templateUrl: 'visor-viajes.html',
})
export class VisorViajesPage {
  public listaViajes: any;
  private viaje: Viaje;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioViajes: ServicioViajesProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisorViajesPage');
    let usuarios: any;
    let ob = this.servicioViajes.traerViajes().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));

      this.listaViajes = data;
      //ob.unsubscribe();
      
    });
  }

  refresh() {
    let ob = document.getElementById('visor-viajes-content');
    ob.childNodes

    document.getElementById('carta').classList.add('disabled');
    document.getElementById('carta').classList.remove('disabled');
  }

  filtrarViajesTest() {
    let now: number = Date.now();
    now += 30 * 60 * 1000; // cantidad de minutos * segundos (en 1 minuto) * milesimas de segundo (en 1 segundo)
    //console.log('now: ' + now.toString());
    //console.log(new Date(now).toLocaleString());

    let ob = this.servicioViajes.traerViajes().subscribe(data => {
      //console.log('Cantidad viajes: ' + data.length);
      this.listaViajes = undefined;
      this.listaViajes = new Array<Viaje>();

      for(let i: number = 0; i < data.length; i++) {
        if(data[i].fechaSalida < now ) {
          this.listaViajes.push(data[i]);
        }
      }
        
      
      ob.unsubscribe();
      
    });
  }

  verViaje($event) {
    console.log('Ver viaje');
    let f: Date = new Date($event.fechaSalida + (30 * 60 * 1000)); // minutos * segundos * milesimas de segundo
    console.log('Fecha: [' + f.toLocaleString() + ']');

  }
  
}
