import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StaffService } from 'src/app/services/staff.service';
import { Staff } from 'src/app/models/staff';
import { RolesService } from 'src/app/services/roles.service';
import { RolId } from 'src/app/models/rol';

@Component({
  selector: 'app-dialog-staff',
  templateUrl: './dialog-staff.component.html',
  styleUrls: ['./dialog-staff.component.scss']
})
export class DialogStaffComponent implements OnInit {

  title='Agregar Personal'
  cancel='Cancelar'
  saveChanges=true

  id?:string

  roles:RolId[]=[]

  personalForm = new FormGroup(({
    ci: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
  }))

  myControl = new FormControl();

  constructor(
    public dialog: MatDialog,
    private toast: HotToastService,
    private staffService: StaffService,
    private dialogRef: MatDialogRef<DialogStaffComponent>,
    private rolService: RolesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  fetchRoles(){
    this.rolService.getAllRoles().subscribe(
      result=>{
        result.forEach(rol=>{
          this.roles.push(rol)
        })
      }
    )
  }


  ngOnInit(): void {
    this.fetchRoles()
    if(this.data['edit']==true){
      this.title='Editar Personal'
      this.staffService.getStaffByCedula(this.data['personal_id']).subscribe(
        result=>{
          this.id=result[0].id
          this.personalForm.setValue({
            ci:result[0].cedula,
            name:result[0].name,
            rol:result[0].rol,
            museo:result[0].museo,
            phone:result[0].phone,
            mail:result[0].mail,
            schedule:result[0].workingHours
          })
        }
      )
    }
    if(this.data['edit']==false){
      this.title='Ver Personal'
      this.staffService.getStaffByCedula(this.data['personal_id']).subscribe(
        result=>{
          this.personalForm.setValue({
            ci:result[0].cedula,
            name:result[0].name,
            rol:result[0].rol,
            museo:result[0].museo,
            phone:result[0].phone,
            mail:result[0].mail,
            schedule:result[0].workingHours
          })
          this.personalForm.controls['ci'].disable()
          this.personalForm.controls['name'].disable()
          this.personalForm.controls['rol'].disable()
          this.personalForm.controls['phone'].disable()
          this.personalForm.controls['mail'].disable()
          this.personalForm.controls['schedule'].disable()
          this.cancel='Salir'
          this.saveChanges=false
        }
      )

    }

  }
  get ci() {
    return this.personalForm.get('ci')
  }
  get name() {
    return this.personalForm.get('name')
  }
  get rol() {
    return this.personalForm.get('rol')
  }
  get phone() {
    return this.personalForm.get('phone')
  }
  get mail() {
    return this.personalForm.get('mail')
  }
  get schedule() {
    return this.personalForm.get('schedule')
  }

  submit() {
    if (!this.personalForm.valid) {
      return
    } else {
      const load = this.toast.loading("Cargando...")
      const { ci, name, rol, museo, phone, mail, schedule } = this.personalForm.value;
      var newStaff: Staff = {};
      newStaff.name = name
      newStaff.rol = rol
      newStaff.cedula = ci
      newStaff.museo = museo
      newStaff.phone = phone
      newStaff.mail = mail
      newStaff.workingHours = schedule
      if(this.id){
        this.staffService.updateStaff(this.id, newStaff).then(
          result=>{
            load.close()
            this.toast.success('Personal actualizado con exito')
            this.close()
          }
        )
      }else{
        this.staffService.postStaff(newStaff).then(
          result=>{
            load.close()
            this.toast.success('Personal agregado con exito')
            this.close()
          }
        )
      }

    }
  }


  close() {
    this.dialogRef.close()
  }

}
