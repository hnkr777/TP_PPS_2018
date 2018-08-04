import { Directive, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';
import { Subscription } from 'rxjs/Subscription';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the ThemeGeneralDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-general]' // Attribute selector
})
export class ThemeGeneralDirective implements OnInit, OnDestroy {

  subs : Subscription;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private themes: ThemeProvider, 
    private custom: CustomProvider
  ) {
    
  }

  ngOnInit(): void {
    console.log('Tema general iniciado!!!!!!!');
    this.subs = this.themes.changeTheme.subscribe(theme => {
      this.setStyles();
    })
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  setStyles() {
    this.removeClass();
    if(this.themes.isArgentina()) {
      this.renderer.addClass(this.el.nativeElement, 'argentina');
    } else if (this.themes.isProfesional()) {
      console.log('Tema seleccionado: professional');
      this.renderer.addClass(this.el.nativeElement, 'professional');
    } else if (this.themes.isNaif()) {
      this.renderer.addClass(this.el.nativeElement, 'naif');
    } else if (this.themes.isCustom()) {
      this.setCustom();
      //this.renderer.addClass(this.el.nativeElement, 'custom');
      //this.renderer.addClass(this.el.nativeElement, c.fuente);
    }
  }

  removeClass() {
    this.renderer.removeClass(this.el.nativeElement, 'argentina');
    this.renderer.removeClass(this.el.nativeElement, 'profesional');
    this.renderer.removeClass(this.el.nativeElement, 'naif');
    this.renderer.removeClass(this.el.nativeElement, 'custom');
    
    this.renderer.removeClass(this.el.nativeElement, 'fuente-verdana');
    this.renderer.removeClass(this.el.nativeElement, 'fuente-courier');
    this.renderer.removeClass(this.el.nativeElement, 'fuente-shrikhand');
    this.renderer.removeClass(this.el.nativeElement, 'fuente-montserrat');
  }

  setCustom() {
    console.log('SETTING CUSTOM THEME GENERAL');
    this.renderer.addClass(this.el.nativeElement, 'custom');

    let c = this.custom.getCustomConfig();
    this.renderer.addClass(this.el.nativeElement, c.fuente);

    // let ob = document.getElementsByClassName('fixed-content')[1];
    // let ob = document.getElementsByClassName('content content-md')[1];

    let cuerpo = document.getElementsByClassName('content content-md')[1];
    if(cuerpo!==undefined) cuerpo.setAttribute('style', 'background-color: '+c.backgroundColor+' !important');
    
    let cabecera = document.getElementsByClassName('header header-md')[1];
    let cabecera2 = document.getElementsByClassName('toolbar toolbar-md')[1];
    if(cabecera!==undefined) cabecera.setAttribute('style', 'background-color: '+c.color+' ');
    if(cabecera2!==undefined) cabecera2.setAttribute('style', 'background-color: '+c.color+' ');

    /*document.getElementsByClassName('submit-btn')[0]
    .setAttribute('style', 'background-color: '+c.bgBotton+'; border-radius: '+ c.borderRadius +'; color: '+ c.textColor+'; fontWeight: '+ c.fontWeight+'; textTransform: '+ c.textTransform);
    
    document.getElementsByClassName('submit-btn')[1]
    .setAttribute('style', 'background-color: '+c.bgBotton+'; border-radius: '+ c.borderRadius +'; color: '+ c.textColor+'; fontWeight: '+ c.fontWeight+'; textTransform: '+ c.textTransform);
    
    document.getElementsByClassName('submit-btn')[2]
    .setAttribute('style', 'background-color: '+c.bgBotton+'; border-radius: '+ c.borderRadius +'; color: '+ c.textColor+'; fontWeight: '+ c.fontWeight+'; textTransform: '+ c.textTransform);
*/
    this.renderer.setAttribute(this.el.nativeElement, 'style', 'background-color: '+c.backgroundColor+' !important');
    //this.renderer.setAttribute(this.el.nativeElement, 'style', 'background-color: black;');
  }
}


/*

.professional {
  
    font-family: 'Courier New', Courier, monospace;
    // From here to the next checkpoint is for theming the header - toolbar navbar but not the main content 
    transition: all 1.1s ease;
    background-color: #424242;
    p,
    .toolbar-title,
    .bar-button-default,
    body,
    div {
      transition: all 1.1s ease;
      color: white;
    }
    .onboard {
      border-color: #141414 ;
    }
    .toolbar-background,
    .toggle-checked {
      transition: all 1.1s ease;
      background-color: #23272c ;
      background-image: url('/assets/imgs/BG/g3.jpg') ;
      background-position: center;
      background-size: cover;
    }

    //ion-content,
    .input-wrapper,
    .item-inner,
    .item,
    ion-footer,
    ion-item,
    ion-label {
      transition: all 1.1s ease;
      background-color: #4e4e4e ;
      background: #555555 ;
      color: white ;
    }
    ion-list {
      background-color: #666666;
    }
    .time {
      background-color: white;
    }
    .item {
      transition: all 1s ease;
      background-color: #3f454e;
      color: white;
    }
    
    .boton, ion-card, .tag-item-cliente {
      background-color: #3f4250 !important;
      color: rgb(255, 255, 255) ;
      border-radius: 0px !important;
    } 

    ion-button, .boton-menu {
      background-color: rgb(79, 110, 117) ;
      color: rgb(160, 58, 58) ;
      border-radius: 0px ;
      box-shadow: 0 0 0 0 transparent ;
    }

    .item-cover {
      //background-color: rgb(79, 110, 117) ;
      color: rgb(141, 0, 0) ;
      border-radius: 0px ;
      box-shadow: 0 0 0 0 transparent ;
    }
    
    .contenido {
      background-image: url('/assets/imgs/BG/g2.jpg') ;
      height: 100%;
      width: 100%;
      background-position: center;
      background-size: cover;
    }

    ion-content, .contenido-viajes {
      transition: all 1.1s ease;
      background-color: #4e4e4e !important;
      //background-image: url('../assets/imgs/bg/g2.jpg') ;
      color: white ;
    }
}

*/