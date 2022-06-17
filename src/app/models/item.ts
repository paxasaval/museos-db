export interface Item {
    Catalogo_id?: string,
    Codigo?: string,
    Descripcion?: string,
    Nombre?: string,
    Id?: string
}
export interface ItemId extends Item { id: string }