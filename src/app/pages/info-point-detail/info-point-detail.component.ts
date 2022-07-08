import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogRVisitInfoPComponent } from './dialog-r-visit-info-p/dialog-r-visit-info-p.component';

@Component({
  selector: 'app-info-point-detail',
  templateUrl: './info-point-detail.component.html',
  styleUrls: ['./info-point-detail.component.scss']
})
export class InfoPointDetailComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { }
  goBack() {
    this.router.navigate(['/puntos-de-informacion']);
  }
  openDialogRVisit():void{
    const dialogRef = this.dialog.open(DialogRVisitInfoPComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit(): void {
  }

}
