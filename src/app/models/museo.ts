export interface Museo {
    name?: string,
    address?: string,
    description?: string,
    schedule?: string,
    supervisor?: string,
    image?: string
}
export interface MuseoId extends Museo{ id: string }