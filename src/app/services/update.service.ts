import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

export interface VersaoInfo {
  versao: string;
  versionCode: number;
  url: string;
  obrigatorio: boolean;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private ultimaVerificacao = 0;
  private versionCode = 0;

  async init() {
    if (Capacitor.isNativePlatform()) {
      try {
        const info = await App.getInfo();
        this.versionCode = parseInt(info.build, 10) || 0;
      } catch {}
    }
  }

  async verificar(): Promise<{ update: VersaoInfo | null; erro: boolean }> {
    const resultado = { update: null as VersaoInfo | null, erro: false };

    if (!Capacitor.isNativePlatform()) return resultado;

    const agora = Date.now();
    if (agora - this.ultimaVerificacao < 60000) return resultado;
    this.ultimaVerificacao = agora;

    if (this.versionCode === 0) await this.init();
    if (this.versionCode === 0) return resultado;

    try {
      const url = `${environment.apiUrl}/api/versao`;
      const res = await CapacitorHttp.get({ url });
      if (res.status < 200 || res.status >= 300) {
        resultado.erro = true;
        return resultado;
      }
      const data: VersaoInfo = res.data as any;

      if (data.versionCode > this.versionCode) {
        resultado.update = data;
      }
      return resultado;
    } catch {
      resultado.erro = true;
      return resultado;
    }
  }

  async baixarEInstalar(url: string): Promise<{ ok: boolean; erro?: string }> {
    try {
      await Browser.open({ url, presentationStyle: 'fullscreen' });
      return { ok: true };
    } catch (err) {
      return { ok: false, erro: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }
}
