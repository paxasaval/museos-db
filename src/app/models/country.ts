export interface Country {
    pais_de_procedencia?: string,
    region_id?: string,
    Iden?: string
}
export interface CountryId extends Country { id: string }