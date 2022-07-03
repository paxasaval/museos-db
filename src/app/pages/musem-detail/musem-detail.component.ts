import { Component, OnInit } from '@angular/core';
import { DialogRVisitComponent } from './dialog-r-visit/dialog-r-visit.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-musem-detail',
  templateUrl: './musem-detail.component.html',
  styleUrls: ['./musem-detail.component.scss']
})
export class MusemDetailComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }
  
  goBack() {
    this.router.navigate(['/museos']);
  }
  openDialogRVisit():void{
    const dialogRef = this.dialog.open(DialogRVisitComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit(): void {
  }

}
