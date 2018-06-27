import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Settings } from '../../providers/providers';
import { ChoferPanelPage } from '../chofer-panel/chofer-panel';

/**
 * Página de encuesta de chofer
 * 
 *
 */
@IonicPage()
@Component({
  selector: 'encuesta-chofer',
  templateUrl: 'encuesta-chofer.html'
})
export class EncuestaChoferPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'ENCUESTA_TITLE';
  pageTitle: string;

  subSettings: any = EncuestaChoferPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    private viewCtrl: ViewController
  ) {

  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3],
      optRange: [this.options.optRange],
      optRadio: [this.options.optRadio]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    //this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  accionAceptar() {
    this.navCtrl.setRoot(ChoferPanelPage);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
}