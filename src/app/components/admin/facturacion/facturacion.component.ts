import { Component, OnInit } from '@angular/core';
import { Liquidacion, TransaccionesService } from '../../../services/transacciones.service';


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  
  displayedColumns =
  ['name', 'cuil', 'cbu', 'concepto', 
  'descripcion', 'pago', 'descuento',
  'emision'];
  
  public dataSource:Liquidacion[];

  constructor(private _trasaccionService:  TransaccionesService) {
    this.dataSource = [];
   }

  ngOnInit(): void {
  }

}
