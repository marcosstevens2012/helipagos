import { Cliente } from "./cliente.models";
import { Liquidacion } from "./liquidacion.models";
import { MedioPago } from "./medio_pago.models";
import { SolicitudEstado } from "./solicitud_estado.models";
import { TransaccionTarjeta } from "./transaccion_tarjeta.models";

export class SolicitudPago {
    id: number;
    cliente: Cliente;
    codigo_barra: string;
    codigo_barra_decidir: string;
    solicitud_estado: SolicitudEstado;
    medio_pago: MedioPago;
    liquidacion: Liquidacion
    url_id: string;
    importe: number;
    fecha_vto: string;
    referencia_externa: string;
    descripcion: string;
    transaccion_tarjeta: TransaccionTarjeta[];
    fecha_importe: string;
    fecha_acreditacion: string;
    importe_bonificado: number;   
    create_at: string;
    updated_at: string;
}  