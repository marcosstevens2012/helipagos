import { SimpleChanges } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})


export class TablaComponent implements OnInit, OnChanges {
 
  @Input() displayedColumns: any = {};
  @Input() displayedColumnsSearch: any = {};
  @Input() dataSource: any = [];
  @Input() mensajeResultado: any;
  //Funciones
  @Input() showVerDetalles:boolean;
  @Input() functionUsuarios:boolean;
  @Input() functionCliente:boolean;
  @Input() indiceItems:boolean = false;

  //Filtro
  @Input() searchText:string = "";
  @Input() searching:boolean;

  @Output() verDetallesFunction: EventEmitter<number>;
  @Output() buttonToken: EventEmitter<number>;
  @Output() editUsuario: EventEmitter<number>;
  @Output() eliminarUsuario: EventEmitter<number>;
  public arrayAux: any = [];

  constructor(
    private _functionsService : FunctionsService
  ) {  
      this.verDetallesFunction = new EventEmitter();
      this.buttonToken = new EventEmitter();
      this.editUsuario = new EventEmitter();
      this.eliminarUsuario = new EventEmitter();
   }


  ngOnInit(): void {
    // this._functionsService.imprimirMensaje(this.displayedColumns, "-- EN TABLA: displayedColumns: ");
    // this._functionsService.imprimirMensaje(this.displayedColumnsSearch, "-- EN TABLA: displayedColumnsSearch: ");
    // this._functionsService.imprimirMensaje(this.dataSource, "-- TABLA: datasource: ");
    // this._functionsService.imprimirMensaje(this.mensajeResultado, "-- TABLA: mensajeResultado ");
  }

  ngOnChanges(changes: SimpleChanges): void {

    
    if(changes.searchText){    
      if(this.arrayAux == "" || this.arrayAux == null){
        this.arrayAux = this.dataSource;
      }
      var filtro = new  SearchPipe();
      this.dataSource = filtro.transform(this.dataSource, this.searchText);
      if(this.searchText == ""){
        this.dataSource = this.arrayAux;
      }

    }
  }

  verDetalles(idx:number){
    this.verDetallesFunction.emit(idx);
  }

  modalButtonToken(idx:number){
    this.buttonToken.emit(idx);
  }

  modalEdit(idx:number){
    this.editUsuario.emit(idx);
  }

  modalDelete(idx:number){
    this.eliminarUsuario.emit(idx);
  }
 
}

