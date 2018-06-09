import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirstRunPage, MainPage } from "../pages";

/**
 * Splash animado
 *
 * 
 */

@IonicPage()
@Component({
  selector: 'animated-splash',
  templateUrl: 'animated-splash.html',
})
export class AnimatedSplashPage {

  splash: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.splash = false;
      this.navCtrl.setRoot(FirstRunPage);
    }, 4000); // este es el tiempo del splashscreen, default 4000
  }

}
