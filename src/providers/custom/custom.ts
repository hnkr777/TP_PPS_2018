
import { Injectable } from '@angular/core';
import { ThemeProvider, Themes } from '../theme/theme';
import { CustomConfig } from '../../clases/CustomConfig';

/*
  Generated class for the CustomProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomProvider {

  customConfig : CustomConfig;
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
      this.themes.activeTheme(Themes.custom);
    }
  }
}

