import { Percents } from './../info-point-detail/info-point-detail.component';
import { ItemsService } from './../../services/items.service';
import { Item, ItemId } from './../../models/item';
import { GeneralRecordId } from './../../models/generalRecord';
import { Country_visit, Place_record, LastMonth_visit, LastYear_visit, DataRegionsVisit, Transport_visit, Region_visit, Reason_visit, Summary } from './../../models/summary';
import { Timestamp } from 'firebase/firestore';
import { RolesService } from './../../services/roles.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Museo } from 'src/app/models/museo';
import { MuseosService } from 'src/app/services/museos.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart, ChartConfiguration, ChartData, ChartDataset, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, ThemeService } from 'ng2-charts';
import { GeneralRecordService } from 'src/app/services/general-record.service';
import { CountriesService } from 'src/app/services/countries.service';
import { CountryId } from 'src/app/models/country';
import { finalize, iif } from 'rxjs';
import { SummaryService } from 'src/app/services/summary.service';
import {default as Annotation} from 'chartjs-plugin-annotation';

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
  selector: 'app-info-point',
  templateUrl: './info-point.component.html',
  styleUrls: ['./info-point.component.scss']
})
export class InfoPointComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart2: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart3: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart4: BaseChartDirective | undefined;

  loaded_bar=false
  loaded_barh=false
  loaded_line=false
  selected_1?: ItemId
  selected_2?:ItemId
  selected_1_date?: ItemId
  selected_2_date?:ItemId
  selected_1_transport?: ItemId
  selected_2_transport?:ItemId
  allPlaces: ItemId[]=[]
  //var date
  lath_month = '12'
  lasth_year = '2021'
  //var percents
  percentsRegion:Percents[]=[]
  colorPie:string[]=[]
  //var summary
  country_visit: Country_visit[] = []
  region_visit: DataRegionsVisit[] = [
    {
      region: '1',
      name:'Africa',
      countries: [],
      visit: 0
    },
    {
      region: '2',
      name:'Asia',
      countries: [],
      visit: 0
    },
    {
      region: '3',
      name:'America del sur',
      countries: [],
      visit: 0
    },
    {
      region: '4',
      name:'America del norte',
      countries: [],
      visit: 0
    },
    {
      region: '5',
      name:'America central',
      countries: [],
      visit: 0
    },
    {
      region: '6',
      name:'Europa 1',
      countries: [],
      visit: 0
    },
    {
      region: '7',
      name:'Europa 2',
      countries: [],
      visit: 0
    },
    {
      region: '8',
      name:'Asia',
      countries: [],
      visit: 0
    },
    {
      region: '9',
      name:'America central 2',
      countries: [],
      visit: 0
    },
    {
      region: '10',
      name:'Ocerania',
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
      name:'Terminal Terrestre',
      total_visits: 0
    },
    {
      item_id: '24',
      name:'Central',
      total_visits: 0
    },
    {
      item_id: '647',
      name:'Puerta de la ciudad',
      total_visits: 0
    },
    {
      item_id: '22',
      name:'Vilcabamba',
      total_visits: 0
    },
  ]
  lastMonth_visit: number = 0
  month_visit: LastMonth_visit[] = [
    {
      month: '1',
      name:'Enero',
      total_visits: 0
    },
    {
      month: '2',
      name:'Febrero',
      total_visits: 0
    },
    {
      month: '3',
      name:'Marzo',
      total_visits: 0
    },
    {
      month: '4',
      name:'Abril',
      total_visits: 0
    },
    {
      month: '5',
      name:'Mayo',
      total_visits: 0
    },
    {
      month: '6',
      name:'Junio',
      total_visits: 0
    },
    {
      month: '7',
      name:'Julio',
      total_visits: 0
    },
    {
      month: '8',
      name:'Agosto',
      total_visits: 0
    },
    {
      month: '9',
      name:'Septiembre',
      total_visits: 0
    },
    {
      month: '10',
      name:'Octubre',
      total_visits: 0
    },
    {
      month: '11',
      name:'Noviembre',
      total_visits: 0
    },
    {
      month: '12',
      name:'Diciembre',
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
      name:'Vacaciones',
      total_visits: 0
    },
    {
      item_id: '21',
      name:'Familia',
      total_visits: 0
    },
    {
      item_id: '16',
      name:'Turismo',
      total_visits: 0
    },
    {
      item_id: '27',
      name:'Trabajo',
      total_visits: 0
    },
    {
      item_id: '28',
      name:'Negocios',
      total_visits: 0
    },
    {
      item_id: '17',
      name:'Estudios',
      total_visits: 0
    },
    {
      item_id: '639',
      name:'Otros',
      total_visits: 0
    },
  ]
  transport_visit: Transport_visit[] = [
    {
      item_id: '638',
      name:'Otro',
      total_visits: 0
    },
    {
      item_id: '13',
      name:'Avion',
      total_visits: 0
    },
    {
      item_id: '636',
      name:'Bicicleta',
      total_visits: 0
    },
    {
      item_id: '14',
      name:'Moto',
      total_visits: 0
    },
    {
      item_id: '15',
      name:'Taxi',
      total_visits: 0
    },
    {
      item_id: '637',
      name:'Barco',
      total_visits: 0
    },
    {
      item_id: '25',
      name:'Bus',
      total_visits: 0
    }
  ]
  //fin var summary
  rol = ''
  infoPoints: any[] = []
  constructor(
    private dialog: MatDialog,
    private museosService: MuseosService,
    private rolesService: RolesService,
    private generalRecordService: GeneralRecordService,
    private countriesService: CountriesService,
    private summaryService: SummaryService,
    private itemService: ItemsService
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
      { data: [ ] },
    ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];
  //pie-end
  //line
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data:[],
      label:'Ultimos 12 meses',
      backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
    }],
    labels:[]
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
        },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
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
  orderMonth(){
    var month_order:LastMonth_visit[]=[]
    var x = new Date().getMonth()
    for (let i = 0; i < 12; i++) {
      month_order.unshift(this.month_visit[x-1])
      if(x==1){
        x=12
      }else{
        x-=1
      }
    }
    this.month_visit = month_order
  }
  fetchData() {
    var total_tourist_visit = 0
    var total_visits_days = 0
    this.orderMonth()
    this.countriesService.getAllCountries().subscribe(
      result => {
        result.forEach(country => {
          //this.pieChartData.labels?.push([country.pais_de_procedencia!, `codigo:${country.Iden!}`])
          //console.log(country.Iden)
          this.generalRecordService.getGeneralRecordsByCountry(country.Iden!).subscribe(
            res => {
              let record: Country_visit = {}
              record.country = country.Iden
              record.name=country.pais_de_procedencia
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
        result[0].region_visit!.forEach(region=>{
          const isRegion = (element:Region_visit)=>(element.region)==(region.region)
          const i_region = this.region_visit.findIndex(isRegion)
          this.region_visit[i_region].visit=region.visit
        })
        this.transport_visit = result[0].transport_visit!
        this.fetchpieRegion()
        this.fetchBarReason()
        this.fetchBarTransport()
        this.fetchLineDate()
        this.chart?.update();
      }
    )
  }
  fetchpieRegion() {
    this.pieChartData.labels=[]
    this.pieChartData.datasets=[{
      data:[]
    }]
    var colors: string[] = []
    this.region_visit.forEach(region => {
      let label: string = region.region!
      region.countries?.forEach(c => {
      })
      this.pieChartData.labels?.push(label)
      this.pieChartData.datasets[0].data.push(region.visit!)
      colors.push(RGBtoHex())
    })
    this.pieChartData.datasets[0].backgroundColor=colors
    this.colorPie=colors
    this.fetchPercetsRegion()
  }
  fetchLineDate(){
    this.month_visit.forEach(month=>{
      let label: string = month.name!
      this.lineChartData.labels?.push(label)
      this.lineChartData.datasets[0].data.push(month.total_visits!)
    })
    this.loaded_line=true
  }
  fetchBarReason() {
    var colors:string[]=[]
    this.reason_visit.forEach(reason => {
      let label: string = reason.name!
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
      let label: string = trasnport.name!
      this.hbarChartData.labels?.push(label)
      this.hbarChartData.datasets[0].data.push(trasnport.total_visits!)
      colors.push(RGBtoHex())
    })
    this.hbarChartData.datasets[0].backgroundColor=colors
    this.loaded_barh=true
  }
  fetchAllplaces(){
    this.itemService.getItemsByCatalog('12').subscribe(
      result=>{
        result.forEach(item=>{
          this.allPlaces.push(item)
        })
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
        this.fetchLineDate()
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
        this.fetchBarReason()
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
        this.fetchBarTransport()
      }
    )
  }
  onDate1Changes(value:ItemId){
    //re-set bar
    this.lineChartData.datasets[0].backgroundColor=[RGBtoHex()]
    this.lineChartData.datasets[0].data=[]
    this.lineChartData.datasets[0].label=''
    this.loaded_line=false
    this.month_visit.forEach(month=>{
      month.total_visits=0
    })
    //console.log(value)
    this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isDateOf = (element: LastMonth_visit) => (element.month) == (record.mes_de_registro)
          const i_reason = this.month_visit?.findIndex(isDateOf)
          this.month_visit[i_reason].total_visits! += 1
        })
        this.lineChartData.datasets[0].label=value.Nombre
        this.month_visit.forEach(month=>{
          this.lineChartData.datasets[0].data.push(month.total_visits!)
        })
        this.chart?.update()
        this.loaded_line=true
      }
    )


  }
  onDate2Changes(value:ItemId){
    let serie2:ChartDataset<"line",number[]> = {
      data: [],
      label:''
    }
    if(this.lineChartData.datasets.length<2){
      this.lineChartData.datasets.push(serie2)
    }else{
      this.lineChartData.datasets[1].data=[]
      this.lineChartData.datasets[1].label=''
    }
    this.loaded_line=false
    this.month_visit.forEach(month=>{
      month.total_visits=0
    })
    //console.log(value)
    this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isDateOf = (element: LastMonth_visit) => (element.month) == (record.mes_de_registro)
          const i_reason = this.month_visit?.findIndex(isDateOf)
          this.month_visit[i_reason].total_visits! += 1
        })
        this.lineChartData.datasets[1].label=value.Nombre
        this.month_visit.forEach(month=>{
          this.lineChartData.datasets[1].data.push(month.total_visits!)
        })
        this.chart?.update()
        this.loaded_line=true
      }
    )

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
    this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isReasonOf = (element: Reason_visit) => (element.item_id) == (record.razon_item_id)
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
    this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
      result=>{
        result.forEach(record=>{
          const isReasonOf = (element: Reason_visit) => (element.item_id) == (record.razon_item_id)
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
onTransport1Changes(value:ItemId){
  //re-set bar
  this.hbarChartData.datasets[0].backgroundColor=[RGBtoHex()]
  this.hbarChartData.datasets[0].data=[]
  this.hbarChartData.datasets[0].label=''
  this.loaded_barh=false
  this.transport_visit.forEach(transport=>{
    transport.total_visits=0
  })
  this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
    result=>{
      result.forEach(record=>{
        const isTransportOf = (element: Transport_visit) => (element.item_id) == (record.transporte_item_id)
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
  this.generalRecordService.getGeneralRecordsByPlace(value.Id!).subscribe(
    result=>{
      result.forEach(record=>{
        const isTransportOf = (element: Transport_visit) => (element.item_id) == (record.transporte_item_id)
        const i_transport = this.transport_visit?.findIndex(isTransportOf)
        this.transport_visit[i_transport].total_visits! += 1
      })
      this.hbarChartData.datasets[1].label=value.Nombre
      this.transport_visit.forEach(transport=>{
        this.hbarChartData.datasets[1].data.push(transport.total_visits!)
      })
      this.chart?.update()
      this.loaded_barh=true
    }
  )

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
    //console.log(s)
    this.summaryService.postSummary(s)
  }
  fetchPercetsRegion(){
    let total = this.total_record
    let array:Percents[]=[]
    let i = 0
    this.region_visit.forEach(region=>{
      array.push({name:region.name!,percent:(region.visit!*100/total)!,color:this.colorPie[i]})
      i+=1
    })
    console.log(this.region_visit)
    this.percentsRegion=array
  }



  //FetchProvicional de museos para las cards
  fetchinfoPoints() {
    this.itemService.getItemsByCatalog('12').subscribe(
      result => {
        this.infoPoints = []
        result.forEach(item => {
          var obj = {
            id: item.Id,
            image: 'https://www.loja.gob.ec/files/image/imagenes/MUN-DE-LOJA32.jpg',
            name: item.Nombre,
          }
          this.infoPoints.push(obj)
        })
      }
    )
  }

  //***** */
  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!
    //this.fetchData()
    this.fetchSummary()
    this.fetchAllplaces()
    this.fetchinfoPoints()
  }

}
