import { MedioPago } from "./medio_pago.models";
import { Moneda } from "./moneda.models";
import { TitularTarjeta } from "./titular_tarjeta.models";
import { TransaccionTarjetaEstado } from "./transaccion_tarjeta_estado.models";

export class TransaccionTarjeta{
    id: number;
    id_transaccion_decidir: number;
    site_transaction_id: string;
    titular_tarjeta: TitularTarjeta;
    moneda: Moneda;
    importe: number;
    medio_pago: MedioPago;
    token: string;
    installments: number;
    ticket: string;
    card_authorization_code: string;
    address_validation_code: string;
    tansaccion_tarjeta_estado: TransaccionTarjetaEstado;
    detalle_operacion: string;
    token_created_at: string;
    mensaje: string;
    created_at: string;
    updated_at: string;
}