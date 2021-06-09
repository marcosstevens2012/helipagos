import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() Title:string;
  @Input() text:string;
  @Input() showButtons:boolean = false;
  @Output() aceptar: EventEmitter<boolean>
  constructor() { 
    this.aceptar = new EventEmitter()
  }

  ngOnInit(): void {
    if(!this.Title){
        this.Title = "Seccion";
    }
    if(!this.text){
      this.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  }

  accionAceptar(){
    this.aceptar.emit(true);
  }

}
