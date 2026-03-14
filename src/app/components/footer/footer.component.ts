import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonFooter, ModalController } from '@ionic/angular/standalone';
import { ModalCarrinhoComponent } from '../modal-carrinho/modal-carrinho.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonFooter]
})
export class FooterComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  async abrirCarrinho() {
    const modal = await this.modalCtrl.create({
      component: ModalCarrinhoComponent,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }
}
