import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { environment } from '../environments/environment';

import { AngularFirestore } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';

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
import { PagesModalVotacionPage } from '../pages/pages-modal-votacion/pages-modal-votacion';
import { AdminControlPanelPage } from '../pages/admin-control-panel/admin-control-panel';
import { ChoferPanelPage } from '../pages/chofer-panel/chofer-panel';
import { VerImagenPage } from '../pages/ver-imagen/ver-imagen';
import { ContentPage } from '../pages/content/content';
import { QRScanner } from '@ionic-native/qr-scanner';

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
    option1: true,
    option2: 'Ionitron J. Framework',
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
    AltaChoferPage,
    AdminControlPanelPage,
    VerImagenPage,
    ContentPage,
    ChoferPanelPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
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
    ChoferPanelPage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    QRScanner,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServicioUsuariosProvider,
    ServicioFotosProvider
  ]
})
export class AppModule { }
