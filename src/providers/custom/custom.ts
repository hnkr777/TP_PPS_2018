
import { Injectable } from '@angular/core';
import { ThemeProvider, Themes } from '../theme/theme';
import { CustomConfig } from '../../clases/CustomConfig';
import { ServicioFotosProvider } from '../providers';

@Injectable()
export class CustomProvider {

  customConfig : CustomConfig;
  
  serv: ServicioFotosProvider;

  constructor(private themes : ThemeProvider) {
    if(localStorage.getItem('custom')) {
      this.getCustomConfig();
    }
  }

  getCustomConfig() {
    if(this.customConfig) {
      return this.customConfig;
    } else if(localStorage.getItem('custom')) {
      let cus = localStorage.getItem('custom');
      this.customConfig = JSON.parse(cus);
      return this.customConfig;
    } else {
      this.customConfig = new CustomConfig();
      return this.customConfig;
    }
  }

  saveCustom(custom) {
    if(custom) {
      this.customConfig = custom;
      let c = JSON.stringify(this.customConfig);
      localStorage.setItem('custom', c);
      //sessionStorage.setItem('foto', this.customConfig.foto);
      this.themes.activeTheme(Themes.custom);
    }
  }
}
