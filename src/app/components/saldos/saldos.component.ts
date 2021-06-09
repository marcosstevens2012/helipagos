import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.css']
})
export class SaldosComponent implements OnInit {

  constructor() { }

  isAuthorized;

  ngOnInit(): void {
    this.isAuthorized = true;
  }

}
