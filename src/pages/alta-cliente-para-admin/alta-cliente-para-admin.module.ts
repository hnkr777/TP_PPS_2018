import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaClienteParaAdminPage } from './alta-cliente-para-admin';

@NgModule({
  declarations: [
    AltaClienteParaAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaClienteParaAdminPage),
  ],
})
export class AltaClienteParaAdminPageModule {}
