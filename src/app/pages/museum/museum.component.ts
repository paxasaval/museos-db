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
import { CountryId } from 'src/app/models/country';
import { finalize } from 'rxjs';

export interface dataCountryVisit{
  country?: string,
  visit?: number
}
export interface dataRegionVisit{
  region?: string,
  countries?: string[],
  visit?: number
}

@Component({
  selector: 'app-museum',
  templateUrl: './museum.component.html',
  styleUrls: ['./museum.component.scss']
})
export class MuseumComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dataSetCountryVisit:dataCountryVisit[]=[]
  dataSetRegionVisit:dataRegionVisit[]=[
    {
      region: '1',
      countries:[],
      visit:0
    },
    {
      region: '2',
      countries:[],
      visit:0
    },
    {
      region: '3',
      countries:[],
      visit:0
    },
    {
      region: '4',
      countries:[],
      visit:0
    },
    {
      region: '5',
      countries:[],
      visit:0
    },
    {
      region: '6',
      countries:[],
      visit:0
    },
    {
      region: '7',
      countries:[],
      visit:0
    },
    {
      region: '8',
      countries:[],
      visit:0
    },
    {
      region: '9',
      countries:[],
      visit:0
    },
    {
      region: '10',
      countries:[],
      visit:0
    },
  ]
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
      data: []
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
  fetchRegionContries(dataset: dataCountryVisit[]){
    dataset.forEach(data=>{
      console.log(data)
      this.countriesService.getCountryByIden(data.country!).subscribe(
        result=>{
          const isRegionOf = (element:dataRegionVisit)=> (element.region)==(result[0].region_id)
          const i = this.dataSetRegionVisit.findIndex(isRegionOf)
          this.dataSetRegionVisit[i].countries?.push(data.country!)
          this.dataSetRegionVisit[i].visit!+=data.visit!
        }
      )
    })
  }
   fetchDataCountries(){
    this.countriesService.getAllCountries().subscribe(
      result=>{
        result.forEach(country=>{
          this.pieChartData.labels?.push([country.pais_de_procedencia!,`codigo:${country.Iden!}`])
          //console.log(country.Iden)
          this.generalRecordService.getGeneralRecordsByCountry(country.Iden!).subscribe(
            res=>{
              let record:dataCountryVisit = {}
              record.country=country.Iden
              record.visit=res.length
              this.dataSetCountryVisit.push(record)
              const isRegionOf = (element:dataRegionVisit)=> (element.region)==(country.region_id)
              const i = this.dataSetRegionVisit.findIndex(isRegionOf)
              this.dataSetRegionVisit[i].countries?.push(record.country!)
              this.dataSetRegionVisit[i].visit!+=record.visit!
              //this.chart?.update();
            }
          )
        })
      }
    )
  }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
    this.fetchDataCountries()
    console.log(this.dataSetCountryVisit)
    console.log(this.dataSetRegionVisit)
    this.fetchMuseos()
  } 

}
