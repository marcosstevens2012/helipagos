import { Component, OnInit, HostListener } from '@angular/core';
import { Router,  NavigationEnd } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { MatIconModule } from '@angular/material/icon';

declare var jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public header:string;
  public name:string;
  public avisos:number;
  public mensajes:number;
  public showAviso:boolean;
  public showMsj:boolean;
  public showPerfil:boolean;

  constructor( 
    private router: Router,  
    private _tokenService: TokenService) { 
    //Si cambia de ruta el menú desplegable se cierra
    this.router.events.subscribe((ev) => {
          if (ev instanceof NavigationEnd) { 
            // if(jQuery( ".sidebar .sidebar-content .link" ).hasClass("active")) {
            //   console.log("activado");
            // }      
            jQuery(".sidebar").removeClass("open-sidebar");    
            jQuery(".dark-coat").removeClass("opacity");  
      
            }
      });
    }

  ngOnInit(): void {
    var user = this._tokenService.getUserName();
    this.header= `Hola, ${user}`;
    this.name = user;
    this.notificar();
    this.showMsj = false;
    this.showAviso = false;
    this.showPerfil = false
  }

  logOut(){
      this._tokenService.logOut();
  }

  notificar(){
    this.avisos;
    this.mensajes;
  }


  //Abrir y cerrar message box, HAY QUE CAMBIAR POR CLASES CSS Y SERVICIOS
  show(value:string){
  
      if(value=="Msj"){
        if(!this.showMsj){
          this.showAviso = false;  
          this.showPerfil = false;
          this.showMsj = true;     
        }else{
          this.showMsj = false;
        }
      }else if(value=="Aviso"){
        if(!this.showAviso){
          this.showMsj = false;
          this.showPerfil = false;
          this.showAviso = true;
        }else{
          this.showAviso = false;
        }
          
      } else if(value=="Perfil"){
        if(!this.showPerfil){
          this.showMsj = false;
          this.showAviso = false;
          this.showPerfil = true;
        }else{
          this.showPerfil = false;
        }    
      }
      
    }


  touchButton(){
    jQuery(function ($) {
       $("#sidebar").toggleClass("open-sidebar")
       $(".dark-coat").toggleClass("opacity");
       
       //  Menú desplegable sensible al tacto
       $("#sidebar, .dark-coat ").swipe({
                 swipeStatus:function(event, phase, direction, distance, duration, fingers)
            {
                if (phase=="move" && direction =="left") {
                     $(".sidebar").removeClass("open-sidebar");
                     darkOpacity();        
                     return false;
                }
            }
      }); 

      
      function darkOpacity(){
          $(".dark-coat").toggleClass("opacity");  
      }
     
    });
    
  }


  //Listener  para detectar click en cualquier parte de la pantalla y cerrar los message-box del nav bar
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
   
    let tipo = event.target['id']
    
        //comparamos el id del elemento
        if (tipo != 'icono') {
          
          this.showPerfil = false
          this.showMsj = false
          this.showAviso = false
         
        }
        
       
  }

}
