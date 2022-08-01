import { ItemId } from 'src/app/models/item';
import { RecordVisitService } from './../../services/record-visit.service';
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
import { Chart, ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GeneralRecordService } from 'src/app/services/general-record.service';
import { CountriesService } from 'src/app/services/countries.service';
import { CountryId } from 'src/app/models/country';
import { combineLatest, finalize, iif } from 'rxjs';
import { SummaryService } from 'src/app/services/summary.service';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { Percents } from '../info-point-detail/info-point-detail.component';

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

  const [r, g, b] = HSLtoRGB(hBase, 1, newL * .01);
  return [r, g, b]
}
export function HSLtoRGB(h: number, s: number, l: number) {
  let r, g, b;

  const rd = (a: number) => {
    return Math.floor(Math.max(Math.min(a * 256, 255), 0));
  };

  const hueToRGB = (m: number, n: number, o: number) => {
    if (o < 0) o += 1;
    if (o > 1) o -= 1;
    if (o < 1 / 6) return m + (n - m) * 6 * o;
    if (o < 1 / 2) return n;
    if (o < 2 / 3) return m + (n - m) * (2 / 3 - o) * 6;
    return m;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  r = hueToRGB(p, q, h + 1 / 3);
  g = hueToRGB(p, q, h);
  b = hueToRGB(p, q, h - 1 / 3);

  return [rd(r), rd(g), rd(b)]
}
function RGBtoHex() {
  const [r, g, b] = newColor()
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

@Component({
  selector: 'app-museum',
  templateUrl: './museum.component.html',
  styleUrls: ['./museum.component.scss']
})
export class MuseumComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  loaded_bar = false
  loaded_barh = false
  loaded_line = false
  selected_1?: ItemId
  selected_2?: ItemId
  selected_1_date?: ItemId
  selected_2_date?: ItemId
  selected_1_transport?: ItemId
  selected_2_transport?: ItemId
  allPlaces: ItemId[] = []
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
  //var percents
  percentsRegion: Percents[] = []
  colorPie: string[] = []
  //
  place_record: Place_record[] = [
    {
      item_id: '640',
      name: 'Terminal Terrestre',
      total_visits: 0
    },
    {
      item_id: '24',
      name: 'Central',
      total_visits: 0
    },
    {
      item_id: '647',
      name: 'Puerta de la ciudad',
      total_visits: 0
    },
    {
      item_id: '22',
      name: 'Vilcabamba',
      total_visits: 0
    },
  ]
  lastMonth_visit: number = 0
  month_visit: LastMonth_visit[] = [
    {
      month: '1',
      name: 'Enero',
      total_visits: 0
    },
    {
      month: '2',
      name: 'Febrero',
      total_visits: 0
    },
    {
      month: '3',
      name: 'Marzo',
      total_visits: 0
    },
    {
      month: '4',
      name: 'Abril',
      total_visits: 0
    },
    {
      month: '5',
      name: 'Mayo',
      total_visits: 0
    },
    {
      month: '6',
      name: 'Junio',
      total_visits: 0
    },
    {
      month: '7',
      name: 'Julio',
      total_visits: 0
    },
    {
      month: '8',
      name: 'Agosto',
      total_visits: 0
    },
    {
      month: '9',
      name: 'Septiembre',
      total_visits: 0
    },
    {
      month: '10',
      name: 'Octubre',
      total_visits: 0
    },
    {
      month: '11',
      name: 'Noviembre',
      total_visits: 0
    },
    {
      month: '12',
      name: 'Diciembre',
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
      name: 'Vacaciones',
      total_visits: 0
    },
    {
      item_id: '21',
      name: 'Familia',
      total_visits: 0
    },
    {
      item_id: '16',
      name: 'Turismo',
      total_visits: 0
    },
    {
      item_id: '27',
      name: 'Trabajo',
      total_visits: 0
    },
    {
      item_id: '28',
      name: 'Negocios',
      total_visits: 0
    },
    {
      item_id: '17',
      name: 'Estudios',
      total_visits: 0
    },
    {
      item_id: '639',
      name: 'Otros',
      total_visits: 0
    },
  ]
  transport_visit: Transport_visit[] = [
    {
      item_id: '638',
      name: 'Otro',
      total_visits: 0
    },
    {
      item_id: '13',
      name: 'Avion',
      total_visits: 0
    },
    {
      item_id: '636',
      name: 'Bicicleta',
      total_visits: 0
    },
    {
      item_id: '14',
      name: 'Moto',
      total_visits: 0
    },
    {
      item_id: '15',
      name: 'Taxi',
      total_visits: 0
    },
    {
      item_id: '637',
      name: 'Barco',
      total_visits: 0
    },
    {
      item_id: '25',
      name: 'Bus',
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
    private recordVisitService: RecordVisitService,
    private countriesService: CountriesService,
    private summaryService: SummaryService,

  ) {
    Chart.register(Annotation)
  }

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
  public barChartPlugins = [DatalabelsPlugin];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Total', backgroundColor: [] },
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
  public hbarChartPlugins = [DatalabelsPlugin];
  public hbarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Total', backgroundColor: [] },
    ],

  };
  //fin-bar
  //pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
      { data: [] },
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];
  //pie-end
  //line
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: 'Ultimos 12 meses',
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      fill: 'false',
    }],
    labels: []
  }
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
      {
        position: 'left',
      }
    },
    plugins: {
      legend: {
        display: true
      },

    }
  }
  public lineChartType: ChartType = 'line';
  //fin-line
  openDialogNewMuseum(): void {
    const dialogRef = this.dialog.open(DialogMuseumComponent, {
      panelClass: 'app-full-bleed-dialog',
      data: {
        'edit': false,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
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
  orderMonth() {
    var month_order: LastMonth_visit[] = []
    var x = new Date().getMonth()
    if(this.month_visit[0].month!='1'){
      return
    }
    for (let i = 0; i < 12; i++) {
      month_order.unshift(this.month_visit[x - 1])
      if (x == 1) {
        x = 12
      } else {
        x -= 1
      }
    }
    this.month_visit = month_order
  }
  fetchData() {
    var total_tourist_visit = 0
    this.orderMonth()
    combineLatest([this.countriesService.getAllCountries(), this.recordVisitService.getAllVisits(), this.museosService.getAllMuseos()]).subscribe(
      ([countries, record, museos]) => {
        //reset var
        this.allPlaces=[]
        museos.forEach(museo=>{
          this.allPlaces.push({id:museo.id,Nombre:museo.name,Id:museo.id})
        })
        this.country_visit = []
        this.place_record = []
        this.total_record = 0
        this.avg_tourist_visit = 0
        this.place_record.forEach(place => {
          place.total_visits = 0
        })
        museos.forEach(museo => {
          this.place_record.push({ item_id: museo.id, name: museo.name, total_visits: 0 })
        })
        this.month_visit.forEach(month => {
          month.total_visits = 0
        })
        this.year_visit.forEach(year => {
          year.total_visits = 0
        })
        this.reason_visit.forEach(reason => {
          reason.total_visits = 0
        })
        this.transport_visit.forEach(transport => {
          transport.total_visits = 0
        })
        this.region_visit.forEach(region=>{
          region.visit=0
        })
        //
        countries.forEach(country => {
          let recCountryVisit: Country_visit = {}
          recCountryVisit.country = country.Iden
          recCountryVisit.name = country.pais_de_procedencia
          recCountryVisit.total_visits = 0
          this.country_visit.push(recCountryVisit)
        })
        record.forEach(record => {
          const isCountryOf = (element: Country_visit) => (element.country) == (record.country)
          const i_Country = this.country_visit.findIndex(isCountryOf)
          this.country_visit[i_Country].total_visits! += 1
          //total de registros
          this.total_record += 1
          //media de turistas por registro
          total_tourist_visit += record.numberOfCompanions!
          this.avg_tourist_visit = total_tourist_visit / this.total_record
          //total de registros por Museo
          const isPlaceRecordOf = (element: Place_record) => (element.item_id) == (record.museum)
          const i_place = this.place_record.findIndex(isPlaceRecordOf)
          this.place_record[i_place].total_visits! += 1
          //total de registros por mes
          const isMonthRecordOf = (element: LastMonth_visit) => (element.month) == ((record.date?.toDate().getMonth()! + 1).toString())
          const i_month = this.month_visit.findIndex(isMonthRecordOf)
          this.month_visit[i_month].total_visits! += 1
          //total de registros por año
          const isYearRecordOf = (element: LastYear_visit) => (element.year) == ((record.date?.toDate().getFullYear()!).toString())
          const i_year = this.year_visit.findIndex(isYearRecordOf)
          this.year_visit[i_year].total_visits! += 1
          //total de registros por razon
          const isReasonOf = (element: Reason_visit) => (element.item_id) == (record.reasonForVisit)
          const i_reason = this.reason_visit?.findIndex(isReasonOf)
          if (i_reason != -1) {
            this.reason_visit[i_reason].total_visits! += 1
          }
          //total de registros por trasporte
          const isTrasportOf = (element: Transport_visit) => (element.item_id) == (record.transport)
          const i_transport = this.transport_visit.findIndex(isTrasportOf)
          this.transport_visit[i_transport].total_visits! += 1
        })
        countries.forEach(country => {
          let record: Country_visit = {}
          const paralelCountry = (element: Country_visit) => (element.country) == (country.Iden)
          const i_paralel = this.country_visit.findIndex(paralelCountry)
          const isRegionOf = (element: Region_visit) => (element.region) == (country.region_id)
          const i_Region = this.region_visit.findIndex(isRegionOf)
          this.region_visit[i_Region].countries?.push(this.country_visit[i_paralel])
          this.region_visit[i_Region].visit! += this.country_visit[i_paralel].total_visits!
        })
        this.fetchpieRegion()
        this.fetchBarReason()
        this.fetchBarTransport()
        this.fetchLineDate()
        console.log('sad')
        this.chart?.update();
      }
    )
  }
  fetchPercetsRegion() {
    let total = this.total_record
    let array: Percents[] = []
    let i = 0
    this.region_visit.forEach(region => {
      array.push({ name: region.name!, percent: (region.visit! * 100 / total)!, color: this.colorPie[i] })
      i += 1
    })
    this.percentsRegion = array
  }

  fetchpieRegion() {
    var colors: string[] = []
    this.pieChartData.labels=[]
    this.pieChartData.datasets[0].data=[]
    this.region_visit.forEach(region => {
      let label: string = region.region!
      region.countries?.forEach(c => {
      })
      this.pieChartData.labels?.push(label)
      this.pieChartData.datasets[0].data.push(region.visit!)
      colors.push(RGBtoHex())
    })
    this.pieChartData.datasets[0].backgroundColor = colors
    this.colorPie = colors
    this.fetchPercetsRegion()
  }
  fetchLineDate() {
    this.lineChartData.labels=[]
    this.lineChartData.datasets=[{
      data:[],
      label:'Ultimos 12 meses'
    }]
    this.month_visit.forEach(month => {
      let label: string = month.name!
      this.lineChartData.labels?.push(label)
      this.lineChartData.datasets[0].data.push(month.total_visits!)
    })
    this.loaded_line = true
  }
  fetchBarReason() {
    let color = RGBtoHex()
    this.barChartData.labels=[]
    this.barChartData.datasets=[{
      data:[],
      label:'Ultimos 12 meses',
      backgroundColor:color
    }]
    var colors: string[] = []
    this.reason_visit.forEach(reason => {
      let label: string = reason.name!
      this.barChartData.labels?.push(label)
      this.barChartData.datasets[0].data.push(reason.total_visits!)
    })
    this.loaded_bar = true
  }
  fetchBarTransport() {
    let color = RGBtoHex()
    this.hbarChartData.labels=[]
    this.hbarChartData.datasets=[{
      data:[],
      label:'Ultimos 12 meses',
      backgroundColor:color
    }]
    var colors: string[] = []
    this.transport_visit.forEach(trasnport => {
      let label: string = trasnport.name!
      this.hbarChartData.labels?.push(label)
      this.hbarChartData.datasets[0].data.push(trasnport.total_visits!)
    })
    this.loaded_barh = true
  }


  onDate1Changes(value: ItemId) {
    //re-set bar
    this.lineChartData.datasets[0].backgroundColor = [RGBtoHex()]
    this.lineChartData.datasets[0].data = []
    this.lineChartData.datasets[0].label = ''
    this.loaded_line = false
    this.month_visit.forEach(month => {
      month.total_visits = 0
    })
    //console.log(value)
    this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
      result => {
        result.forEach(record => {
          const isDateOf = (element: LastMonth_visit) => (element.month) == ((record.date?.toDate().getMonth()! - 1).toString())
          const i_reason = this.month_visit?.findIndex(isDateOf)
          this.month_visit[i_reason].total_visits! += 1
        })
        this.lineChartData.datasets[0].label = value.Nombre
        this.month_visit.forEach(month => {
          this.lineChartData.datasets[0].data.push(month.total_visits!)
        })
        this.chart?.update()
        this.loaded_line = true
      }
    )


  }
  onDate2Changes(value: ItemId) {
    let serie2: ChartDataset<"line", number[]> = {
      data: [],
      label: ''
    }
    if (this.lineChartData.datasets.length < 2) {
      this.lineChartData.datasets.push(serie2)
    } else {
      this.lineChartData.datasets[1].data = []
      this.lineChartData.datasets[1].label = ''
    }
    this.loaded_line = false
    this.month_visit.forEach(month => {
      month.total_visits = 0
    })
    //console.log(value)
    this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
      result => {
        result.forEach(record => {
          const isDateOf = (element: LastMonth_visit) => (element.month) == ((record.date?.toDate().getMonth()! - 1).toString())
          const i_reason = this.month_visit?.findIndex(isDateOf)
          this.month_visit[i_reason].total_visits! += 1
        })
        this.lineChartData.datasets[1].label = value.Nombre
        this.month_visit.forEach(month => {
          this.lineChartData.datasets[1].data.push(month.total_visits!)
        })
        this.chart?.update()
        this.loaded_line = true
      }
    )
  }
  updateDate(){
    this.loaded_line=false
    this.selected_1=undefined
    this.selected_2=undefined
    if(this.lineChartData.datasets.length>1){
      this.lineChartData.datasets.pop()
    }
    this.lineChartData.labels=[]
    this.lineChartData.datasets[0].data=[]
    this.lineChartData.datasets[0].label='Total'
    this.fetchData()
  }
  onPlace1Changes(value:ItemId){
    //re-set bar
    this.barChartData.datasets[0].backgroundColor=[RGBtoHex()]
    this.barChartData.datasets[0].data=[]
    this.barChartData.datasets[0].label=''
    this.loaded_bar=false
    this.reason_visit.forEach(reason=>{
      reason.total_visits=0
    })
    //console.log(value)
    this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isReasonOf = (element: Reason_visit) => (element.item_id) == (record.reasonForVisit)
          const i_reason = this.reason_visit?.findIndex(isReasonOf)
          this.reason_visit[i_reason].total_visits! += 1
        })
        this.barChartData.datasets[0].label=value.Nombre
        this.reason_visit.forEach(reason=>{
          this.barChartData.datasets[0].data.push(reason.total_visits!)
        })
        this.chart?.update()
        this.loaded_bar=true
      }
    )


  }
  onPlace2Changes(value:ItemId){
    let serie2:ChartDataset<"bar",number[]> = {
      data: [],
      label:''
    }
    if(this.barChartData.datasets.length<2){
      this.barChartData.datasets.push(serie2)
    }else{
      this.barChartData.datasets[1].data=[]
      this.barChartData.datasets[1].label=''
    }
    this.loaded_bar=false
    this.reason_visit.forEach(reason=>{
      reason.total_visits=0
    })
    //console.log(value)
    this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isReasonOf = (element: Reason_visit) => (element.item_id) == (record.reasonForVisit)
          const i_reason = this.reason_visit?.findIndex(isReasonOf)
          this.reason_visit[i_reason].total_visits! += 1
        })
        this.barChartData.datasets[1].label=value.Nombre
        this.reason_visit.forEach(reason=>{
          this.barChartData.datasets[1].data.push(reason.total_visits!)
        })
        this.chart?.update()
        this.loaded_bar=true
      }
    )

}
updateReason(){
  this.loaded_bar=false
  this.selected_1=undefined
  this.selected_2=undefined
  if(this.barChartData.datasets.length>1){
    this.barChartData.datasets.pop()
  }
  this.barChartData.labels=[]
  this.barChartData.datasets[0].data=[]
  this.barChartData.datasets[0].label='Total'
  this.fetchData()
}
onTransport1Changes(value:ItemId){
  //re-set bar
  this.hbarChartData.datasets[0].backgroundColor=[RGBtoHex()]
  this.hbarChartData.datasets[0].data=[]
  this.hbarChartData.datasets[0].label=''
  this.loaded_barh=false
  this.transport_visit.forEach(transport=>{
    transport.total_visits=0
  })
  this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
    result=>{
      result.forEach(record=>{
        const isTransportOf = (element: Transport_visit) => (element.item_id) == (record.transport)
        const i_transport = this.transport_visit?.findIndex(isTransportOf)
        this.transport_visit[i_transport].total_visits! += 1
      })
      this.hbarChartData.datasets[0].label=value.Nombre
      this.transport_visit.forEach(transport=>{
        this.hbarChartData.datasets[0].data.push(transport.total_visits!)
      })
      this.chart?.update()
      this.loaded_barh=true
    }
  )


}
onTransport2Changes(value:ItemId){
  let serie2:ChartDataset<"bar",number[]> = {
    data: [],
    label:''
  }
  if(this.hbarChartData.datasets.length<2){
    this.hbarChartData.datasets.push(serie2)
  }else{
    this.hbarChartData.datasets[1].data=[]
    this.hbarChartData.datasets[1].label=''
  }
  this.loaded_barh=false
  this.transport_visit.forEach(transport=>{
    transport.total_visits=0
  })
  this.recordVisitService.getVisitsByMuseum(value.Id!).subscribe(
    result=>{
      result.forEach(record=>{
        const isTransportOf = (element: Transport_visit) => (element.item_id) == (record.transport)
        const i_transport = this.transport_visit?.findIndex(isTransportOf)
        this.transport_visit[i_transport].total_visits! += 1
      })
      this.hbarChartData.datasets[1].label=value.Nombre
      this.transport_visit.forEach(transport=>{
        this.hbarChartData.datasets[1].data.push(transport.total_visits!)
      })
      console.log(this.hbarChartData.datasets)
      this.chart?.update()
      this.loaded_barh=true
    }
  )

}

updateTransport(){
  this.loaded_barh=false
  this.selected_1_transport=undefined
  this.selected_2_transport=undefined
  if(this.hbarChartData.datasets.length>1){
    this.hbarChartData.datasets.pop()
  }
  this.hbarChartData.labels=[]
  this.hbarChartData.datasets[0].data=[]
  this.hbarChartData.datasets[0].label='Total'
 this.fetchData()
}
  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
    this.fetchData()
    //this.fetchSummary()
    this.fetchMuseos()
  }

}
