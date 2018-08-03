import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ThemeProvider } from '../../providers/theme/theme';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the TemaGeneralDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-bg]' // Attribute selector
})
export class ThemeBgDirective implements OnInit, OnDestroy {

  subs : Subscription;

  constructor(private el : ElementRef, private themes : ThemeProvider, private renderer : Renderer2, private custom : CustomProvider) {
    console.warn('tema-general iniciado');
  }

  ngOnInit() {
    
    this.subs = this.themes.changeTheme.subscribe(theme => {
      this.setStyles();
    })
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  setStyles() {
    this.removeClass();
    //this.renderer.addClass(this.el.nativeElement, 'background-img');
    if(this.themes.isArgentina()) {
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url("/assets/imgs/bg/a2.jpg")');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else if (this.themes.isProfesional()) {
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url(assets/imgs/bg/g2.jpg)');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else if (this.themes.isNaif()) {
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url(assets/imgs/bg/n1.jpg)');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else {
      let c = this.custom.getCustomConfig();
      if(c.foto !== undefined) {
        this.renderer.setAttribute(this.el.nativeElement,'style', 'background-image', 'url('+c.foto+') ');
        //console.error('==============imagen:');
      }
      this.renderer.setAttribute(this.el.nativeElement,'style', 'background-color: '+ c.backgroundColor + ' ');
      //this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      //this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover ');
      // this.renderer.setAttribute(this.el.nativeElement,'style', 'background-position: cover ');
    }
  }

  removeClass() {
    this.renderer.removeClass(this.el.nativeElement, 'background-img');
    this.renderer.removeClass(this.el.nativeElement, 'content-md');
  }
}
