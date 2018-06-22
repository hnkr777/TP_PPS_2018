import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, PopoverController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';

import * as moment from 'moment';
declare const google; // para google maps
/**
 * Generated class for the VisorViajesChoferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visor-viajes-chofer',
  templateUrl: 'visor-viajes-chofer.html',
})
export class VisorViajesChoferPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  public listaViajes: any[];
  public listaViajesAux: any[];
  private viaje: Viaje;
  private spinner;
  private usuario;



  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioViajes: ServicioViajesProvider,
    public modalCtrl: ModalController,

    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private popover: PopoverController ) {
 this.listaViajes=[];

  }




  ionViewDidLoad() {

    console.log('ionViewDidLoad VisorViajesChoferPage');
    this.spin(true);
    let ob = this.servicioViajes.traerViajes().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaViajesAux = data;
      //ob.unsubscribe();
      console.log(this.listaViajesAux);
      this.mostrarViajesSinChofer()
      
    });

    this.loadMap();
    this.startNavigating();


    //this.ubicacionActual();
    }

    loadMap(){
      
             let latLng = new google.maps.LatLng(-34.9290, 138.6010);
      
             let mapOptions = {
               center: latLng,
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP
             }
      
             this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
         }
      
         startNavigating(){
      
             let directionsService = new google.maps.DirectionsService;
             let directionsDisplay = new google.maps.DirectionsRenderer;
      
             directionsDisplay.setMap(this.map);
             directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      
             directionsService.route({
              origin: {lat: -34.6601056, lng: -58.3740561},
              destination: {lat: -34.58212745, lng: -58.44958711}, 
              waypoints: [
                {
                  location: {lat: -34.606998, lng: -58.39877534}, 
                  stopover: true
                }],

                travelMode: 'DRIVING',
             }, (res, status) => {
      
                 if(status == google.maps.DirectionsStatus.OK){
                     directionsDisplay.setDirections(res);
                 } else {
                     console.warn(status);
                 }
      
             });
      
         }





 ubicacionActual(){
  this.geolocation.getCurrentPosition().then((resp) => {
    console.log("latituddd");
    console.log(resp.coords.latitude);
    console.log("longituddd");
    console.log(resp.coords.longitude);
    //this.marcarMapa(resp.coords.latitude,resp.coords.longitude);
   }).catch((error) => {
     console.log('Error getting location', error);
   });
  }

  ubicacionPrueba()
  {
  //  this.marcarMapa(-34.59208861444155,-58.47150966152344);
  }



    








  private mostrarViajesSinChofer()
  {
    this.listaViajes=[];
   for(let i=0;i<this.listaViajesAux.length;i++)
     {
       if(this.listaViajesAux[i].correoChofer=="vacio"||this.listaViajesAux[i].correoChofer==""||this.listaViajesAux[i].correoChofer==undefined)
         {
           this.listaViajes.push(this.listaViajesAux[i]); 
         }
     }
     console.log(this.listaViajes);
     this.spin(false);
  }

  asignarViaje(viaje)
  {
    
    this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
    //console.log(this.usuario.correo);
    viaje.correoChofer=this.usuario.correo;
    console.log(viaje);
    this.servicioViajes.modificarViaje(viaje);

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
