import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrLeerVehiculoClientePage } from './qr-leer-vehiculo-cliente';

@NgModule({
  declarations: [
    QrLeerVehiculoClientePage,
  ],
  imports: [
    IonicPageModule.forChild(QrLeerVehiculoClientePage),
  ],
})
export class QrLeerVehiculoClientePageModule {}
