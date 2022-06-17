import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaffService } from 'src/app/services/staff.service';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-dialog-staff',
  templateUrl: './dialog-staff.component.html',
  styleUrls: ['./dialog-staff.component.scss']
})
export class DialogStaffComponent implements OnInit {

  personalForm = new FormGroup(({
    ci: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required]),
    museo: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
  }))

  constructor(
    public dialog: MatDialog,
    private toast: HotToastService,
    private staffService: StaffService,
    private dialogRef: MatDialogRef<DialogStaffComponent>,

  ) { }

  get ci() {
    return this.personalForm.get('ci')
  }
  get name() {
    return this.personalForm.get('name')
  }
  get rol() {
    return this.personalForm.get('rol')
  }
  get museo() {
    return this.personalForm.get('museo')
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
  ngOnInit(): void {
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
      this.staffService.postStaff(newStaff).then(
        result=>{
          load.close()
          this.toast.success('Personal agregado con exito')
          this.close()
        }
      )
    }
  }


  close() {
    this.dialogRef.close()
  }

}
