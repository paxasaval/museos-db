import { MatDialog } from '@angular/material/dialog';
import { DialogRVisitInfoPComponent } from './dialog-r-visit-info-p/dialog-r-visit-info-p.component';
import { CountriesService } from './../../services/countries.service';
import { RecordVisitId } from './../../models/recordVisit';
import { ItemsService } from 'src/app/services/items.service';
import { ItemId } from './../../models/item';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Timestamp } from 'firebase/firestore';
import { Country_visit, DataRegionsVisit, Place_record, LastMonth_visit, LastYear_visit, Reason_visit, Transport_visit } from './../../models/summary';
import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GeneralRecordService } from 'src/app/services/general-record.service';
import { RecordVisit } from 'src/app/models/recordVisit';
import { CountryId } from 'src/app/models/country';

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
export interface Places1 extends CountryId{
  total: number
}
export interface Percents {
  name:string,
  percent:number
  color?:string
}
function ordenarPorBurbuja(arrayDesordenado: Places1[]): Places1[] {
  // Copia el array recibido
  let tempArray: Places1[] = arrayDesordenado;
  let volverAOrdenar: boolean = false
  // Recorre el array
  tempArray.forEach(function (valor, key) {
      // Comprueba si el primero es mayor que el segundo y no esta en la última posición
      if (tempArray[key].total!> tempArray[key + 1]?.total! && tempArray.length - 1 != key) {
          // Intercambia la primera posición por la segunda
          let primerNum: Places1 = tempArray[key]
          let segundoNum: Places1 = tempArray[key + 1]
          tempArray[key] = segundoNum
          tempArray[key + 1] = primerNum
          // Si debe volver a ordenarlo
          volverAOrdenar = true
      }
  })
  // Vuelve a llamar al función
  if (volverAOrdenar) {
      ordenarPorBurbuja(tempArray)
  }
  // Array ordenado
  return tempArray
}
function ordenarPorBurbuja3(arrayDesordenado: Transport_visit[]): Transport_visit[] {
  // Copia el array recibido
  let tempArray: Transport_visit[] = arrayDesordenado;
  let volverAOrdenar: boolean = false
  // Recorre el array
  tempArray.forEach(function (valor, key) {
      // Comprueba si el primero es mayor que el segundo y no esta en la última posición
      if (tempArray[key].total_visits!> tempArray[key + 1]?.total_visits! && tempArray.length - 1 != key) {
          // Intercambia la primera posición por la segunda
          let primerNum: Transport_visit = tempArray[key]
          let segundoNum: Transport_visit = tempArray[key + 1]
          tempArray[key] = segundoNum
          tempArray[key + 1] = primerNum
          // Si debe volver a ordenarlo
          volverAOrdenar = true
      }
  })
  // Vuelve a llamar al función
  if (volverAOrdenar) {
      ordenarPorBurbuja3(tempArray)
  }
  // Array ordenado
  return tempArray
}
function ordenarPorBurbuja2(arrayDesordenado: Reason_visit[]): Reason_visit[] {
  // Copia el array recibido
  let tempArray: Reason_visit[] = arrayDesordenado;
  let volverAOrdenar: boolean = false
  // Recorre el array
  tempArray.forEach(function (valor, key) {
      // Comprueba si el primero es mayor que el segundo y no esta en la última posición
      if (tempArray[key].total_visits!> tempArray[key + 1]?.total_visits! && tempArray.length - 1 != key) {
          // Intercambia la primera posición por la segunda
          let primerNum: Reason_visit = tempArray[key]
          let segundoNum: Reason_visit = tempArray[key + 1]
          tempArray[key] = segundoNum
          tempArray[key + 1] = primerNum
          // Si debe volver a ordenarlo
          volverAOrdenar = true
      }
  })
  // Vuelve a llamar al función
  if (volverAOrdenar) {
      ordenarPorBurbuja2(tempArray)
  }
  // Array ordenado
  return tempArray
}

