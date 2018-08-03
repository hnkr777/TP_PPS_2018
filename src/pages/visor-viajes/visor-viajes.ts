
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { Usuario } from '../../clases/usuario';
import { ServicioViajesProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';
import { VerImagenPage } from '../ver-imagen/ver-imagen';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { ThemeProvider } from '../../providers/theme/theme';

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
  private spinner;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioViajes: ServicioViajesProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public audioService:ServicioAudioProvider,
    private themes : ThemeProvider
) {
     // this.filtro = '0';
     //TODOS
     this.filtro = '-1';
      //this.loadClientNames();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisorViajesPage');
    this.themes.refreshTheme();
    this.spin(true);
    let ob = this.servicioViajes.traerViajes().subscribe(viajes => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('viajes: ' + JSON.stringify(viajes));
      /*for (let i = 0; i < viajes.length; i++) {
        let usuario: Usuario = this.usuarios.find( e => e.correo == viajes[i].correoCliente );
        viajes[i].nombreCliente = ( usuario !== undefined ? usuario.nombre + ' ' + usuario.apellido : '');
      }*/
      this.listaViajes = viajes;
      this.spin(false);
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
    this.spin(true);
    
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
          case '5': // viajes cancelados por el supervisor
          if( data[i].estado == 5 ) {
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
      this.spin(false);
    });
  }

  verViaje($event) {
    console.log('Ver viaje');
    let f: Date = new Date($event.fechaSalida + (30 * 60 * 1000)); // minutos * segundos * milesimas de segundo
    console.log('Fecha: [' + f.toLocaleString() + ']');

  }

  verImg(mail:string){
    console.log("MAIL: "+mail);
    /*let usuarios = this.servicioUsuarios.traerUsuarios().toPromise().then(x=>{
      console.log(x);
    })*/
    let usuarios = this.servicioUsuarios.traerUsuarioPorEmail(mail)
    usuarios.subscribe(x=>{
      //console.log("MOSTRA LA FOTO: "+JSON.stringify(x));
      if (x[0].foto == "" || x[0].foto === undefined) {
        this.modalCtrl.create(VerImagenPage,{imagen:'assets/img/perfildefaul.jpg'}).present();
      }
      else{
        this.modalCtrl.create(VerImagenPage,{imagen:x[0].foto}).present();
      }
      
    });
  }
  cancelarViaje(viaje:Viaje){
    //cancelado por chofer
    //viaje.estado = 4;
    //cancelado por supervisor
    viaje.estado = 5;
    this.servicioViajes.modificarViaje(viaje);
    this.showSuccess("Viaje eliminado correctamente");
  }
  ponerViajeEnPendiente(viaje:Viaje){
    //viaje.estado = 0;
    //let emailChofer = viaje.correoChofer;
    viaje.correoChofer = "";
    /*let chofer:Usuario;
    this.servicioUsuarios.traerUsuarioPorEmail(emailChofer).subscribe(x => {
      chofer = x[0];
      chofer.estado = 1;
      this.servicioUsuarios.modificarUsuario(chofer);
    });*/
    this.servicioViajes.modificarViaje(viaje);
   // this.showSuccess("Viaje Puesto en pendiente");
    this.showSuccess("Asignación cancelada");
  }
  showError(msg){
    this.audioService.reproducirError();
    const alerta = this.alertCtrl.create({
      title: 'Error!',
      subTitle: msg,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
    return;
  }
  showSuccess(msg){
    this.audioService.reproducirExito();
    const alerta = this.alertCtrl.create({
      title: 'Exito!',
      subTitle: msg,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
    return;
  }

  private spin(status: boolean) {
    if(this.spinner === undefined && status === true) {
      this.spinner = this.modalCtrl.create(SpinnerPage);
      this.spinner.present();
    } else if(this.spinner !== undefined && status === false) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }
}
