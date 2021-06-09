import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaccion } from 'src/app/models/transaccion.models';
import { RespuestaSolicitudPago } from 'src/app/models/respuesta_solicitud_pago.models';
import { SolicitudPago } from 'src/app/models/solicitud_pago.models';
import { ApiService } from 'src/app/services/api.service';
import { TransaccionesService } from 'src/app/services/transacciones.service'
import {Observable, of} from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { LocalService } from 'src/app/services/storage/local.service'
import { ViewEncapsulation } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { TokenService } from 'src/app/services/token.service';
import { FunctionsService } from 'src/app/services/functions.service';


interface IServerResponse {
  items: string[];
  total: number;
}
@Component({
  selector: 'app-tabla-resultados',
  templateUrl: './tabla-resultados.component.html',
  styleUrls: ['./tabla-resultados.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TablaResultadosComponent implements OnInit{
  @ViewChild('failSwal') failSwal: SwalComponent
  @ViewChild('sesionSwal') sesionSwal: SwalComponent
  displayedColumns = ['numero', 'estado', 'organismo', 'monto', 'forma_Pago', 'fecha_Hora','acreditacion'];
  displayedColumnsSearch = [];

  dataSource:Transaccion[];
  listaDatos: RespuestaSolicitudPago
  listado: SolicitudPago[]
  //Filtro
  filtroText:string;
  searching:boolean;


  @Input('data') meals: string[] = [];
  asyncMeals: Observable<string[]>;
  p: number = 1;
  total: number = 0;
  loading: boolean;
  mensajeResultado: string;

  itemPerPage: string
  page: number;


  public headElements=[];
  public elements:Transaccion[];

  constructor( private _transaccionService:TransaccionesService,
               private _api:ApiService, 
               private router:Router,
               private _spinner: NgxSpinnerService,
               private _tokenService: TokenService,
               private localService: LocalService,
               private location: Location,
               private _functionsService: FunctionsService,
               private datePipe: DatePipe
              ) {  }

  ngOnInit(): void {
    this.itemPerPage = localStorage.getItem("itemsPerPage") != null? localStorage.getItem("itemsPerPage") : "10";  
    this.dataSource = [];
    this.displayedColumns = ['Número', 'Estado', 'Organismo', 'Monto', 'Tipo de pago', 'Forma de pago', 'Fecha de importe', 'Fecha de vencimiento', 'Fecha de acreditación'];
    this.displayedColumnsSearch = ["numero", "estado", "organismo", "monto", "tipo_pago", "forma_pago", "fecha_importe", "fecha_vto" , "fecha_acreditacion"];
    this.loading = true;
    this.page = localStorage.getItem("page") != null? +localStorage.getItem("page") : 1;  
    this._functionsService.imprimirMensaje(this.page, "Pagina en localstorage ");
    this.getPage(1);
  }


  filtrar(termino:string){
      if (termino.length >= 3) {
        this.searching = true;
      } else {
        this.searching = false;
      }
     this.filtroText = termino;
  }


  getPage(page: number) {
    // this._spinner.hide();
    localStorage.setItem("page", (page-1).toString());
    localStorage.setItem("itemsPerPage", (this.itemPerPage).toString());
    this._api.getRespuestaSolicitudPagoWithFilter(page-1, this.itemPerPage)
      .then(response => {
        var datos: any = response;
        this.listaDatos = datos;
        this.listado = this.listaDatos.content;
        this._transaccionService.setRespuestaSolicitudPago(this.listado);
        this._spinner.hide();
        this.cargarTabla();
        this.mensajeResultado = "Se encontraron "+this.listaDatos.totalElements+" resultados.";
        this.loading = false;
        this.total = this.listaDatos.totalElements
      })
      .catch(error => {
        this._functionsService.imprimirMensaje(error, "Error en solicitud de pago con filtro");
        if(error.status == 403){
          this.sesionSwal.fire().finally(()=> {
            this._tokenService.logOut();
          });
        }else{
          this.failSwal.fire().finally(()=> {
            this.location.back();
          });
        }
        
      });

    this.asyncMeals = serverCall(this.meals, page).pipe(
        tap(res => {
            // this.total = res.total;
            this.p = page;
        }),
        map(res => res.items)
    );
  }

  cargarItems(cantidad: string){
    this._functionsService.imprimirMensaje(cantidad, "cantidad de item en paginacion");
    if(cantidad.toLocaleLowerCase() == "todos"){
      this.itemPerPage = (this.listaDatos.totalElements).toString();
      this._functionsService.imprimirMensaje(cantidad, "dentro de 'todos' ");
    }else{
      this.itemPerPage = cantidad;
      this._functionsService.imprimirMensaje(this.itemPerPage, "else if itemPerPage");
    }
    this.getPage(1);
  }

  cargarTabla(){
    var array = Array<Transaccion>();
    var nodisponible = "(no disponible)";

    for (let i = 0; i < this.listado.length; i++) {
      var dato: Transaccion;

      
      console.log('RESULTADOS', this.listado)
      
      dato = {
        numero:       this.listado[i].id != null? this.listado[i].id: 0,
        estado:       this.listado[i].solicitud_estado != null? this.listado[i].solicitud_estado.descripcion: nodisponible,
        organismo:    this.listado[i].cliente != null? this.listado[i].cliente.nombre_legal: nodisponible,
        monto:        this.listado[i].importe != null? "$ "+(this.listado[i].importe/100).toFixed(2): nodisponible,
        tipo_pago:    this.listado[i].medio_pago != null? this.listado[i].medio_pago.marca: nodisponible,
        forma_pago:   this.listado[i].medio_pago != null? this.listado[i].medio_pago.forma_pago.tipo: nodisponible ,
        fecha_importe:this.datePipe.transform(this.listado[i].fecha_importe, "dd-MM-yyyy") != null? this.datePipe.transform(this.listado[i].fecha_importe, "dd-MM-yyyy"): nodisponible,
        fecha_vto:    this.datePipe.transform(this.listado[i].fecha_vto, "dd-MM-yyyy") != null? this.datePipe.transform(this.listado[i].fecha_vto, "dd-MM-yyyy"): nodisponible,
        fecha_acreditacion: this.datePipe.transform(this.listado[i].fecha_acreditacion, "dd-MM-yyyy") != null? this.datePipe.transform(this.listado[i].fecha_acreditacion, "dd-MM-yyyy"): nodisponible,
        detalles:     "observacion"
      }
      array.push(dato);
    }

    this.dataSource = array;
  }

  verDetalles(idx:number){
    this._transaccionService.setIdDetalle(idx);
    this.router.navigate(['home/transacciones/detalles']);
  }

  getLocalStorage() {
    // Get the user data
    let palabra = this.localService.getJsonValue('user');
  }
  
}

function serverCall(meals: string[], page: number): Observable<IServerResponse> {
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return of({
          items: meals.slice(start, end),
          total: 10
      });
}