@Component({
  selector: 'app-info-point-detail',
  templateUrl: './info-point-detail.component.html',
  styleUrls: ['./info-point-detail.component.scss']
})



export class InfoPointDetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  loaded_pie=false
  loaded_pie2=false
  loaded_pie3=false
  loaded_bar=false
  //id
  id?:string
  allPlaces:Places1[]=[]
  percents_country:Percents[]=[]
  percents_reason:Percents[]=[]
  percents_trasnport:Percents[]=[]
  total_record: number = 0
  avg_month_visit: number=0
  best_month=''
  best_visit_month=0
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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private generalRecordService: GeneralRecordService,
    private route: ActivatedRoute,
    private itemService: ItemsService,
    private countriesService: CountriesService
  ) { }
  //pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
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
  public pieChartPlugins = [];
  //pie-end
  //pie2
  public pieChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    }
  };
  public pieChartData2: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      { data: [ ] },
    ]
  };
  public pieChartType2: ChartType = 'pie';
  public pieChartPlugins2 = [];
  //pie-end
  //pie3
  public pieChartOptions3: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    }
  };
  public pieChartData3: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      { data: [ ] },
    ]
  };
  public pieChartType3: ChartType = 'pie';
  public pieChartPlugins3 = [];
  //pie-end3
  //bar
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
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
  public barChartPlugins = [
    DatalabelsPlugin
  ];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [] },
    ]
  };

  //bar-end

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
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
      this.fetchAllplaces()
    });
  }
  fetchAllplaces(){
    this.countriesService.getAllCountries().subscribe(
      result=>{
        result.forEach(item=>{
          var aux:Places1 = {...item, total:0}
          aux.total=0
          this.allPlaces.push(aux)
        })
        this.fetchData()
      }
    )
  }
  fetchData() {
    const year=new Date().getFullYear()
    const month_aux = new Date().getMonth()
    this.generalRecordService.getGeneralRecordsByPlace(this.id!).subscribe(
      result=>{
        result.forEach(record=>{
          //total
          this.total_record+=1
          //dataRegon
          const isCountrytOf = (element: CountryId) => (element.Iden) == (record.pais_id)
          const i_contry = this.allPlaces?.findIndex(isCountrytOf)
          this.allPlaces[i_contry].total!+=1
          //dataReason
          const isReasonOf =(element: Reason_visit) => (element.item_id) == (record.razon_item_id)
          const i_reason = this.reason_visit.findIndex(isReasonOf)
          this.reason_visit[i_reason].total_visits!+=1
          //dataTransport
          const isTransportOf = (element: Transport_visit) => (element.item_id) == (record.transporte_item_id)
          const i_trasnport = this.transport_visit.findIndex(isTransportOf)
          this.transport_visit[i_trasnport].total_visits!+=1
          //AverageMonth
          const isMonthOf = (element: LastMonth_visit) => (element.month) == (record.mes_de_registro)
          const i_Month = this.month_visit.findIndex(isMonthOf)
          if(parseInt(record.año_de_registro!)==year && parseInt(record.mes_de_registro!)<=month_aux){
            this.month_visit[i_Month].total_visits!+=1
          }
          if(parseInt(record.año_de_registro!)==year-1 && parseInt(record.mes_de_registro!)>month_aux){
            this.month_visit[i_Month].total_visits!+=1
          }

/*           this.total_record+=
          this.total_person+=record.
          this.total_woman=0
          this.total_men=0
          this.total_children=0
          this.total_adults=0 */

        })
        //bestMonth
        console.log(this.month_visit)
        this.month_visit.forEach(month=>{
          if(month.total_visits!>this.best_visit_month){
            this.best_visit_month=month.total_visits!
            this.best_month=month.name!
            console.log(this.best_month)
          }
        })
        this.avg_month_visit=this.total_record/12

        this.reason_visit=ordenarPorBurbuja2(this.reason_visit)
        this.transport_visit = ordenarPorBurbuja3(this.transport_visit)
        this.allPlaces = ordenarPorBurbuja(this.allPlaces)
        this.fetchpieRegion()
        this.fetchPieDataReason()
        this.fetchPieDataTransport()
        this.fetchBarDataMonth()
      }
    )

  }
  fetchpieRegion() {
    var colors:string[]=[]
    let total=0
    let percents:Percents[]=[]
    this.loaded_pie=false
    this.allPlaces=this.allPlaces.reverse()
    let other_label='Otros'
    let other_total=0
    for (let index = 0; index < 5; index++) {
      this.pieChartData.labels?.push(this.allPlaces[index].pais_de_procedencia!)
      this.pieChartData.datasets[0].data.push(this.allPlaces[index].total)
      total+=this.allPlaces[index].total
      colors.push(RGBtoHex())
    }
    for (let i = 5; i < this.allPlaces.length; i++) {
      other_total+=this.allPlaces[i].total
      total+=this.allPlaces[i].total
    }
    this.pieChartData.labels?.push(other_label)
    this.pieChartData.datasets[0].data.push(other_total)
    colors.push(RGBtoHex())
    this.pieChartData.datasets[0].backgroundColor=colors
    percents.push({
      name: this.allPlaces[0].pais_de_procedencia!,
      percent: this.allPlaces[0].total*(100/total),
      color: colors[0]
    })
    percents.push({
      name: this.allPlaces[1].pais_de_procedencia!,
      percent: this.allPlaces[1].total*(100/total),
      color: colors[1]

    })
    percents.push({
      name: this.allPlaces[2].pais_de_procedencia!,
      percent: this.allPlaces[2].total*(100/total),
      color: colors[2]

    })
    percents.push({
      name: this.allPlaces[3].pais_de_procedencia!,
      percent: this.allPlaces[3].total*(100/total),
      color: colors[3]

    })
    percents.push({
      name: this.allPlaces[4].pais_de_procedencia!,
      percent: this.allPlaces[4].total*(100/total),
      color: colors[4]

    })
    percents.push({
      name: other_label,
      percent: other_total*(100/total),
      color: colors[5]

    })
    this.percents_country=percents
    this.chart?.update
    this.loaded_pie=true
  }
  fetchPieDataReason(){
    this.loaded_pie2=false
    var colors:string[]=[]
    let percents:Percents[]=[]
    this.reason_visit = this.reason_visit.reverse()
    this.reason_visit.forEach(reason=>{
      this.pieChartData2.labels?.push(reason.name!)
      this.pieChartData2.datasets[0].data.push(reason.total_visits!)
      let c=RGBtoHex()
      colors.push(c)
      percents.push({
        name: reason.name!,
        percent: reason.total_visits!*(100/this.total_record),
        color:c
      })
    })
    this.pieChartData2.datasets[0].backgroundColor=colors
    this.percents_reason=percents
    this.chart?.update
    this.loaded_pie2=true
  }
  fetchPieDataTransport(){
    this.loaded_pie3=false
    var colors:string[]=[]
    let percents:Percents[]=[]
    this.transport_visit = this.transport_visit.reverse()
    this.transport_visit.forEach(transport=>{
      this.pieChartData3.labels?.push(transport.name!)
      this.pieChartData3.datasets[0].data.push(transport.total_visits!)
      let c=RGBtoHex()
      colors.push(c)
      percents.push({
        name: transport.name!,
        percent: transport.total_visits!*(100/this.total_record),
        color: c
      })
    })
    this.percents_trasnport=percents
    this.chart?.update
    this.loaded_pie3=true
  }
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
  fetchBarDataMonth(){
    this.loaded_bar=false
    this.orderMonth()
    this.month_visit.forEach(month=>{
      this.barChartData.labels?.push(month.name)
      this.barChartData.datasets[0].data.push(month.total_visits!)
    })
    this.barChartData.datasets[0].label='Ultimos 12 meses'
    console.log(this.barChartData)
    this.chart?.update
    this.loaded_bar=true
  }
}
