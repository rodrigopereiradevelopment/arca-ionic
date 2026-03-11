import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Importação do Swiper
import { register } from 'swiper/element/bundle';

import { addIcons } from 'ionicons';
import { 
  ticketOutline, 
  homeOutline, 
  cartOutline, 
  notificationsOutline, 
  personOutline 
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// 1. Chame o registro do Swiper aqui (apenas uma vez)
register();

// 2. Registra os ícones
addIcons({ 
  'ticket-outline': ticketOutline,
  'home-outline': homeOutline,
  'cart-outline': cartOutline,
  'notifications-outline': notificationsOutline,
  'person-outline': personOutline 
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});