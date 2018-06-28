import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { environment } from '../environments/environment';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularFirestore } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/providers';
import { User } from '../providers/providers';
import { Api } from '../providers/providers';
import { ServicioUsuariosProvider } from '../providers/servicio-usuarios/servicio-usuarios';
import { ServicioFotosProvider } from '../providers/servicio-fotos/servicio-fotos';
import { MyApp } from './app.component';
import { PagesModalPage } from "../pages/pages-modal/pages-modal";
import { AltaChoferPage } from '../pages/alta-chofer/alta-chofer';
import { SpinnerPage } from '../pages/pages-spinner/pages-spinner';
import { AbmVehiculosPage } from '../pages/abm-vehiculos/abm-vehiculos';
import { PagesModalVotacionPage } from '../pages/pages-modal-votacion/pages-modal-votacion';
import { AdminControlPanelPage } from '../pages/admin-control-panel/admin-control-panel';
import { ChoferPanelPage } from '../pages/chofer-panel/chofer-panel';
import { VerImagenPage } from '../pages/ver-imagen/ver-imagen';
import { ContentPage } from '../pages/content/content';
import { AnimatedSplashPage } from '../pages/animated-splash/animated-splash';

import { AltaClientePage } from '../pages/alta-cliente/alta-cliente';
import { AbmClienteProvider } from '../providers/abm-cliente/abm-cliente';
import { InicioClientePage } from '../pages/inicio-cliente/inicio-cliente';
import { AbmClientesPage } from '../pages/abm-clientes/abm-clientes';
import { AltaClienteParaAdminPage } from '../pages/alta-cliente-para-admin/alta-cliente-para-admin';
import { QrVehiculoClientePage } from '../pages/qr-vehiculo-cliente/qr-vehiculo-cliente';
import { QRScanner } from '@ionic-native/qr-scanner';
import { QrLeerVehiculoClientePage } from '../pages/qr-leer-vehiculo-cliente/qr-leer-vehiculo-cliente';
import { NuevoViajePage } from '../pages/nuevo-viaje/nuevo-viaje';
import { ServicioViajesProvider } from '../providers/servicio-viajes/servicio-viajes';
import { AbmSupervisoresPage } from '../pages/abm-supervisores/abm-supervisores';
import { AltaSupervisorPage } from '../pages/alta-supervisor/alta-supervisor';
import { VisorViajesPage } from '../pages/visor-viajes/visor-viajes';
import { VisorViajesChoferPage } from '../pages/visor-viajes-chofer/visor-viajes-chofer';
import { SuperControlPanelPage } from '../pages/supervisor-control-panel/supervisor-control-panel';
import { EncuestaChoferPage } from '../pages/encuesta-chofer/encuesta-chofer';
import { SupervisorPanelPage } from '../pages/supervisor-panel/supervisor-panel';
import { ListadoChoferesDisponiblesPage } from '../pages/listado-choferes-disponibles/listado-choferes-disponibles';
import { ListadoViajesSelecPage } from '../pages/listado-viajes-selec/listado-viajes-selec';
import { DetalleViajeChoferPage } from '../pages/detalle-viaje-chofer/detalle-viaje-chofer';
import {NativeAudio} from '@ionic-native/native-audio';
import { DetalleViajeClientePage } from '../pages/detalle-viaje-cliente/detalle-viaje-cliente';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    precioPorKm: 16.5,        // el precio por kilometro, es un coeficiente (multiplica a los km)
    minutosViajesEnCola: 30,  // tiempo antes de que los viajes aparezcan como validos para realizarse, sino son postdatados
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    PagesModalPage,
    SpinnerPage,
    PagesModalVotacionPage,
    AltaClientePage,
    InicioClientePage,
    AbmClientesPage,
    AltaClienteParaAdminPage,
    QrVehiculoClientePage,
    AltaChoferPage,
    AdminControlPanelPage,
    VerImagenPage,
    ContentPage,
    ChoferPanelPage,
    //AnimatedSplashPage,
    AbmVehiculosPage,
    QrLeerVehiculoClientePage,
    NuevoViajePage,
    AbmSupervisoresPage,
    AltaSupervisorPage,
    VisorViajesPage,
    EncuestaChoferPage,
    ListadoChoferesDisponiblesPage,
    SupervisorPanelPage,
    ListadoViajesSelecPage,
    VisorViajesChoferPage,
    SuperControlPanelPage,
    DetalleViajeChoferPage,
    DetalleViajeClientePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PagesModalPage,
    SpinnerPage,
    PagesModalVotacionPage,
    AltaChoferPage,
    AdminControlPanelPage,
    VerImagenPage,
    ContentPage,
    ChoferPanelPage,
//AnimatedSplashPage,
    AltaClientePage,
    InicioClientePage,
    AbmClientesPage,
    AltaClienteParaAdminPage,
    QrVehiculoClientePage,
    AbmVehiculosPage,
    QrLeerVehiculoClientePage,
    NuevoViajePage,
    AbmSupervisoresPage,
    AltaSupervisorPage,
    VisorViajesPage,
    SuperControlPanelPage,
    EncuestaChoferPage,
    ListadoChoferesDisponiblesPage,
    SupervisorPanelPage,
    ListadoViajesSelecPage,
    VisorViajesChoferPage,
    DetalleViajeChoferPage,
    DetalleViajeClientePage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    QRScanner,
    Geolocation,
    //SplashScreen,
    StatusBar,
    ServicioFotosProvider,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AbmClienteProvider,
    QRScanner,
    ServicioUsuariosProvider,
    ServicioFotosProvider,
    AbmClienteProvider,
    ServicioViajesProvider,
    NativeAudio
  ]
})
export class AppModule { }
