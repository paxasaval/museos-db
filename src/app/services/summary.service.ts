import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Summary, SummaryId } from '../models/summary';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private summaryCollection: AngularFirestoreCollection<Summary>;
  summaries: Observable<Summary[]>;

  constructor(
    private afs: AngularFirestore
  ) { 
    this.summaryCollection = afs.collection<Summary>('summaries');
    this.summaries = this.summaryCollection.valueChanges();
  }

  getAllSummaries() {
    return this.afs.collection<Summary>('summaries').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SummaryId
        return data
      }))
    )
  }

  getLastSummary() {
    return this.afs.collection<Summary>('summaries', ref => ref.orderBy('created','desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SummaryId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  postSummary(summary: Summary) {
    return this.afs.collection<Summary>('summaries').add(summary)
  }
}
