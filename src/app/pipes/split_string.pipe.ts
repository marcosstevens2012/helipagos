import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class LetrasPipe implements PipeTransform {

  transform(value: any, by: string): any {
    if(value == "forma_Pago"){
     return "Forma de pago";
    }else if(value == "fecha_Hora"){
      return "Fecha y hora";
     } else{
       return value.charAt(0).toUpperCase() + value.slice(1)
     }
    // let arr = value.split(by).join(" "); 
    // return arr;
  }
  

}
