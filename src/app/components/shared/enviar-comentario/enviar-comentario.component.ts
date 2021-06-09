import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-enviar-comentario',
  templateUrl: './enviar-comentario.component.html',
  styleUrls: ['./enviar-comentario.component.css']
})
export class EnviarComentarioComponent implements OnInit {

  public header:string;
  public showMessage:boolean;
  
  constructor(
    private _tokenService: TokenService
  ) { }

  ngOnInit(): void {
    var user = this._tokenService.getUserName();
    this.header= "Hola, ",user;
    this.showMessage = false;
  }

}
