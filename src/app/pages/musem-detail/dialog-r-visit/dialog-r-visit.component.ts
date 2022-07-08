import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-r-visit',
  templateUrl: './dialog-r-visit.component.html',
  styleUrls: ['./dialog-r-visit.component.scss']
})
export class DialogRVisitComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogRVisitComponent >,
  ) { }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close()
  }
}
