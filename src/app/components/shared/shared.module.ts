import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

//Material Desing
import { MaterialModule } from '../../material-module';

//Directivas
import { DigitOnlyModule } from '../../directives/digit-only.module';

//Pipes
import { LetrasPipe } from '../../pipes/split_string.pipe';

//component
import { TablaVerticalComponent } from './tabla-vertical/tabla-vertical.component';
import { TablaVerticalMultipleComponent } from './tabla-vertical-multiple/tabla-vertical-multiple.component';
import { TablaComponent } from './tabla/tabla.component';
import { BuscadorComponent } from '../shared/buscador/buscador.component';
import { CardComponent } from './card/card.component';
import { ModalUsuarioComponent } from './modals/modal-usuario/modal-usuario.component';
import { SearchPipe } from '../../pipes/search.pipe';
import { NumberPaginationComponent } from './number-pagination/number-pagination.component';
import { EnviarComentarioComponent } from './enviar-comentario/enviar-comentario.component';
import { GraficoTortaComponent } from './grafico-torta/grafico-torta.component';
import { ModalClienteComponent } from './modals/modal-cliente/modal-cliente.component';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DigitOnlyModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot()
  ],
  declarations: [
    CardComponent,
    BuscadorComponent,
    TablaComponent,
    LetrasPipe,
    TablaVerticalComponent,
    TablaVerticalMultipleComponent,
    ModalUsuarioComponent,
    SearchPipe,
    NumberPaginationComponent,
    EnviarComentarioComponent,
    GraficoTortaComponent,
    ModalClienteComponent,
    SpinnerComponent

  ],
  exports: [
    CardComponent,
    BuscadorComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DigitOnlyModule,
    TablaComponent,
    LetrasPipe,
    TablaVerticalComponent,
    TablaVerticalMultipleComponent,
    NgxPaginationModule,
    NgxSpinnerModule,
    SweetAlert2Module,
    ModalUsuarioComponent,
    NumberPaginationComponent,
    EnviarComentarioComponent,
    GraficoTortaComponent,
    ModalClienteComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
