import { SimpleChanges } from '@angular/core';
import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-number-pagination',
  templateUrl: './number-pagination.component.html',
  styleUrls: ['./number-pagination.component.css']
})
export class NumberPaginationComponent implements OnInit {
  
  cantidades;
  seleccionado;
  @Output() cantidad: EventEmitter<string>;


  
  constructor() { 
    this.cantidad = new EventEmitter();
  }

  ngOnInit(): void {
    this.cantidades = ["10", "25", "50", "75", "100", "200", "300", "Todos"];
    this.seleccionado = localStorage.getItem('itemsPerPage') != null ? localStorage.getItem('itemsPerPage') : '10';
  }

  enviarCantidad(){
    this.cantidad.emit(this.seleccionado)
  }

}
