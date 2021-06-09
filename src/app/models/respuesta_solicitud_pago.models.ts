import { Pageable } from "./pageable.models";
import { SolicitudPago } from "./solicitud_pago.models";
import { Sort } from "./sort.models";

export class RespuestaSolicitudPago{
    content: SolicitudPago[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    number: number;
    sort: Sort;
    numberOfElements: number;
    size: number;
    empty: boolean; 
}