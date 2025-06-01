import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dados-academicos-view',
  templateUrl: './dados-academicos-view.component.html',
  styleUrl: './dados-academicos-view.component.scss'
})
export class DadosAcademicosViewComponent implements OnInit {
  public dadosAcademicosId: number = 0;
  constructor(private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    console.log('Dados acadêmicos view initialized');
    this.activatedRoute.params.subscribe(params => {
      this.dadosAcademicosId = +params['id'];
      console.log('ID:', this.dadosAcademicosId);
    });
  }

}
