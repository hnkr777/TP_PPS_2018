import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrLeerEncuestaClientePage } from './qr-leer-encuesta-cliente';

@NgModule({
  declarations: [
    QrLeerEncuestaClientePage,
  ],
  imports: [
    IonicPageModule.forChild(QrLeerEncuestaClientePage),
  ],
})
export class QrLeerEncuestaClientePageModule {}
