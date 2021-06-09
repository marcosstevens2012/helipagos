import { Component, OnInit,  ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { ApiService } from 'src/app/services/api.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FunctionsService } from 'src/app/services/functions.service';
declare var jQuery: any;

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})

export class ConsultaComponent implements OnInit{

  consultaForm: FormGroup;
  selectable = true;
  addOnBlur = true;
  removable = true;
  submitted:boolean;
  dateIsSelected:boolean;
  listaClientes;
  mediosPago;
  estados:Cliente[];


  @ViewChild('inputSimulate') input_simulate_numbers: any;
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent



  constructor( 
    private _router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _functionsService: FunctionsService,
    private apiService: ApiService,
    private transaccionesService: TransaccionesService 
    ) {  
    
    
    //Lista Estados
    this.estados = [
      {id:2, name:"Acreditado"},
      {id:1, name:"Adeudado"},
      {id:0, name:"Anulado"},
      {id:3, name:"Desacreditado"}
    ];
  }

  ngOnInit(): void {
    //Arma el formulario
    this.makeForm();
    //Obtiene el listado de Clientes
    this.apiService.getClientes()
      .then((response) =>{
        this.listaClientes = response;
        this._functionsService.imprimirMensaje(this.listaClientes, "Clientes: ");
      })
      .catch(()=>{
        this._functionsService.configSwal(this.mensajeSwal, `Error al intentar cargar los clientes`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      });

    this.apiService.getMedioPago()
      .then((response) =>{
        this.mediosPago = response;
        this._functionsService.imprimirMensaje(this.mediosPago, "Medio pagos: ");
      })
      .catch((error)=>{
        this._functionsService.imprimirMensaje(error, "Error en medio pagos: ");
        this._functionsService.configSwal(this.mensajeSwal, `Error al intentar cargar los medios de pagos`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      });
    
   
  }

  makeForm(){
    //Form Builder
    this.consultaForm = this.formBuilder.group({
        cliente: [''],
        numero: [''],
        estado: [''],
        medioPago: [''],
        desdeCreacion: new FormControl(''),
        hastaCreacion: new FormControl('')
    })

    //DatePicker max && min
    var today = Date.now();
    var hoy = this.datePipe.transform(today,"yyyy-MM-dd");

    jQuery("#to").attr({
      "max" : hoy
    })
    
    jQuery("#from").attr({
      "max" : hoy
    })


  }

  get desdeCreacion() {
    return this.consultaForm.get('desdeCreacion') as FormControl;
  }
  get hastaCreacion() {
    return this.consultaForm.get('hastaCreacion') as FormControl;
  }

  dateChange(e){
    this.dateIsSelected = true;
    
    if(e.target.value == ""){

        //Remueve la validación
        this.desdeCreacion.clearValidators();
        this.hastaCreacion.clearValidators();
        //Actualiza
        this.desdeCreacion.updateValueAndValidity();
        this.hastaCreacion.updateValueAndValidity();
    }else{
      //Añade validación
      this.desdeCreacion.setValidators([Validators.required]);
      this.hastaCreacion.setValidators([Validators.required]);
      //Actualiza
      this.desdeCreacion.updateValueAndValidity();
      this.hastaCreacion.updateValueAndValidity();
    }


  }


  datepicker(){
    //Toma los datos del formulario
      var dateFrom = this.consultaForm.get('desdeCreacion').value;
      var dateTo = this.consultaForm.get('hastaCreacion').value;

      //Si no está vacío
      if(dateFrom != ""){
        jQuery("#to").attr({   
              "min" : dateFrom
           });
      }

      if(dateTo != ""){
           jQuery("#from").attr({   
            "max" : dateTo,
         });
      }
         
}

  get form(){
    return this.consultaForm.controls;
  }
  
  onSubmit(formData){
    this.submitted = true;
    //Formulario inválido 
      if(this.consultaForm.invalid){
        return;
      } 

    this.transaccionesService.setBusquedaTransaccion(formData)  
    this._router.navigate(['home/transacciones/resultados']);
  }

  limpiar(){
    this.consultaForm.reset();
  }

}

export interface NumberRequests {
  name: string;
}
export interface Cliente{
  id:number;
  name:string;
}
