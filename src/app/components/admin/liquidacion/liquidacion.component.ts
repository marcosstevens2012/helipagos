import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Liquidacion, TransaccionesService } from '../../../services/transacciones.service';
declare var jQuery: any;

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.css']
})
export class LiquidacionComponent implements OnInit {
  
  displayedColumns = ['name', 'cuil', 'cbu', 'concepto', 
  'descripcion', 'pago', 'descuento',
  'emision'];
  
  public dataSource:Liquidacion[];



    consultaForm: FormGroup;
    // numbers: NumberRequests[] = [];
    selectable = true;
    addOnBlur = true;
    removable = true;
    submitted:boolean;
    dateIsSelected:boolean;
    formularioConsulta = true;
  
    // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
    @ViewChild('inputSimulate') input_simulate_numbers: any;

  
    constructor( 
      private formBuilder: FormBuilder,
      private datePipe: DatePipe,
      private transaccionesService: TransaccionesService,
      private route: Router) { 
              
    }
  
    ngOnInit(): void {
      //Arma el formulario
      this.makeForm();

    }
  
    makeForm(){
      //Form Builder
      this.consultaForm = this.formBuilder.group({
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
  
      this.transaccionesService.setBusquedaTransaccion(formData);

      this.formularioConsulta = false;
      this.route.navigate(['home/transacciones/resultados'])
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
  