import { Component, OnInit } from '@angular/core';
import { DialogRVisitComponent } from './dialog-r-visit/dialog-r-visit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MuseosService } from 'src/app/services/museos.service';
import { RecordVisitService } from 'src/app/services/record-visit.service';

@Component({
  selector: 'app-musem-detail',
  templateUrl: './musem-detail.component.html',
  styleUrls: ['./musem-detail.component.scss']
})
export class MusemDetailComponent implements OnInit {

  title=''
  addres=''
  description=''
  image=''
  id=''
  //data-cards
  total_tourist=0
  average_visit=0
  max_currency=0
  total_visit=0
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private museoService: MuseosService,
    private recorVisitService: RecordVisitService
  ) { }

  fetchInfo(){
    this.museoService.getMuseoById(this.id).subscribe(
      result=>{
        this.title=result.name!
        this.addres=result.address!
        this.description=result.description!
        this.image=result.image!
      }
    )
  }
  fetchTotals(){
    this.recorVisitService.getVisitsByMuseum(this.id).subscribe(
      result=>{
        this.total_visit=0
        result.forEach(record=>{
          this.total_tourist+=record.numberOfCompanions!
          this.total_visit+=1
          this.average_visit= Math.round(this.total_tourist/this.total_visit)
          if(this.max_currency<record.numberOfCompanions!){
            this.max_currency=record.numberOfCompanions!
          }
        })
      }
    )
  }
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
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
    });
    this.fetchInfo()
    this.fetchTotals()
  }

}
