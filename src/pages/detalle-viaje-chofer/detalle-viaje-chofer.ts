import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, PopoverController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { EmailComposer } from '@ionic-native/email-composer';
//import * as moment from 'moment';
declare const google; // para google maps
/**
 * Generated class for the DetalleViajeChoferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-viaje-chofer',
  templateUrl: 'detalle-viaje-chofer.html',
})
export class DetalleViajeChoferPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  viaje;
  usuario;
  mostrarBotonRealizarViaje;
  mostrarBotonFinalizarViaje;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    private servicioViajes: ServicioViajesProvider,
    private servicioUsuarios:ServicioUsuariosProvider,
    public alertCtrl: AlertController,
    private emailComposer: EmailComposer
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleViajeChoferPage');
    this.viaje = this.navParams.get('viaje');
    console.log(this.viaje);
    if( this.viaje.estado == 1 ) {
      this.mostrarBotonRealizarViaje=false;
      this.mostrarBotonFinalizarViaje=true;
    } else {
      this.mostrarBotonRealizarViaje=true;
      this.mostrarBotonFinalizarViaje=false;
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
      origin: {lat: this.viaje.miLatitudChofer, lng: this.viaje.miLongitudChofer},
      destination: {lat: this.viaje.latDestino, lng: this.viaje.longDestino}, 
      waypoints: [{
        location: {lat: this.viaje.latOrigen, lng: this.viaje.longOrigen},
        stopover: true
      }],
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
      
  realizarViaje() {
        this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
         console.log(this.usuario);
        
         if(this.usuario.estado==2)
          {
            const alerta = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Usted esta realizando otro viaje actualmente',
              cssClass:"miClaseDanger",
              buttons: ['Aceptar']
            });
            alerta.present();
            return;
          }

        //choferCorreo tiene que ser el correo del chofer que va a realizar el viaje
        this.viaje.correoChofer=this.usuario.correo;
        //el viaje tiene que pasar a estado 1 que significa "en curso" 
        //cuando se finaliza el viaje el estado pasa a 2
        this.viaje.estado=1;
        // el chofer tiene que pasar a estado 2 que es "realizando viaje"
        this.usuario.estado=2;
        this.mostrarBotonRealizarViaje=false;
        this.mostrarBotonFinalizarViaje=true;
       // console.log(this.viaje);
        //console.log(this.usuario);
       this.servicioViajes.modificarViaje(this.viaje);
       this.servicioUsuarios.modificarUsuario(this.usuario);
       sessionStorage.setItem("usuario", JSON.stringify(this.usuario));

       let alerta = this.alertCtrl.create({
        title: "Viaje comenzado!",
        subTitle: "Vaya a buscar al cliente al punto B",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
       }

      finalizarViaje()
      {
        this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
        console.log(this.usuario);
        this.usuario.estado=1;
        this.viaje.estado=2;
        this.servicioViajes.modificarViaje(this.viaje);
        this.servicioUsuarios.modificarUsuario(this.usuario);
        sessionStorage.setItem("usuario", JSON.stringify(this.usuario));

        let alerta = this.alertCtrl.create({
          title: "Viaje finalizado!",
          subTitle: "Total a cobrar: $"+this.viaje.monto,
          cssClass:"miClaseAlert",
        buttons: ['Aceptar']
      });
       alerta.present();

        this.viewCtrl.dismiss();
      }

      cancelarViaje()
      {
        this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
        console.log(this.usuario);
        this.usuario.estado=1;
        //cancelado
        this.viaje.estado=0;
       this.viaje.correoChofer="";
       
                 //mando mail
                 let email = {
                  to: this.viaje.correoCliente,
                  subject: 'Cambio de estado de viaje',
                  body: ' Estimado/a, su viaje pedido el '+this.viaje.fechaRegistroString+' ha cambiado su estado a "Pendiente. En breve será reasignado y comenzado. Disculpe las molestias. RADIX. Saludos',
                  isHtml: true
                };
                
                // Send a text message using default options
                this.emailComposer.open(email);

        this.servicioViajes.modificarViaje(this.viaje);
        this.servicioUsuarios.modificarUsuario(this.usuario);
        sessionStorage.setItem("usuario", JSON.stringify(this.usuario));

        let alerta = this.alertCtrl.create({
          title: "Viaje cancelado!",
          subTitle: "El chofer canceló viaje",
          cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
       alerta.present();

        this.viewCtrl.dismiss();
      }


  closeModal() {
    this.viewCtrl.dismiss();
  }

}
