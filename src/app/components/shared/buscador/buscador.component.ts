import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  public header:string;
  public showMessage:boolean;
  @Output() valorBusqueda: EventEmitter<string>;

  constructor(
    private _tokenService: TokenService
  ) {
      this.valorBusqueda = new EventEmitter();
   }
  

  ngOnInit(): void {
    var user = this._tokenService.getUserName();
    this.header= `Hola, ${user}`;
    this.showMessage = false;
  }

  buscarDato( termino:string ){
    this.valorBusqueda.emit(termino);
  }
}
