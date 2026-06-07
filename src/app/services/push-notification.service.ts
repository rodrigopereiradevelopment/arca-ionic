import { Injectable, inject, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import type { PushNotificationSchema } from '@capacitor/push-notifications';

export interface PushNotificacao {
  titulo: string;
  mensagem: string;
  tipo?: string;
  dados?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private auth = inject(AuthService);
  private ngZone = inject(NgZone);

  private _token: string | null = null;
  private _registrado = false;
  private _plataforma: string | null = null;

  readonly notificacaoRecebida$ = new BehaviorSubject<PushNotificacao | null>(null);

  get token(): string | null { return this._token; }
  get registrado(): boolean { return this._registrado; }

  async registrar(): Promise<boolean> {
    if (this._registrado) return true;
    if (!Capacitor.isNativePlatform()) return false;

    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const { PushNotifications: PN } = await import('@capacitor/push-notifications');

      let permStatus = await PN.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PN.requestPermissions();
      }
      if (permStatus.receive !== 'granted') return false;

      await PN.register();

      PN.addListener('registration', (event: { value: string }) => {
        this.ngZone.run(async () => {
          this._token = event.value;
          this._plataforma = Capacitor.getPlatform();
          const ok = await this.enviarTokenBackend();
          if (ok) this._registrado = true;
        });
      });

      PN.addListener('registrationError', (event: any) => {
        console.warn('[push] registration error:', event.error);
      });

      PN.addListener('pushNotificationReceived', (notificacao: PushNotificationSchema) => {
        this.ngZone.run(() => {
          this.notificacaoRecebida$.next({
            titulo: notificacao.title ?? '',
            mensagem: notificacao.body ?? '',
            tipo: (notificacao.data?.['tipo'] as string) ?? 'sistema',
            dados: (notificacao.data as Record<string, any>) ?? {},
          });
        });
      });

      return true;
    } catch (err) {
      console.warn('[push] registro nao suportado:', err);
      return false;
    }
  }

  async desativar(): Promise<boolean> {
    if (!this._token) return false;
    try {
      const res = await fetch(`${environment.apiUrl}/api/notificacoes/registrar-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.auth.usuario?.token,
          fcm_token: this._token,
          plataforma: this._plataforma ?? Capacitor.getPlatform(),
          ativo: false,
        }),
      });
      this._registrado = false;
      return res.ok;
    } catch {
      return false;
    }
  }

  private async enviarTokenBackend(): Promise<boolean> {
    if (!this._token || !this.auth.logado) return false;
    try {
      const res = await fetch(`${environment.apiUrl}/api/notificacoes/registrar-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.auth.usuario?.token,
          fcm_token: this._token,
          plataforma: this._plataforma ?? Capacitor.getPlatform(),
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
