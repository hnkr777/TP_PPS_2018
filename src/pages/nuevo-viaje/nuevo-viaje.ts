import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';
import { Jsonp } from '@angular/http';

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

  public origen: string = "";
  public destino: string = "";
  public nuevoViaje: Viaje;

  private puntos: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController
  ) {
    this.puntos = 0;
    this.nuevoViaje = new Viaje();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoViajePage');
    this.startMap();
    
    /*setTimeout(()=>{
      this.watchId = navigator.geolocation.watchPosition((position) => {
        this.addPolyLine({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        console.log({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }, (error) => {

      }, this.options);
    }, 1000);*/
  }

  
  startMap() {
    console.log('Mapa iniciado');
    
    let bsas = { lat: -34.6036844, lng: -58.3815591 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 11,
      center: bsas,
      mapTypeId: 'roadmap'
    });
    
    //this.encontrarUbicacion(); // no usar esta geolocalización, hay que usar el gps

    google.maps.event.addListener(this.map, 'click', (event) => {
      if(this.puntos > 1) {
        return;
      } else {
        this.addMarker(event.latLng, this.map);
        this.addPolyLine(event.latLng);
        this.puntos++;
      }
    });
  }
  
  addMarker(location, map) {
    if(this.puntos == 0) { // si es el punto A (origen)
      this.nuevoViaje.latOrigen = location.lat();
      this.nuevoViaje.longOrigen = location.lng();
      console.log('ORIGEN: '+ this.nuevoViaje.latOrigen + ', ' + this.nuevoViaje.longOrigen);
    } else if(this.puntos == 1) { // si es el punto B (destino)
      this.nuevoViaje.latDestino = location.lat();
      this.nuevoViaje.longDestino = location.lng();
      console.log('DESTINO: ' + this.nuevoViaje.latDestino + ', ' + this.nuevoViaje.longDestino);
      this.calcularDistancia();
    }
    
    console.log('Latitud[' + location.lat() + ']  -  Longitud[' + location.lng() + ']');
    let marker = new google.maps.Marker({
      position: location,
      label: this.labels[this.labelIndex++ % this.labels.length],
      map: map
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

  // dadas las coordenadas de latitud y longitud guardadas en nuevoViaje, llena los campos de direccion
  // duración del viaje y distancia del mismo
  calcularDistancia() {
    let ori = new google.maps.LatLng(this.nuevoViaje.latOrigen, this.nuevoViaje.longOrigen);
    let des = new google.maps.LatLng(this.nuevoViaje.latDestino, this.nuevoViaje.longDestino);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [ori, this.origen], // origin1, origin2
        destinations: [this.destino, des], // destinationA, destinationB
        travelMode: 'DRIVING',
        //transitOptions: TransitOptions,
        //drivingOptions: DrivingOptions,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, (data, status) => { // 'OK'
        //console.log(JSON.stringify(data));
        //{"rows":[{"elements":[{"status":"NOT_FOUND"},{"distance":{"text":"6,1 km","value":6144},"duration":{"text":"18 min","value":1107},"status":"OK"}]},{"elements":[{"status":"NOT_FOUND"},{"status":"NOT_FOUND"}]}],"originAddresses":["",""],"destinationAddresses":["","Tte. Gral. Juan Domingo Perón 4399, C1199ABE CABA, Argentina"]}
        this.nuevoViaje.duracionViaje = data.rows[0].elements[1].duration.value;
        this.nuevoViaje.duracionViajeText = data.rows[0].elements[1].duration.text;
        console.log('Duracion viaje en minutos: ' + this.nuevoViaje.duracionViaje + ' (' + this.nuevoViaje.duracionViajeText + ')');
        this.nuevoViaje.distancia = data.rows[0].elements[1].distance.value;
        this.nuevoViaje.distanciaText = data.rows[0].elements[1].distance.text;
        console.log('Distancia del viaje en metros: ' + this.nuevoViaje.distancia + ' (' + this.nuevoViaje.distanciaText + ')');
        this.origen = data.originAddresses[1];
        this.destino = data.destinationAddresses[1];
        this.nuevoViaje.destino = this.destino;
        console.log('Dirección de origen: '+data.originAddresses[1]);
        console.log('Dirección de destino: '+data.destinationAddresses[1]);
        console.log('Estado: '+ status);
      });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
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
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }
  }

}
