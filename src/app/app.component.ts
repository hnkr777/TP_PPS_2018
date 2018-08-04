import { Component, ViewChild, OnInit } from '@angular/core';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { SplashScreen } from '../pages/pages';
import { Settings } from '../providers/providers';
import { SettingsPage } from '../pages/settings/settings';
import { ServicioAudioProvider } from '../providers/servicio-audio/servicio-audio';
import { AppState } from './app.global';
import { CustomPage } from '../pages/custom/custom';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage = SplashScreen;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any, id: number, icon: string}>;

  selectedTheme: any;
  tema: string;

  constructor(
    private translate: TranslateService, 
    platform: Platform, 
    settings: Settings, 
    private config: Config, 
    private statusBar: StatusBar, 
    public global: AppState,
    public audio: ServicioAudioProvider
    //private splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
    });

    this.pages = [
      { title: 'Professional', component: SplashScreen, id: 1, icon: 'arrow-round-forward' },
      { title: 'Argentina', component: SplashScreen, id: 2, icon: 'arrow-round-forward' },
      { title: 'Naif', component: SplashScreen, id: 3, icon: 'arrow-round-forward' },
      { title: 'Custom', component: SettingsPage, id: 4, icon: 'arrow-round-forward' },
      { title: 'Configurar custom', component: SettingsPage, id: 5, icon: 'options' }
    ];

    this.initTranslate();

    
  }

  ngOnInit() {
    this.tema = localStorage.getItem('tema');
    if( this.tema !== null ) {
      this.changeTheme(this.tema);
    } else {
      console.warn('No hay tema seleccionado, se carga el tema por defecto.');
      this.setProfessional();
    }

    /*setInterval(() => {
      this.tema = localStorage.getItem('tema');
      if(this.tema !== null) this.changeTheme(this.tema);
      else this.setProfessional();
    }, 1000);*/
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  changeTheme(theme: any) {
    console.log("Cambiando tema a "+ theme);
    this.global.set('theme', theme);
  }
  
  openPage(page) {
    console.log(page);
    switch (page.id) {
      case 1:
        this.audio.reproducirClick();
        this.setProfessional();
      break;
    
      case 2:
        this.audio.reproducirClick();
        this.setArgentina();
      break;

      case 3:
        this.audio.reproducirClick();
        this.setNaif();
      break;

      case 4:
        this.audio.reproducirClick();
        this.setCustom();
        break;

      case 5:
        this.audio.reproducirClick();
        this.confCustom();
        this.nav.push(CustomPage);
      break;

      default:
        break;
    }
  }

  setArgentina() {
    this.guardarTema('argentina');
    this.changeTheme('argentina');
  }

  setNaif() {
    this.guardarTema('naif');
    this.changeTheme('naif');
  }

  setProfessional() {
    this.guardarTema('professional');
    this.changeTheme('professional');
  }

  setCustom() {
    this.guardarTema('custom');
    this.changeTheme('custom');
  }

  confCustom() {
    
  }

  guardarTema(tema: string) {
    localStorage.setItem('tema', tema);
  }

}
