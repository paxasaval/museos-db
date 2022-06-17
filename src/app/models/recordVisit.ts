export interface RecordVisit {
    name?: string,
    identification?: string,
    country?: string,
    numberOfCompanions?: number,
    adults?: number,
    children?: number,
    mem?: number,
    women?: number,
    transport?: string,
    reasonForVisit?: string,
    comment?: string
}
export interface RecordVisitId extends RecordVisit { id: string } 