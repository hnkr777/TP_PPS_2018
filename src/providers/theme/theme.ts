import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ThemeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ThemeProvider {

  private subject : Subject<Themes> = new Subject<Themes>();
  changeTheme : Observable<Themes> = this.subject.asObservable();

  currentTheme : Themes = Themes.professional;
  constructor() {
    if(localStorage.getItem('tema')) {
      this.currentTheme = localStorage.getItem('tema') as Themes;
      setTimeout((data) => {
        console.log('Theme-provider time tick');
        this.refreshTheme();
      }, 100);
    } else {
      this.activeTheme(Themes.professional);
    }
  }


  refreshTheme() {
    if(localStorage.getItem('tema')) {
      this.currentTheme = localStorage.getItem('tema') as Themes;
      this.activeTheme(this.currentTheme);
    }
  }

  activeTheme(theme : Themes) {
    this.currentTheme = theme;
    localStorage.setItem('tema', this.currentTheme);
    this.subject.next(this.currentTheme);
  }


  isArgentina() {
    return this.currentTheme == Themes.argentina;
  }

  isCustom() {
    return this.currentTheme == Themes.custom;
  }

  isNaif() {
    return this.currentTheme == Themes.naif;
  }

  isProfesional() {
    return this.currentTheme == Themes.professional;
  }
}


export enum Themes {
  naif = 'naif',
  professional = 'professional',
  custom = 'custom',
  argentina = 'argentina',
}