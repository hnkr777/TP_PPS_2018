import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, QueryFn } from 'angularfire2/database';

/*
 * Clase EnviarMailProvider provider.
 *
 */
@Injectable()
export class EnviarMailProvider {
  constructor(public database : AngularFireDatabase) {
  }

  /**
   * Al pushear a esta lista, se envia un mail a traves de una funcion que esta en firebase
   * @param to a quien
   * @param subject asunto
   * @param content contenido
   */
  public sendMail(to, subject, content) {
    
    return this.database.list('/emails').push({
      to: to,
      subject: subject,
      content: content
    });
  }
  
}
