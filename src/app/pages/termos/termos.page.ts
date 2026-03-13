import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-termos',
  templateUrl: './termos.page.html',
  styleUrls: ['./termos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel
  ]
})
export class TermosPage implements OnInit {
  dataAtualizacao = '13 de março de 2026';
  constructor() {}
  ngOnInit() {}
}