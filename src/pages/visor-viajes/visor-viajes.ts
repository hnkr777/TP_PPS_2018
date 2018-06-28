
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
  private usuarios: Usuario[];
  public filtro: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioViajes: ServicioViajesProvider,
    public modalCtrl: ModalController) {
      this.filtro = '0';
      //this.loadClientNames();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisorViajesPage');
    let ob = this.servicioViajes.traerViajes().subscribe(viajes => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('viajes: ' + JSON.stringify(viajes));
      /*for (let i = 0; i < viajes.length; i++) {
        let usuario: Usuario = this.usuarios.find( e => e.correo == viajes[i].correoCliente );
        viajes[i].nombreCliente = ( usuario !== undefined ? usuario.nombre + ' ' + usuario.apellido : '');
      }*/
      this.listaViajes = viajes;
      //ob.unsubscribe();
    });
  }

  // cargamos los clientes para obtener despues los nombres, deprecada
  loadClientNames() {
    let ob = this.servicioUsuarios.traerUsuarios().subscribe(data => {
      this.usuarios = data;
      ob.unsubscribe();
    });
  }

  refresh() {
    let ob = document.getElementById('visor-viajes-content');
    ob.childNodes

    document.getElementById('carta').classList.add('disabled');
    document.getElementById('carta').classList.remove('disabled');
  }

  filtrarViajes() {
    console.log('Filtro: ' +this.filtro);
    
    let now: number = Date.now();
    now += 30 * 60 * 1000; // cantidad de minutos * segundos (en 1 minuto) * milesimas de segundo (en 1 segundo)
    //console.log('now: ' + now.toString());
    //console.log(new Date(now).toLocaleString());

    let ob = this.servicioViajes.traerViajes().subscribe(data => {
      this.listaViajes = undefined;
      this.listaViajes = new Array<Viaje>();

      for(let i: number = 0; i < data.length; i++) {
        switch (this.filtro) {
          case '-2': // viajes pendientes y post datados (más allá de 30 minutos)
            if(data[i].fechaSalida > now && data[i].estado == 0 ) {
              this.listaViajes.push(data[i]);
            }
          break;

          case '-1': // todos los viajes
            this.listaViajes.push(data[i]);
          break;

          case '0': // viajes pendientes
            if(data[i].fechaSalida < now && data[i].estado == 0 ) {
              this.listaViajes.push(data[i]);
            }
          break;

          case '1': // viajes en curso
            if( data[i].estado == 1 ) {
              this.listaViajes.push(data[i]);
            }
          break;

          case '2': // viajes finalizados
            if( data[i].estado == 2 ) {
              this.listaViajes.push(data[i]);
            }
          break;

          case '3': // viajes cancelados por el cliente
            if( data[i].estado == 3 ) {
              this.listaViajes.push(data[i]);
            }
          break;

          case '4': // viajes cancelados por el chofer
            if( data[i].estado == 4 ) {
              this.listaViajes.push(data[i]);
            }
          break;
        
          default:
            break;
        }
        //let usuario: Usuario = this.usuarios.find( e => e.correo == data[i].correoCliente );
        //data[i].nombreCliente = ( usuario !== undefined ? usuario.nombre + ' ' + usuario.apellido : '');
      }
      console.log('Cantidad viajes: ' + this.listaViajes.length);
      ob.unsubscribe();
    });
  }

  verViaje($event) {
    console.log('Ver viaje');
    let f: Date = new Date($event.fechaSalida + (30 * 60 * 1000)); // minutos * segundos * milesimas de segundo
    console.log('Fecha: [' + f.toLocaleString() + ']');

  }
  
}
