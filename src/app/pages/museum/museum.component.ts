import { RolesService } from './../../services/roles.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Museo } from 'src/app/models/museo';
import { MuseosService } from 'src/app/services/museos.service';
import { DialogMuseumComponent } from './dialog-museum/dialog-museum.component';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GeneralRecordService } from 'src/app/services/general-record.service';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-museum',
  templateUrl: './museum.component.html',
  styleUrls: ['./museum.component.scss']
})
export class MuseumComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  rol = ''
  museos: Museo[] = []
  constructor(
     private dialog: MatDialog,
     private museosService: MuseosService,
     private rolesService: RolesService,
     private generalRecordService: GeneralRecordService,
     private countriesService: CountriesService
    ) { }


  //pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ ],
    datasets: [ {
      data: [100]
    } ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];
  //pie-end
  openDialogNewMuseum(): void {
    const dialogRef = this.dialog.open(DialogMuseumComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  fetchMuseos(){
    this.museosService.getAllMuseos().subscribe(
      result=>{
        this.museos=result
      }
    )
  }
  fetchDataCountries(){

  }
  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
    this.countriesService.getAllCountries().subscribe(
      result=>{
        result.forEach(country=>{
          this.pieChartData.labels?.push(country.Id!)
          this.generalRecordService.getGeneralRecordsByCountry(country.id).subscribe(
            result=>{
              console.log(result)
            }
          )
        })
      }
    )
    this.fetchMuseos()
  }

}
