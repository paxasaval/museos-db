import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Staff, StaffId } from '../models/staff';


@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private staffCollection: AngularFirestoreCollection<Staff>;
  staffs: Observable<Staff[]>;
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFirestore
  ) {
    this.staffCollection = afs.collection<Staff>('staff');
    this.staffs = this.staffCollection.valueChanges();
  }

  getAllStaff() {
    return this.afs.collection<Staff>('staff').snapshotChanges().pipe(
      map(actions => actions.map(a=> {
        const data = a.payload.doc.data() as StaffId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getStaffbyId(staff: string){
    return this.afs.doc<Staff>(`staff/${staff}`).snapshotChanges().pipe(
      map (a => {
        const data = a.payload.data() as StaffId
        data.id = a.payload.id
        return data
      })
    )
  }

  getStaffByMuseum(museo: string){
    return this.afs.collection<Staff>('staff', ref => ref.where('museo', '==', museo)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as StaffId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getStaffByName(name: string) {
    return this.afs.collection<Staff>('staff', ref => ref.where('name', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as StaffId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getStaffByCedula(cedula: string) {
    return this.afs.collection<Staff>('staff', ref => ref.where('cedula', '==', cedula)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as StaffId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  updateStaff(id: string, staff: any){
    const staffReference = this.afs.doc<Staff>(`staff/${id}`)
    return staffReference.set(staff)
  }

  deleteStaff(id: string) {
    this.afs.doc<Staff>('staff/' + id).delete();
   }

  postStaff(staff: Staff) {
    console.log(staff)
    return this.afs.collection<Staff>('staff').add(staff)
  }

}
