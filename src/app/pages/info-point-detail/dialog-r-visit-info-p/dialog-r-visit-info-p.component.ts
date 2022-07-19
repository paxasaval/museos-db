import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item, ItemId } from 'src/app/models/item';

@Component({
  selector: 'app-dialog-r-visit-info-p',
  templateUrl: './dialog-r-visit-info-p.component.html',
  styleUrls: ['./dialog-r-visit-info-p.component.scss']
})
export class DialogRVisitInfoPComponent implements OnInit {

  allInfoPoints: ItemId[] = []
  allReason: ItemId[] = []
  allTransport: ItemId[] = []
  constructor() { }

  visitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    identification: new FormControl('', [Validators.required]),
    museum: new FormControl('', [Validators.required]),
    supervisor: new FormControl('',),
    country:new FormControl('', ),
    companions: new FormControl('', [Validators.required]),
    adult: new FormControl('', [Validators.required]),
    children: new FormControl('', [Validators.required]),
    woman: new FormControl('', [Validators.required]),
    men: new FormControl('', [Validators.required]),
    transport: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    commit: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
  }

}
