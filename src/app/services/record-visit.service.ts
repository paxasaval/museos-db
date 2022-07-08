import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { RecordVisit, RecordVisitId } from '../models/recordVisit';

@Injectable({
  providedIn: 'root'
})
export class RecordVisitService {

  private recordVisitCollection: AngularFirestoreCollection<RecordVisit>;
  recordVisits: Observable<RecordVisit[]>;
  constructor(
    private afs: AngularFirestore
  ) {
    this.recordVisitCollection = afs.collection<RecordVisit>('visits');
    this.recordVisits = this.recordVisitCollection.valueChanges();
  }

  getAllVisits() {
    return this.afs.collection<RecordVisit>('visits').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitById(id: string) {
    return this.afs.doc<RecordVisit>(`visits/${id}`).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as RecordVisitId
        data.id = a.payload.id
        return data
      })
    )
  }

  getVisitsByMuseum(museum: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('museum', "==", museum)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByName(name: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('name', "==", name)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByIdentification (identification: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('visits', '==', identification)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByCountry(country: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('country','==', country)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByNumCompanions(number: number) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('numberOfCompanions','==', number)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByAmountAdults(adults: number) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('adults','==', adults)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByAmountChildren(children: number) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('children','==', children)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByAmountMen(men: number) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('men','==', men)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByAmountWomen(women: number) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('women','==', women)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByTransport(transport: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('transport','==', transport)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getVisitsByReason(reasonForVisit: string) {
    return this.afs.collection<RecordVisit>('visits', ref => ref.where('reasonForVisit','==', reasonForVisit)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordVisitId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  postVisit(recordVisit: RecordVisit) {
    return this.afs.collection<RecordVisit>('visits').add(recordVisit)
  }
}
