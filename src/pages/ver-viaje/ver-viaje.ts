import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

/**
 * Generated class for the VerViajePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-viaje',
  templateUrl: 'ver-viaje.html',
})
export class VerViajePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public themes: ThemeProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerViajePage');
    this.themes.refreshTheme();
  }
}
