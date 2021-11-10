import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import data from 'src/assets/data/test-data.json';



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
  // headers = ["ID", "Name", "Box", "Package"]
  // rows = data
  headers = ["ID", "Name", "Box", "Package"]
  rows = data.slice(0,99)
  
}
