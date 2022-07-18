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

export interface Places1 extends CountryId{
  total: number
}
export interface Percents {
  name:string,
  percent:number
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
  //id
  id?:string
  allPlaces:Places1[]=[]
  percents_country:Percents[]=[]
  percents_type:Percents[]=[]
  percents_gener:Percents[]=[]
  total_record: number = 0
  total_person: number=0
  total_woman: number=0
  total_men: number=0
  total_children: number=0
  total_adults: number=0
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
        display: true,
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
        display: true,
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
  //pie
  public pieChartOptions3: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
  //pie-end
  goBack() {
    this.router.navigate(['/puntos-de-informacion']);
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
        this.fetchPieDataRegion()
      }
    )
  }

  fetchPieDataRegion() {
    this.generalRecordService.getGeneralRecordsByPlace(this.id!).subscribe(
      result=>{
        result.forEach(record=>{
          //dataRegon
          const isCountrytOf = (element: CountryId) => (element.Iden) == (record.pais_id)
          const i_contry = this.allPlaces?.findIndex(isCountrytOf)
          this.allPlaces[i_contry].total!+=1
          //dataType
/*           this.total_record+=
          this.total_person+=record.
          this.total_woman=0
          this.total_men=0
          this.total_children=0
          this.total_adults=0 */
          
        })
        this.allPlaces = ordenarPorBurbuja(this.allPlaces)
        this.fetchpieRegion()
      }
    )

  }
  fetchpieRegion() {
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
    }
    for (let i = 5; i < this.allPlaces.length; i++) {
      other_total+=this.allPlaces[i].total
      total+=this.allPlaces[i].total
    }
    this.pieChartData.labels?.push(other_label)
    this.pieChartData.datasets[0].data.push(other_total)
    percents.push({
      name: this.allPlaces[0].pais_de_procedencia!,
      percent: this.allPlaces[0].total*(100/total)
    })
    percents.push({
      name: this.allPlaces[1].pais_de_procedencia!,
      percent: this.allPlaces[1].total*(100/total)
    })
    percents.push({
      name: this.allPlaces[2].pais_de_procedencia!,
      percent: this.allPlaces[2].total*(100/total)
    })
    percents.push({
      name: this.allPlaces[3].pais_de_procedencia!,
      percent: this.allPlaces[3].total*(100/total)
    })
    percents.push({
      name: this.allPlaces[4].pais_de_procedencia!,
      percent: this.allPlaces[4].total*(100/total)
    })
    percents.push({
      name: other_label,
      percent: other_total*(100/total)
    })
    this.percents_country=percents
    this.loaded_pie=true
    this.chart?.update

  }
}
