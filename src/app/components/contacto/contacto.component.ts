import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  @ViewChild('failSwal') failSwal: SwalComponent;
  @ViewChild('successSwal') successSwal: SwalComponent;

  contactoForm: FormGroup;
  
  constructor( 
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.contactoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      numeroContacto: ['', Validators.required],
      mensaje: ['', Validators.required]
  })
  }


  onSend(form){
    if(this.contactoForm.invalid){
      this.failSwal.fire();
    }else{
      this.successSwal.fire().finally( () => this.limpiar());
    }
    
  }

  limpiar(){
    this.contactoForm.reset();
  }

}
