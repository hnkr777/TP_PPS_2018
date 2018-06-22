
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
    console.log(Date());
    let ob = this.servicioViajes.traerViajesFiltrados('correoChofer', '==', '' ).subscribe(data => {
      console.log('Cantidad viajes: ' + data.length);

      this.listaViajes = data;

      ob.unsubscribe();
      
    });
  }

  verViaje($event) {
    console.log('Ver viaje');
    this.viaje = $event;
    console.log($event);
  }
  
}
