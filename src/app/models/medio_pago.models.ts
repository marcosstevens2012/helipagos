import { FormaPago } from "./forma_pago.models";

export class MedioPago{
    id: number;
    id_medio_pago: number;
    marca: string;
    pan_longitud: number;
    cvv_longitud: number;
    forma_pago: FormaPago;
    create_at: string;
    updated_at: string;
}