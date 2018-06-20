import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';
import { Geolocation } from '@ionic-native/geolocation';


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
    timeout: 3000,
    maximumAge: 0
  };

  public customOptions: any = {
    buttons: [{
      text: 'Borrar',
      handler: () => { this.fechaSalida = undefined; }
    }]
  }
  

  public origen: string = "";
  public destino: string = "";
  public nuevoViaje: Viaje;
  private fechaSalida: Date;
  private puntos: number;

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
    private geolocation: Geolocation
  ) {
    this.puntos = 0;
    this.nuevoViaje = new Viaje();
    
  }

  guardarViaje() {
    if(this.fechaSalida === undefined) {
      this.errorMsg('Error', 'Falta la fecha de salida del viaje.');
      return;
    }
    if(this.nuevoViaje.latOrigen === undefined || this.nuevoViaje.latDestino === undefined) {
      this.errorMsg('Error', 'Faltan completar las direcciones de origen o destino.');
      return;
    }

    //agregado por mauro
    this.nuevoViaje.fechaSalida=this.fechaSalida;
    
    this.servicioViajes.guardarNuevoViaje(this.nuevoViaje).then((data) => {
      this.Msg('Aviso', 'Viaje guardado correctamente.\n');
    }).catch((error) => {
      this.errorMsg('Error:', 'Error inesperado al guardar el viaje:\n'+error);
    });
  }

  init() {
    this.puntos = 0;
    this.nuevoViaje = new Viaje();
    this.origen = '';
    this.destino = '';
    this.polylines = [];
    this.labelIndex = 0;
    this.fechaSalida = undefined;
    this.ionViewDidLoad();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoViajePage');
    this.startMap();
  }

  cambiarHoraSalida() {
    this.nuevoViaje.fechaSalida = this.fechaSalida;
    console.log(this.fechaSalida);
  }

  tomarDireccionGPS() {
    if(this.puntos > 1) return;
    this.geolocation.getCurrentPosition({ 
      maximumAge: 3000, 
      timeout: 5000, 
      enableHighAccuracy: true 
    })
    .then((resp) => {
      //let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.nuevoViaje.latOrigen = resp.coords.latitude;
      this.nuevoViaje.longOrigen = resp.coords.longitude;
      this.addMarker(this.nuevoViaje.latOrigen, this.nuevoViaje.longOrigen);
      this.addPolyLine({ lat: this.nuevoViaje.latOrigen, lng: this.nuevoViaje.longOrigen });
      this.puntos++;
      //this.marcarUbicacion(resp.coords.latitude, resp.coords.longitude);
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
      this.marcarMapa(event.latLng.lat(), event.latLng.lng());
    });
  }

  marcarMapa(lat: number, long: number) {
    //if(this.origen !== '' && this.destino !== '') {
        //this.calcularDistancia();
      /*} else*/ if(this.puntos > 1) {
        this.calcularDistancia();
        //return;
      } else {
        this.addMarker(lat, long);
        this.addPolyLine({ lat: lat, lng: long });
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
      this.calcularDistancia();
    }
    
    console.log('Latitud[' + lat + ']  -  Longitud[' + long + ']');
    let marker = new google.maps.Marker({
      position: { lat: lat, lng: long },
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
    this.Msg('Info Viaje:', JSON.stringify(this.nuevoViaje));
  }

  recargarMapa() {
    this.init();
    //this.calcularDistancia();
  }

  getCoordsFromAddress() {

  }

  // dadas las coordenadas de latitud y longitud guardadas en nuevoViaje, llena los campos de direccion
  // duración del viaje y distancia del mismo
  calcularDistancia() {
    let ori;
    let des;
    this.cambiarHoraSalida();

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
            this.origen = data.originAddresses[0];
            this.destino = data.destinationAddresses[0];
            this.nuevoViaje.origen = this.origen;
            this.nuevoViaje.destino = this.destino;
            console.log('Dirección de origen: '+data.originAddresses);
            console.log('Dirección de destino: '+data.destinationAddresses);
            console.log('Estado: '+ status);
            this.Msg('Viaje', 'Duración aprox: ' + this.nuevoViaje.duracionViajeText + '\n\n Distancia: ' + this.nuevoViaje.distanciaText);
          } catch(e) {
            this.errorMsg('Error', 'Error de google maps en la localización: '+ e);
          }
        } else {
          this.errorMsg('Error', 'Error de google maps en la localización');
        }
      });
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
    if(this.origen !== '') { //  ? this.origen : ori
      this.servicioViajes.geoCoding(this.origen).then((data) => {
        if(data.status === 'OK') {
          console.log('Dirección: '+data.results[0].formatted_address);
          this.nuevoViaje.latOrigen = data.results[0].geometry.location.lat;
          this.nuevoViaje.longOrigen = data.results[0].geometry.location.lng;
        }
      });
    }
  }

  private oriCancel($event) {
    console.log($event);
  }

  private desInput($event) {
    //console.log($event);
    if(this.destino !== '') { //  ? this.origen : ori
      this.servicioViajes.geoCoding(this.destino).then((data) => {
        if(data.status === 'OK') {
          console.log('Dirección: '+data.results[0].formatted_address);
          this.nuevoViaje.latDestino = data.results[0].geometry.location.lat;
          this.nuevoViaje.longDestino = data.results[0].geometry.location.lng;
        }
      });
    }
  }

  private desCancel($event) {
    console.log($event);
  }

  buscarDirecciones() {
    if(this.puntos == 0 && this.nuevoViaje.latOrigen && this.origen !== '') {
      this.marcarMapa(this.nuevoViaje.latOrigen, this.nuevoViaje.longOrigen);
    }

    if(this.puntos == 1 && this.nuevoViaje.latDestino && this.destino !== '') {
      this.marcarMapa(this.nuevoViaje.latDestino, this.nuevoViaje.longDestino);
    }
    
  }

  errorMsg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
  }

  Msg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
  }

}
