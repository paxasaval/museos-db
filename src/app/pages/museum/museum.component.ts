import { GeneralRecordId } from './../../models/generalRecord';
import { Country_visit, Place_record, LastMonth_visit, LastYear_visit, DataRegionsVisit, Transport_visit, Region_visit, Reason_visit, Summary } from './../../models/summary';
import { Timestamp } from 'firebase/firestore';
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
import { SummaryService } from 'src/app/services/summary.service';

export function dame_color_aleatorio(){
  var simbolos, color;
	simbolos = "0123456789ABCDEF";
	color = "#";
	for(var i = 0; i < 6; i++){
		color = color + simbolos[Math.floor(Math.random() * 16)];
	}
  return color
}
const colors = {
  bgColor: '',
  txtColor: '',
  btnColor: '',
  btnFocus: ''
}
export function newColor() {
  const hBase = Math.random();
  const newH = Math.floor(hBase * 360);
  const newL = Math.floor(Math.random() * 16) + 75;

  colors.bgColor = `hsl(${newH}, 100%, ${newL}%)`;
  colors.txtColor = `hsl(${newH}, 100%, 5%)`;
  colors.btnColor = `hsl(${newH}, 100%, 98%)`;
  colors.btnFocus = `hsl(${newH}, 100%, 95%)`;

  const [ r, g, b ] = HSLtoRGB(hBase, 1, newL*.01);
  return [r,g,b]
}
export function HSLtoRGB(h:number, s:number, l:number) {
  let r, g, b;

  const rd = (a:number) => {
    return Math.floor(Math.max(Math.min(a*256, 255), 0));
  };

  const hueToRGB = (m:number, n:number, o:number) => {
    if (o < 0) o += 1;
    if (o > 1) o -= 1;
    if (o < 1/6) return m + (n - m) * 6 * o;
    if (o < 1/2) return n;
    if (o < 2/3) return m + (n - m) * (2/3 - o) * 6;
    return m;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  r = hueToRGB(p, q, h + 1/3);
  g = hueToRGB(p, q, h);
  b = hueToRGB(p, q, h - 1/3);

  return [rd(r), rd(g), rd(b)]
}
function RGBtoHex() {
  const [r,g,b]=newColor()
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

@Component({
  selector: 'app-museum',
  templateUrl: './museum.component.html',
  styleUrls: ['./museum.component.scss']
})
export class MuseumComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  loaded_bar=false
  loaded_barh=false

  //var date
  lath_month = '12'
  lasth_year = '2021'
  //var summary
  country_visit: Country_visit[] = []
  region_visit: DataRegionsVisit[] = [
    {
      region: '1',
      countries: [],
      visit: 0
    },
    {
      region: '2',
      countries: [],
      visit: 0
    },
    {
      region: '3',
      countries: [],
      visit: 0
    },
    {
      region: '4',
      countries: [],
      visit: 0
    },
    {
      region: '5',
      countries: [],
      visit: 0
    },
    {
      region: '6',
      countries: [],
      visit: 0
    },
    {
      region: '7',
      countries: [],
      visit: 0
    },
    {
      region: '8',
      countries: [],
      visit: 0
    },
    {
      region: '9',
      countries: [],
      visit: 0
    },
    {
      region: '10',
      countries: [],
      visit: 0
    },
  ]
  cutoff_date?: Timestamp
  avg_tourist_visit: number = 0
  avg_visits_days: number = 0
  total_record: number = 0
  place_record: Place_record[] = [
    {
      item_id: '640',
      total_visits: 0
    },
    {
      item_id: '24',
      total_visits: 0
    },
    {
      item_id: '647',
      total_visits: 0
    },
    {
      item_id: '22',
      total_visits: 0
    },
  ]
  lastMonth_visit: number = 0
  month_visit: LastMonth_visit[] = [
    {
      month: '1',
      total_visits: 0
    },
    {
      month: '2',
      total_visits: 0
    },
    {
      month: '3',
      total_visits: 0
    },
    {
      month: '4',
      total_visits: 0
    },
    {
      month: '5',
      total_visits: 0
    },
    {
      month: '6',
      total_visits: 0
    },
    {
      month: '7',
      total_visits: 0
    },
    {
      month: '8',
      total_visits: 0
    },
    {
      month: '9',
      total_visits: 0
    },
    {
      month: '10',
      total_visits: 0
    },
    {
      month: '11',
      total_visits: 0
    },
    {
      month: '12',
      total_visits: 0
    }
  ]
  year_visit: LastYear_visit[] = [
    {
      year: '2018',
      total_visits: 0
    },
    {
      year: '2020',
      total_visits: 0
    },
    {
      year: '2021',
      total_visits: 0
    },
    {
      year: '2022',
      total_visits: 0
    }
  ]
  lastYear_visit: number = 0
  reason_visit: Reason_visit[] = [
    {
      item_id: '18',
      total_visits: 0
    },
    {
      item_id: '21',
      total_visits: 0
    },
    {
      item_id: '16',
      total_visits: 0
    },
    {
      item_id: '27',
      total_visits: 0
    },
    {
      item_id: '28',
      total_visits: 0
    },
    {
      item_id: '17',
      total_visits: 0
    },
    {
      item_id: '639',
      total_visits: 0
    },
  ]
  transport_visit: Transport_visit[] = [
    {
      item_id: '638',
      total_visits: 0
    },
    {
      item_id: '13',
      total_visits: 0
    },
    {
      item_id: '636',
      total_visits: 0
    },
    {
      item_id: '14',
      total_visits: 0
    },
    {
      item_id: '15',
      total_visits: 0
    },
    {
      item_id: '637',
      total_visits: 0
    },
    {
      item_id: '25',
      total_visits: 0
    }
  ]
  //fin var summary
  rol = ''
  museos: Museo[] = []
  constructor(
    private dialog: MatDialog,
    private museosService: MuseosService,
    private rolesService: RolesService,
    private generalRecordService: GeneralRecordService,
    private countriesService: CountriesService,
    private summaryService: SummaryService
  ) { }

  //bar-vertical
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins  = [DatalabelsPlugin];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [],label:'Total',backgroundColor:[] },
    ]
  };
  //fin-bar
  //bar-horzontal
    public hbarChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y',
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
        }
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'end'
        }
      }
    };
    public hbarChartType: ChartType = 'bar';
    public hbarChartPlugins  = [DatalabelsPlugin];
    public hbarChartData: ChartData<'bar'> = {
      labels: [],
      datasets: [
        { data: [],label:'Total',backgroundColor:[] },
      ],

    };
    //fin-bar
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
    labels: [],
    datasets: [
      { data: [ ] },
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];
  //pie-end
  openDialogNewMuseum(): void {
    const dialogRef = this.dialog.open(DialogMuseumComponent, {
      panelClass: 'app-full-bleed-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  fetchMuseos() {
    this.museosService.getAllMuseos().subscribe(
      result => {
        this.museos = result
      }
    )
  }
  /*   fetchRegionContries(dataset: dataCountryVisit[]){
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
    } */
  fetchData() {
    var total_tourist_visit = 0
    var total_visits_days = 0
    this.countriesService.getAllCountries().subscribe(
      result => {
        result.forEach(country => {
          //this.pieChartData.labels?.push([country.pais_de_procedencia!, `codigo:${country.Iden!}`])
          //console.log(country.Iden)
          this.generalRecordService.getGeneralRecordsByCountry(country.Iden!).subscribe(
            res => {
              let record: Country_visit = {}
              record.country = country.Iden
              record.total_visits = res.length
              this.country_visit.push(record)
              const isRegionOf = (element: Region_visit) => (element.region) == (country.region_id)
              const i = this.region_visit.findIndex(isRegionOf)
              this.region_visit[i].countries?.push(record)
              this.region_visit[i].visit! += record.total_visits!
              res.forEach(r => {
                //total de registros
                this.total_record += 1
                //media de turistas por registro
                total_tourist_visit += r.numero_de_turistas!
                this.avg_tourist_visit = total_tourist_visit / this.total_record
                //mediia de dias de visita por registro
                total_visits_days += r.dias_de_visita!
                this.avg_visits_days = total_visits_days / this.total_record
                //total de regstros porlugar
                const isPlaceRecordOf = (element: Place_record) => (element.item_id) == (r.lugar_de_registro_item_id)
                const i_place = this.place_record.findIndex(isPlaceRecordOf)
                this.place_record[i_place].total_visits! += 1
                //total de registros por mes
                const isMonthRecordOf = (element: LastMonth_visit) => (element.month) == (r.mes_de_registro)
                const i_month = this.month_visit.findIndex(isMonthRecordOf)
                this.month_visit[i_month].total_visits! += 1
                //total de registros por año
                const isYearRecordOf = (element: LastYear_visit) => (element.year) == (r.año_de_registro)
                const i_year = this.year_visit.findIndex(isYearRecordOf)
                this.year_visit[i_year].total_visits! += 1
                //total de registros por razon
                const isReasonOf = (element: Reason_visit) => (element.item_id) == (r.razon_item_id)
                const i_reason = this.reason_visit?.findIndex(isReasonOf)
                this.reason_visit[i_reason].total_visits! += 1
                //total de registros por trasporte
                const isTrasportOf = (element: Transport_visit) => (element.item_id) == (r.transporte_item_id)
                const i_transport = this.transport_visit.findIndex(isTrasportOf)
                this.transport_visit[i_transport].total_visits! += 1
              })
              //this.chart?.update();
            }
          )
        })
        //termina el forechar de contries

      }
    )
  }
  fetchSummary() {
    this.summaryService.getLastSummary().subscribe(
      result => {
        this.cutoff_date = result[0].cutoff_date
        this.avg_tourist_visit = result[0].avg_tourist_visit!
        this.avg_visits_days = result[0].avg_visits_days!
        this.total_record = result[0].total_record!
        this.country_visit = result[0].country_visit!
        this.place_record = result[0].place_record!
        this.lastMonth_visit = result[0].lastMonth_visit!
        this.month_visit = result[0].month_visit!
        this.year_visit = result[0].lastYear_visit!
        this.reason_visit = result[0].reason_visit!
        this.region_visit = result[0].region_visit!
        this.transport_visit = result[0].transport_visit!
        this.fetchpieRegion()
        this.fetchBarReason()
        this.fetchBarTransport()
        this.chart?.update();
      }
    )
  }
  fetchBarReason() {
    var colors:string[]=[]
    this.reason_visit.forEach(reason => {
      let label: string = reason.item_id!
      this.barChartData.labels?.push(label)
      this.barChartData.datasets[0].data.push(reason.total_visits!)
      colors.push(RGBtoHex())
    })
    this.barChartData.datasets[0].backgroundColor=colors

    this.loaded_bar=true
  }
  fetchBarTransport() {
    var colors:string[]=[]
    this.transport_visit.forEach(trasnport => {
      let label: string = trasnport.item_id!
      this.hbarChartData.labels?.push(label)
      this.hbarChartData.datasets[0].data.push(trasnport.total_visits!)
      colors.push(RGBtoHex())
    })
    this.hbarChartData.datasets[0].backgroundColor=colors
    this.loaded_barh=true
  }
  fetchpieRegion() {
    this.region_visit.forEach(region => {
      let label: string = region.region!
      region.countries?.forEach(c => {
      })
      this.pieChartData.labels?.push(label)
      this.pieChartData.datasets[0].data.push(region.visit!)
    })
  }
  saveFetchData() {
    let s: Summary = {}
    s.cutoff_date = Timestamp.now()
    s.avg_tourist_visit = this.avg_tourist_visit
    s.avg_visits_days = this.avg_visits_days
    s.total_record = this.total_record
    s.country_visit = this.country_visit
    s.place_record = this.place_record
    s.lastMonth_visit = this.lastMonth_visit
    s.month_visit = this.month_visit
    s.lastYear_visit = this.year_visit
    s.reason_visit = this.reason_visit
    s.region_visit = this.region_visit
    s.transport_visit = this.transport_visit
    console.log(s)
    this.summaryService.postSummary(s)
  }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
    //this.fetchData()
    this.fetchSummary()
    this.fetchMuseos()
  }

}
