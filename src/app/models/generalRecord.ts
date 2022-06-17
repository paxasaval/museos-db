export interface GeneralRecord {
    año_de_registro?: string,
    dias_de_visita?: number,
    fecha_de_registro?: string,
    lugar_de_registro_item_id?: string,
    mes_de_registro?: string,
    numero_de_turistas?: number,
    pais_id?: string,
    razon_item_id?: string,
    transporte_item_id?: string,
    turista_responsable?: string,
    usurio_registro_id?: string,
    Id?: string
}
export interface GeneralRecordId extends GeneralRecord { id: string }