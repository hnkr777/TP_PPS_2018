import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrVehiculoClientePage } from './qr-vehiculo-cliente';

@NgModule({
  declarations: [
    QrVehiculoClientePage,
  ],
  imports: [
    IonicPageModule.forChild(QrVehiculoClientePage),
  ],
})
export class QrVehiculoClientePageModule {}
