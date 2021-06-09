import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-tabla-vertical',
  templateUrl: './tabla-vertical.component.html',
  styleUrls: ['./tabla-vertical.component.css']
})
export class TablaVerticalComponent implements OnInit {

  @Input() displayedColumns: any = {};
  @Input() dataSource: any = [];
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
