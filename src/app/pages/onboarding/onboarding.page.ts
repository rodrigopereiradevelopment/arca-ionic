import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

const ONBOARDING_KEY = 'onboarding_completo';
const TERMOS_KEY = 'termos_aceitos';
const TERMOS_VERSAO = '1.0';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnboardingPage {
  private router = inject(Router);

  slideAtual = 0;
  localizacaoPermitida = localStorage.getItem('localizacao_permitida') === 'true';
  cameraPermitida = localStorage.getItem('camera_permitida') === 'true';
  termosAceitos = localStorage.getItem(TERMOS_KEY) === TERMOS_VERSAO;

  get ultimoSlide() {
    return this.slideAtual >= 4;
  }

  onSlideChange(e: any) {
    this.slideAtual = e.detail?.[0]?.activeIndex ?? 0;
  }

  avancar() {
    const swiper = document.querySelector('.swiper-onboarding') as any;
    swiper?.swiper?.slideNext();
  }

  pular() {
    this.concluir();
  }

  pedirLocalizacao() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          this.localizacaoPermitida = true;
          localStorage.setItem('localizacao_permitida', 'true');
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    this.avancar();
  }

  pedirCamera() {
    this.cameraPermitida = true;
    localStorage.setItem('camera_permitida', 'true');
    this.avancar();
  }

  concluir() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    if (this.termosAceitos) {
      localStorage.setItem(TERMOS_KEY, TERMOS_VERSAO);
    }
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
