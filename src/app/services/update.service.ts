import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';

export interface VersaoInfo {
  versao: string;
  versionCode: number;
  url: string;
  obrigatorio: boolean;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly VERSION_CODE = 9;
  private ultimaVerificacao = 0;

  async verificar(): Promise<VersaoInfo | null> {
    if (!Capacitor.isNativePlatform()) return null;

    const agora = Date.now();
    if (agora - this.ultimaVerificacao < 60000) return null;
    this.ultimaVerificacao = agora;

    try {
      const res = await fetch(`${environment.apiUrl}/api/versao`);
      if (!res.ok) return null;
      const data: VersaoInfo = await res.json();

      if (data.versionCode > this.VERSION_CODE) {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  }
}
