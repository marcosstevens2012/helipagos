import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-vertical-multiple',
  templateUrl: './tabla-vertical-multiple.component.html',
  styleUrls: ['./tabla-vertical-multiple.component.css']
})
export class TablaVerticalMultipleComponent implements OnInit {
  
  @Input() displayedColumns: any = {};
  @Input() dataSource: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
