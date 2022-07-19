import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Place_record, LastMonth_visit, Reason_visit, Transport_visit } from './../../models/summary';
import { BaseChartDirective } from 'ng2-charts';
import { CountryId } from 'src/app/models/country';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogRVisitComponent } from './dialog-r-visit/dialog-r-visit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MuseosService } from 'src/app/services/museos.service';
import { RecordVisitService } from 'src/app/services/record-visit.service';
import { CountriesService } from 'src/app/services/countries.service';

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
//

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
export interface Period{
  name:string,
  total:number,
}

@Component({
  selector: 'app-musem-detail',
  templateUrl: './musem-detail.component.html',
  styleUrls: ['./musem-detail.component.scss']
})
export class MusemDetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  //loades
  loaded_pie=false
  loaded_pie2=false
  loaded_pie3=false
  loaded_bar=false
  //Msemnfo
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
  //vars
  allPlaces:Places1[]=[]
  percents_country:Percents[]=[]
  children:number=0
  adults:number=0
  women:number=0
  men:number=0
  percents_type:Percents[]=[]
  percents_gener:Percents[]=[]
  total_record: number = 0
  avg_month_visit: number=0
  best_month=''
  best_visit_month=0
  period_visit:Period[]=[
    {
      name:'Mañana',
      total:0
    },
    {
      name:'Tarde',
      total:0
    },
    {
      name:'Noche',
      total:0
    }
  ]
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
  //end-vars
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private museoService: MuseosService,
    private recorVisitService: RecordVisitService,
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
  fetchData(){
    const year=new Date().getFullYear()
    const month_aux = new Date().getMonth()
    this.recorVisitService.getVisitsByMuseum(this.id).subscribe(
      result=>{
            this.total_record=0
            this.total_tourist=0
            this.total_visit=0
            this.children=0
            this.adults=0
            this.men=0
            this.women=0
            result.forEach(record=>{
              //totals
              this.total_record+=1
              this.total_tourist+=record.numberOfCompanions!+1
              this.total_visit+=1
              this.average_visit= Math.round(this.total_tourist/this.total_visit)
              if(this.max_currency<record.numberOfCompanions!){
                this.max_currency=record.numberOfCompanions!
              }
              //dataRegon
              const isCountrytOf = (element: CountryId) => (element.Iden) == (record.country)
              const i_contry = this.allPlaces?.findIndex(isCountrytOf)
              this.allPlaces[i_contry].total!+=1
              //dataType
              this.children+=record.children!
              this.adults+=record.adults!
              console.log(record)
              //dataGener
              this.women+=record.women!
              this.men+=record.men!
              //dataPeriod
              let time = record.date?.toDate().getHours()
              if(time!<=12){
                this.period_visit[0].total+=1
              }
              if(time!>12 && time!<=18){
                this.period_visit[1].total+=1
              }
              if(time!>18){
                this.period_visit[2].total+=1
              }
            })
            this.allPlaces = ordenarPorBurbuja(this.allPlaces)
            this.fetchpieRegion()
            this.fetchPieType()
            this.fetchPieGener()
            this.fetchBarPeriod()
      })
  }
  fetchBarPeriod(){
    this.loaded_bar=false
    var colors:string[]=[]
    this.period_visit.forEach(period=>{
      this.barChartData.labels?.push(period.name)
      this.barChartData.datasets[0].data.push(period.total)
      colors.push(RGBtoHex())
    })
    this.barChartData.datasets[0].label='Frecuencia de visitas'
    this.barChartData.datasets[0].backgroundColor=colors
    this.chart?.update
    this.loaded_bar=true
  }
  fetchPieGener(){
    this.loaded_pie3=false
    var colors:string[]=[]
    let percents:Percents[]=[]
    this.pieChartData3.labels?.push('Mujeres')
    this.pieChartData3.labels?.push('Hombres')
    this.pieChartData3.datasets[0].data.push(this.women)
    let c_1=RGBtoHex()
    colors.push(c_1)
    percents.push({
      name: 'Mujeres',
      percent: this.women!*(100/this.total_tourist),
      color:c_1
    })
    this.pieChartData3.datasets[0].data.push(this.men)
    let c_2=RGBtoHex()
    colors.push(c_2)
    percents.push({
      name: 'Hombres',
      percent: this.men!*(100/this.total_tourist),
      color:c_2
    })
    this.pieChartData3.datasets[0].backgroundColor=colors
    this.percents_gener=percents
    this.chart?.update
    this.loaded_pie3=true
  }
  fetchPieType(){
    this.loaded_pie2=false
    var colors:string[]=[]
    let percents:Percents[]=[]
    this.pieChartData2.labels?.push('Adultos')
    this.pieChartData2.labels?.push('Niños')
    this.pieChartData2.datasets[0].data.push(this.adults)
    let c_1=RGBtoHex()
    colors.push(c_1)
    percents.push({
      name: 'Adultos',
      percent: this.adults!*(100/this.total_tourist),
      color:c_1
    })
    this.pieChartData2.datasets[0].data.push(this.children)
    let c_2=RGBtoHex()
    colors.push(c_2)
    percents.push({
      name: 'Niño',
      percent: this.children!*(100/this.total_tourist),
      color:c_2
    })
    this.pieChartData2.datasets[0].backgroundColor=colors
    this.percents_type=percents
    this.chart?.update
    this.loaded_pie2=true
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
    this.fetchAllplaces()

  }

}
