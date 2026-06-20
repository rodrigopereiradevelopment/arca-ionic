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
  private readonly VERSION_CODE = 12;
  private ultimaVerificacao = 0;

  async verificar(): Promise<{ update: VersaoInfo | null; erro: boolean }> {
    const resultado = { update: null as VersaoInfo | null, erro: false };

    if (!Capacitor.isNativePlatform()) return resultado;

    const agora = Date.now();
    if (agora - this.ultimaVerificacao < 60000) return resultado;
    this.ultimaVerificacao = agora;

    try {
      const url = `${environment.apiUrl}/api/versao`;
      console.log('[UpdateService] Checando versao em', url);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('[UpdateService] Resposta nao OK:', res.status);
        resultado.erro = true;
        return resultado;
      }
      const data: VersaoInfo = await res.json();
      console.log('[UpdateService] API:', data, '| App:', this.VERSION_CODE);

      if (data.versionCode > this.VERSION_CODE) {
        console.log('[UpdateService] Nova versao disponivel!');
        resultado.update = data;
      }
      return resultado;
    } catch (err) {
      console.warn('[UpdateService] Erro na requisicao:', err);
      resultado.erro = true;
      return resultado;
    }
  }
}
