import { Directive } from '@angular/core';

/**
 * Generated class for the ThemeContentDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-content]' // Attribute selector
})
export class ThemeContentDirective {

  constructor() {
    console.log('Hello ThemeContentDirective Directive');
  }

}
