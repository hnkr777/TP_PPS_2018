import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, PopoverController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { QrLeerEncuestaClientePage } from '../../pages/qr-leer-encuesta-cliente/qr-leer-encuesta-cliente';
import { InicioClientePage } from '../../pages/inicio-cliente/inicio-cliente';
import { EncuestaClientePage } from '../../pages/encuesta-cliente/encuesta-cliente';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
//import * as moment from 'moment';
declare const google; // para google maps

/**
 * Generated class for the DetalleViajeClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-viaje-cliente',
  templateUrl: 'detalle-viaje-cliente.html',
})
export class DetalleViajeClientePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  viaje;
  usuario;
  chofer;
  //mostrarBotonRealizarViaje;
  mostrarBotonCancelarViaje;
  mostrarBotonRealizarEncuesta;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    private servicioViajes: ServicioViajesProvider,
    private servicioUsuarios:ServicioUsuariosProvider,
    public alertCtrl: AlertController,
    public audioService:ServicioAudioProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleViajeClientePage');
    this.viaje = this.navParams.get('viaje');
    console.log(this.viaje);
   /* if( this.viaje.estado == 1 ) {
     // this.mostrarBotonRealizarViaje=false;
      this.mostrarBotonFinalizarViaje=true;
    } else {
      this.mostrarBotonRealizarViaje=true;
      this.mostrarBotonFinalizarViaje=false;
    }*/
        if( this.viaje.estado == 0 || this.viaje.estado == 1 ) {
      this.mostrarBotonCancelarViaje=true;
    } else {
      this.mostrarBotonCancelarViaje=false;
    }

    if( this.viaje.estado == 2 && this.viaje.encuestaRealizada==undefined) {
      this.mostrarBotonRealizarEncuesta=true;
    } 
    if(this.viaje.estado == 2 && this.viaje.encuestaRealizada==1) {
      this.mostrarBotonRealizarEncuesta=false;
    }
    this.loadMap();
    this.startNavigating();
  }

  loadMap() {
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startNavigating() {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
      origin: {lat: this.viaje.latOrigen, lng: this.viaje.longOrigen},
      destination: {lat: this.viaje.latDestino, lng: this.viaje.longDestino}, 
     /* waypoints: [{
        location: {lat: this.viaje.latOrigen, lng: this.viaje.longOrigen},
        stopover: true
      }],*/
      travelMode: 'DRIVING',
      },
      (res, status) => {
        if(status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(res);
        } else {
            console.warn(status);
        }
      }
    );
  }

  //cancelar viaje por cliente
  cancelarViaje()
  {
    this.chofer={};
    if(this.viaje.estado==1)
    {
      this.chofer.correo=this.viaje.correoChofer;
      this.chofer.estado=1;
      console.log(this.chofer);
      this.servicioUsuarios.modificarUsuario(this.chofer);
      }

      //cambio estado a cancelado por cliente
    this.viaje.estado=3;
    this.servicioViajes.modificarViaje(this.viaje);
   
        this.audioService.reproducirError();
        let alerta = this.alertCtrl.create({
      title: "Viaje cancelado!",
      subTitle: "Usted canceló el viaje",
      cssClass:"miClaseDanger",
    buttons: ['Aceptar']
  });
   alerta.present();

    //this.viewCtrl.dismiss();
    this.navCtrl.setRoot(InicioClientePage);
  }

  realizarEncuesta()
  {
      window.document.querySelector('ion-content').classList.add('transparentBody');
      window.document.querySelector('ion-app').classList.add('transparentBody');
    //descomentar
   this.navCtrl.push(QrLeerEncuestaClientePage,{viaje: this.viaje}); // escaner QR
  
  //this.navCtrl.push(EncuestaClientePage,{viaje: this.viaje});
  }

  closeModal() {
   // this.viewCtrl.dismiss();
   this.navCtrl.setRoot(InicioClientePage);
  }

}
