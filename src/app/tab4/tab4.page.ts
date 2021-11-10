import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import data from 'src/assets/data/test-data.json';

console.log(data)


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page implements OnInit, AfterViewInit {
  filterTerm: string;

  ngOnInit(){}
  ngAfterViewInit(){}
  constructor() {}

  

}
