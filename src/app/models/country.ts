export interface Country {
    pais_de_procedencia?: string,
    region_id?: string,
    Id?: string
}
export interface CountryId extends Country { id: string }