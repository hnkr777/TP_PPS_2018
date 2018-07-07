import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { Viaje } from '../../clases/viaje';
import { Geolocation } from '@ionic-native/geolocation';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { Usuario } from '../../clases/usuario';
//import * as moment from 'moment';

declare const google; // para google maps

/**
 * Página para pedir nuevo viaje, según la consigna cualquiera 
 * que ingresó al sistema debería poder usarla...
 * 
 * 
 */

@IonicPage()
@Component({
  selector: 'nuevo-viaje',
  templateUrl: 'nuevo-viaje.html',
})
export class NuevoViajePage {
  @ViewChild('map') mapElement: ElementRef;
  polylines: Array<object> = [];
  labels = ['A', 'B'];
  labelIndex = 0;
  map: any;
  watchId: any;

  options = {
    enableHighAccuracy: true,
    timeout: 8000,
    maximumAge: 0
  };

  public customOptions: any = {
    buttons: [{
      text: 'Borrar',
      handler: () => { this.nuevoViaje.fechaSalida = undefined; }
    }]
  }
  
  private spinner;
  public origen: string = "";
  public destino: string = "";
  public nuevoViaje: Viaje;
  private fechaSalidaString: string;
  private puntos: number;
  private verBoton: boolean = false;
  varOri: string = '';
  varDes: string = '';
  private fechaSalida;
  private usuario: Usuario;
  private ahora: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioFotos: ServicioFotosProvider,
    private servicioViajes: ServicioViajesProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private popover: PopoverController,
    public audioService:ServicioAudioProvider
  ) {
    this.puntos = 0;
    this.nuevoViaje = new Viaje();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.nuevoViaje.correoCliente = this.usuario.correo;
    this.ahora = Date.now();
    this.fechaSalidaString = this.calculateTime('-3');
  }

  guardarViaje() {
    this.audioService.reproducirClick();
    this.hidePops();
    if(this.nuevoViaje.fechaSalida === undefined) {
      this.errorMsg('Error', 'Falta la fecha de salida del viaje.');
      return;
    }
    if(this.nuevoViaje.latOrigen === undefined || this.nuevoViaje.latDestino === undefined) {
      this.errorMsg('Error', 'Faltan completar las direcciones de origen o destino.');
      return;
    }
    this.spin(true);

    //agregado por mauro
   // this.nuevoViaje.fechaSalida=this.fechaSalida;
    
    this.servicioViajes.guardarNuevoViaje(this.nuevoViaje).then((data) => {
      this.spin(false);
      this.Msg('Aviso', 'Su viaje está en estado pendiente.\n');
      if(this.navCtrl.canGoBack()) {
        this.navCtrl.pop(); // volvemos a la página anterior a pedir viaje
      }
    }).catch((error) => {
      this.spin(false);
      this.errorMsg('Error:', 'Error inesperado al solicitar el viaje:\n'+error);
    });
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
    //directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
      origin: {lat: this.nuevoViaje.latOrigen, lng: this.nuevoViaje.longOrigen},
      destination: {lat: this.nuevoViaje.latDestino, lng: this.nuevoViaje.longDestino}, 
      /*waypoints: [{
        location: {lat: this.viaje.latOrigen, lng: this.viaje.longOrigen},
        stopover: true
      }],*/
      travelMode: 'DRIVING',
      },
      (res, status) => {
        console.log(JSON.stringify(res));
        console.log(JSON.stringify(status));
        if(status == google.maps.DirectionsStatus.OK) {
          this.getData(res);
          directionsDisplay.setDirections(res);
        } else {
            console.warn(status);
        }
      }
    );
  }

  getData(data) {
    try {
      this.nuevoViaje.duracionViaje = data.routes[0].legs[0].duration.value;
      this.nuevoViaje.duracionViajeText = data.routes[0].legs[0].duration.text;
      console.log('Duracion viaje en minutos: ' + this.nuevoViaje.duracionViaje + ' (' + this.nuevoViaje.duracionViajeText + ')');
      this.nuevoViaje.distancia = data.routes[0].legs[0].distance.value;
      this.nuevoViaje.distanciaText = data.routes[0].legs[0].distance.text;
      console.log('Distancia del viaje en metros: ' + this.nuevoViaje.distancia + ' (' + this.nuevoViaje.distanciaText + ')');
      this.origen = data.routes[0].legs[0].start_address;
      this.destino = data.routes[0].legs[0].end_address;
      this.nuevoViaje.origen = this.origen;
      this.nuevoViaje.destino = this.destino;
      this.nuevoViaje.nombreCliente = this.usuario.nombre + ' ' + this.usuario.apellido;

      this.nuevoViaje.monto = this.calcularMonto(this.nuevoViaje.distancia, this.nuevoViaje.duracionViaje);
      this.infoViaje();
      this.checkCondiciones();
    } catch(e) {
      this.errorMsg('Error', 'Error de google maps en la localización: '+ e);
    }
  }

  init() {
    this.hidePops();
    this.puntos = 0;
    this.nuevoViaje = new Viaje();
    this.origen = '';
    this.destino = '';
    this.nuevoViaje.estado = 0;
    this.polylines = [];
    this.labelIndex = 0;
    this.verBoton = false;
    const inputs1: any = document.getElementById("sbarori").getElementsByTagName("INPUT");
    inputs1[0].disabled = false;

    const inputs2: any = document.getElementById("sbardes").getElementsByTagName("INPUT");
    inputs2[0].disabled = false;
    
    this.ionViewDidLoad();
  }

  calculateTime(offset: any) {
    // create Date object for current location
    let d = new Date();

    // create new Date object for different city
    // using supplied offset
    let nd = new Date(d.getTime() + (3600000 * offset));

    return nd.toISOString();
  }

  checkCondiciones() {
    this.hidePops();
    if(this.fechaSalidaString !== undefined) {
      this.nuevoViaje.fechaSalida = Date.parse(this.fechaSalidaString);
      this.nuevoViaje.fechaSalida += 1000 * 60 * 60 * 3;
      this.ahora = Date.now(); 
      let val: number = 1000 * 60 * 5;
      if (this.nuevoViaje.fechaSalida + val < this.ahora) {
        this.errorMsg('Error', 'No puede pedir viajes al pasado');
        this.fechaSalidaString = this.calculateTime('-3'); //Date.now();
      }
      console.log(this.nuevoViaje.getFechaSalida());
    }
    //moment().date(); //moment(now.format(), moment.ISO_8601).format();
    this.verBoton = (this.nuevoViaje.fechaSalida!==undefined && this.puntos>1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoViajePage');
    //this.nuevoViaje.fechaSalida = new Date(Date.now());
    

    this.startMap();
  }

  tomarDireccionGPS() {
    this.hidePops();
    if(this.puntos > 1) return;
    this.geolocation.getCurrentPosition({
      maximumAge: 3000, 
      timeout: 8000,
      enableHighAccuracy: true 
    })
    .then((resp) => {
      if(this.puntos == 0) {
        this.nuevoViaje.latOrigen = resp.coords.latitude;
        this.nuevoViaje.longOrigen = resp.coords.longitude;
      } else {
        this.nuevoViaje.latDestino = resp.coords.latitude;
        this.nuevoViaje.longDestino = resp.coords.longitude;
      }
      this.addMarker(resp.coords.latitude, resp.coords.longitude);
      //this.addPolyLine({ lat: resp.coords.latitude, lng: resp.coords.longitude });
      this.puntos++;
      this.map.setCenter({ lat: resp.coords.latitude, lng: resp.coords.longitude });
      //this.marcarUbicacion(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      this.errorMsg('Error GPS', 'GPS desactivado.\n');
    });
  }
  
  startMap() {
    console.log('Mapa iniciado');
    
    let bsas = { lat: -34.6036844, lng: -58.3815591 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 11,
      center: bsas,
      mapTypeId: 'roadmap'
    });
    
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.hidePops();
      this.marcarMapa(event.latLng.lat(), event.latLng.lng());
    });
  }

  marcarMapa(lat: number, long: number) {
    if(this.puntos > 1) {
      //this.calcularDistancia();
      this.infoViaje();
    } else {
      this.addMarker(lat, long);
      //this.addPolyLine({ lat: lat, lng: long });
      this.puntos++;
    }
  }
  
  addMarker(lat: number, long: number) {
    if(this.puntos == 0) { // si es el punto A (origen)
      this.nuevoViaje.latOrigen = lat;
      this.nuevoViaje.longOrigen = long;
      console.log('ORIGEN: '+ this.nuevoViaje.latOrigen + ', ' + this.nuevoViaje.longOrigen);
    } else if(this.puntos == 1) { // si es el punto B (destino)
      this.nuevoViaje.latDestino = lat;
      this.nuevoViaje.longDestino = long;
      console.log('DESTINO: ' + this.nuevoViaje.latDestino + ', ' + this.nuevoViaje.longDestino);
      //this.calcularDistancia();
      this.startNavigating();
    }
    
    console.log('Latitud[' + lat + ']  -  Longitud[' + long + ']');
    let marker = new google.maps.Marker({
      position: { lat: lat, lng: long },
      color: '#FFFF00',
      label: this.labels[this.labelIndex++ % this.labels.length],
      map: this.map
    });
  }

  addPolyLine(latLng) {

    this.polylines.push(latLng);
    if (this.polylines.length > 1) {

      var flightPath = new google.maps.Polyline({
        path: this.polylines,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      flightPath.setMap(this.map);
    }
  }

  infoViaje() {
    let buf: string;
    let r: string = '\n';
    let c: Viaje = this.nuevoViaje;
    if(this.nuevoViaje.fechaSalida!==undefined && this.puntos>1) this.verBoton = true;
    buf = 'Fecha de salida: ' + (c.fechaSalida===undefined ? 'Sin fecha' : c.getFechaSalida()) + r +
          'Distancia: ' + c.distanciaText + r +
          'Duración: ' + c.duracionViajeText + r +
          'Origen: ' + c.origen + r +
          'Destino: ' + c.destino + r;
          //'Monto: $ ' + c.monto + r;
    this.Msg('Info Viaje:', buf);
  }

  recargarMapa() {
    this.init();
    //this.calcularDistancia();
  }

  // dadas las coordenadas de latitud y longitud guardadas en nuevoViaje, llena los campos de direccion
  // duración del viaje y distancia del mismo
  calcularDistancia() {
    let ori;
    let des;

    ori = new google.maps.LatLng(this.nuevoViaje.latOrigen, this.nuevoViaje.longOrigen);
    des = new google.maps.LatLng(this.nuevoViaje.latDestino, this.nuevoViaje.longDestino);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [ori],
        destinations: [des],
        travelMode: 'DRIVING',
        //transitOptions: TransitOptions,
        //drivingOptions: DrivingOptions,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, (data, status) => {
        //console.log(JSON.stringify(data));
        //console.log(JSON.stringify(status));
        if(status === 'OK') {
          try {
            this.nuevoViaje.duracionViaje = data.rows[0].elements[0].duration.value;
            this.nuevoViaje.duracionViajeText = data.rows[0].elements[0].duration.text;
            console.log('Duracion viaje en minutos: ' + this.nuevoViaje.duracionViaje + ' (' + this.nuevoViaje.duracionViajeText + ')');
            this.nuevoViaje.distancia = data.rows[0].elements[0].distance.value;
            this.nuevoViaje.distanciaText = data.rows[0].elements[0].distance.text;
            console.log('Distancia del viaje en metros: ' + this.nuevoViaje.distancia + ' (' + this.nuevoViaje.distanciaText + ')');
            this.origen = data.start_address;
            this.destino = data.end_address;
            this.nuevoViaje.origen = this.origen;
            this.nuevoViaje.destino = this.destino;
            //console.log('Dirección de origen: '+data.originAddresses);
            console.log('Dirección de origen: '+data.start_address);
            //console.log('Dirección de destino: '+data.destinationAddresses);
            console.log('Dirección de destino: '+data.end_address);
            console.log('Estado: '+ status);
            this.nuevoViaje.monto = this.calcularMonto(this.nuevoViaje.distancia, this.nuevoViaje.duracionViaje);
            this.infoViaje();
            this.checkCondiciones();
          } catch(e) {
            this.errorMsg('Error', 'Error de google maps en la localización: '+ e);
          }
        } else {
          this.errorMsg('Error', 'Error de google maps en la localización');
        }
      });
  }

  calcularMonto(dist: number, dura: number): number { // distancia en metros, duración en minutos
    let ret: number;
    ret = ((dist * dura) / 100000) + 40;
    return (parseFloat(ret.toFixed(2)));
  }

  marcarUbicacion(latitud: number, longitud: number) {
    let infoWindow = new google.maps.InfoWindow({ map: this.map });

    if (latitud !== undefined && longitud !== undefined) {
      navigator.geolocation.getCurrentPosition((position) => {
        
        let pos = {
          lat: latitud,
          lng: longitud
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Usted está aquí');

        let marker = new google.maps.Marker({
          position: pos,
          map: this.map
        });

        this.map.setCenter(pos);
      }, () => {
        this.errorMsg('Error', 'No se pudo obtener la localización');
        this.handleLocationError(true, infoWindow, this.map.getCenter());
      });
    } else {
      this.errorMsg('Error', 'No se pudo obtener la localización');
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    this.errorMsg('Error', 'No se pudo obtener la localización');
    infoWindow.setContent(browserHasGeolocation ?
      'Error: el servicio de Geolocalización falló.' :
      'Error: tu navegador no soporta geolocalización.');
  }

  // funcion deprecada, dejar por las dudas...
  encontrarUbicacion() {
    let infoWindow = new google.maps.InfoWindow({ map: this.map });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Usted está aquí');

        let marker = new google.maps.Marker({
          position: pos,
          map: this.map
        });
        this.map.setCenter(pos);
      }, () => {
        this.handleLocationError(true, infoWindow, this.map.getCenter());
      });
    } else {
      this.errorMsg('Error', 'No se pudo obtener la localización');
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }
  }
  
  private oriInput($event) {
    //console.log($event);
    if(this.origen.length > 4) {
      this.servicioViajes.geoCoding(this.origen).then((data) => {
        if(data.status === 'OK') {
          //console.log('Dirección: '+data.results[0].formatted_address);
          document.getElementById('poporigen').style.setProperty('display', 'block');
          this.varOri = data.results[0].formatted_address;
          this.nuevoViaje.latOrigen = data.results[0].geometry.location.lat;
          this.nuevoViaje.longOrigen = data.results[0].geometry.location.lng;
        }
      });
    } else { this.varOri = '';}
  }

  private hidePops() {
    document.getElementById('poporigen').style.setProperty('display', 'none');
    document.getElementById('popdestino').style.setProperty('display', 'none');
  }

  setOrigen() {
    this.origen = this.varOri;
    const inputs: any = document.getElementById("sbarori").getElementsByTagName("INPUT");
    inputs[0].disabled = true;
    this.varOri = '';
    this.hidePops();
    this.buscarDirecciones();
  }

  setDestino() {
    this.destino = this.varDes;
    const inputs: any = document.getElementById("sbardes").getElementsByTagName("INPUT");
    inputs[0].disabled = true;
    this.varDes = '';
    this.hidePops();
    this.buscarDirecciones();
  }

  private oriCancel($event) {
    this.hidePops();
    console.log($event);
  }

  private desInput($event) {
    //console.log($event);
    if(this.destino.length > 4) { // if(this.destino !== '') {
      this.servicioViajes.geoCoding(this.destino).then((data) => {
        if(data.status === 'OK') {
          //console.log('Dirección: '+data.results[0].formatted_address);
          document.getElementById('popdestino').style.setProperty('display', 'block');
          this.varDes = data.results[0].formatted_address;
          this.nuevoViaje.latDestino = data.results[0].geometry.location.lat;
          this.nuevoViaje.longDestino = data.results[0].geometry.location.lng;
        }
      });
    }
  }

  private desCancel($event) {
    this.hidePops();
    console.log($event);
  }

  buscarDirecciones() {
    if(this.puntos == 0 && this.nuevoViaje.latOrigen && this.origen !== '') {
      this.marcarMapa(this.nuevoViaje.latOrigen, this.nuevoViaje.longOrigen);
    } else 

    if(this.puntos == 1 && this.nuevoViaje.latDestino && this.destino !== '') {
      this.marcarMapa(this.nuevoViaje.latDestino, this.nuevoViaje.longDestino);
    }
  }

  errorMsg(titulo: string, mensaje: string) {
    this.audioService.reproducirError();
    this.hidePops();
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
  }

  Msg(titulo: string, mensaje: string) {
    this.audioService.reproducirExito();
    this.hidePops();
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
  }
  
  private spin(status: boolean) {
    this.hidePops();
    if(this.spinner === undefined && status === true) {
      this.spinner = this.modalCtrl.create(SpinnerPage);
      this.spinner.present();
    } else if(this.spinner !== undefined && status === false) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }

}
