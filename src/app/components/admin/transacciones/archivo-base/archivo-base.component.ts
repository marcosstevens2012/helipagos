import { Component, OnInit,  ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { ApiService } from 'src/app/services/api.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FunctionsService } from 'src/app/services/functions.service';
declare var jQuery: any;
import * as FileSaver from "file-saver";

@Component({
  selector: 'archivo-base',
  templateUrl: './archivo-base.component.html',
  styleUrls: ['./archivo-base.component.css']
})

export class ArchivoBaseComponent implements OnInit{

  consultaForm: FormGroup;
  selectable = true;
  addOnBlur = true;
  removable = true;
  submitted:boolean;
  dateIsSelected:boolean;
  listaClientes;
  mediosPago;
  array: any[] = [];
  bytes: string = ''
  estados:Cliente[];
    progressbarActive : boolean = false;


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
  
  async onSubmit(formData){
    this.submitted = true;
      //Formulario inválido 
      if(this.consultaForm.invalid){
        return;
      } 
      await this.apiService.descargarArchivo(formData)

        .then(
          response =>{
              for (let i in response) {
                console.log(response[i])
                this.array.push(atob(response[i]))
                this.array.push('/n')  
              }
              
              console.log(this.array.toString())
          
              var blob = new Blob(this.array,
              { type: "text/plain;charset=utf-8" });
              FileSaver.saveAs(blob, "archivo.txt");
          })
        .catch(error => {
            
            console.log(error)
        })
        .finally(()=>{
          this.progressbarActive = false;
        })
      
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
