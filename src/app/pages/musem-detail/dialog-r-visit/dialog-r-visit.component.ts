import { ItemId } from './../../../models/item';
import { StaffId } from './../../../models/staff';
import { MuseoId } from './../../../models/museo';
import { RecordVisit } from './../../../models/recordVisit';
import { HotToastService } from '@ngneat/hot-toast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecordVisitService } from 'src/app/services/record-visit.service';
import { MuseosService } from 'src/app/services/museos.service';
import { StaffService } from 'src/app/services/staff.service';
import { ItemsService } from 'src/app/services/items.service';
import { Museo } from 'src/app/models/museo';
import { Staff } from 'src/app/models/staff';
import { Item } from 'src/app/models/item';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-r-visit',
  templateUrl: './dialog-r-visit.component.html',
  styleUrls: ['./dialog-r-visit.component.scss']
})
export class DialogRVisitComponent implements OnInit {

  allMuseos: MuseoId[]=[]
  allSupervisor: StaffId[]=[]
  allReason: ItemId[]=[]
  allTransport: ItemId[]=[]

  visitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    identification: new FormControl('', [Validators.required]),
    museum: new FormControl('', [Validators.required]),
    supervisor: new FormControl('',),
    country:new FormControl('', ),
    companions: new FormControl('', [Validators.required]),
    adult: new FormControl('', [Validators.required]),
    children: new FormControl('', [Validators.required]),
    woman: new FormControl('', [Validators.required]),
    men: new FormControl('', [Validators.required]),
    transport: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    commit: new FormControl('', [Validators.required]),
  })

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogRVisitComponent >,
    private toast: HotToastService,
    private recordVisitService: RecordVisitService,
    private museosService: MuseosService,
    private staffService: StaffService,
    private itemsService: ItemsService,
    private userService: UserService
  ) { }

  fetchmuseum(){
    this.museosService.getAllMuseos().subscribe(
      result=>{
        this.allMuseos=result
      }
    )
  }
  fetchSupervisor(museo: string){
    this.staffService.getStaffByMuseum(museo).subscribe(
      result=>{
        this.allSupervisor=result
      }
    )
  }
  fetchTrasnsport(){
    this.itemsService.getItemsByCatalog('10').subscribe(
      result=>{
        this.allTransport=result
      }
    )
  }
  fetchReason(){
    this.itemsService.getItemsByCatalog('11').subscribe(
      result=>{
        this.allReason=result
      }
    )
  }
  changeMuseo(value:string){
    this.fetchSupervisor(value)
  }

  ngOnInit(): void {
    this.fetchmuseum()
    this.fetchReason()
    this.fetchTrasnsport()
  }
  get name(){
    return this.visitForm.get('name')
  }
  get identification(){
    return this.visitForm.get('identification')
  }
  get supervisor(){
    return this.visitForm.get('supervisor')
  }
  get companions(){
    return this.visitForm.get('companions')
  }
  get adult(){
    return this.visitForm.get('adult')
  }
  get children(){
    return this.visitForm.get('children')
  }
  get woman(){
    return this.visitForm.get('woman')
  }
  get men(){
    return this.visitForm.get('men')
  }
  get transport(){
    return this.visitForm.get('transport')
  }
  get reason(){
    return this.visitForm.get('reason')
  }
  get commit(){
    return this.visitForm.get('commit')
  }
  get museum(){
    return this.visitForm.get('museum')
  }
  submit(){
    if(!this.visitForm.valid){
      console.log('asd')
      return
    }else{
      const load = this.toast.loading("Cargando...")
      const { name, identification, supervisor, companions, adult, children,woman,men,transport,reason,commit,museum } = this.visitForm.value;
      var newVisit: RecordVisit={}
      //pais
      newVisit.name = name
      newVisit.identification = identification
      newVisit.numberOfCompanions=companions
      newVisit.adults=adult
      newVisit.children=children
      newVisit.women=woman
      newVisit.men=men
      newVisit.transport=transport
      newVisit.reasonForVisit=reason
      newVisit.comment=commit
      newVisit.museum=museum
      this.recordVisitService.postVisit(newVisit).then(
        result=>{
          load.close()
          this.toast.success('Personal agregado con exito')
          this.close()
        }
      )
    }
  }
  close(){
    this.dialogRef.close()
  }
}
