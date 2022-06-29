import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { GeneralRecord, GeneralRecordId } from '../models/generalRecord';

@Injectable({
  providedIn: 'root'
})
export class GeneralRecordService {

  private generalRecordCollection: AngularFirestoreCollection<GeneralRecord>;
  generalRecords: Observable<GeneralRecord[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.generalRecordCollection = afs.collection<GeneralRecord>('registro_general');
    this.generalRecords = this.generalRecordCollection.valueChanges();
  }

  getAllGeneralRecords() {
    return this.afs.collection<GeneralRecord>('registro_general').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getGeneralRecordsByYear(year: string) {
    return this.afs.collection<GeneralRecord>('registro_general', ref => ref.where('año_de_registro', '==', year)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getGeneralRecordsByCountry(country: string) {
    return this.afs.collection<GeneralRecord>('registro_general', ref => ref.where('pais_id', '==', country)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getGeneralRecordsByTransport(transport: string) {
    return this.afs.collection<GeneralRecord>('registro_general', ref => ref.where('transporte_item_id', '==', transport)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getGeneralRecordsByReason(reason: string) {
    return this.afs.collection<GeneralRecord>('registro_general', ref => ref.where('razon_item_id', '==', reason)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getGeneralRecordsByDaysStayed(days: number) {
    return this.afs.collection<GeneralRecord>('registro_general', ref => ref.where('dias_de_visita', '==', days)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GeneralRecordId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
}
