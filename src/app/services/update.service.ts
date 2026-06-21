import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
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
  private readonly VERSION_CODE = 16;
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
      const res = await CapacitorHttp.get({ url });
      if (res.status < 200 || res.status >= 300) {
        console.warn('[UpdateService] Resposta nao OK:', res.status);
        resultado.erro = true;
        return resultado;
      }
      const data: VersaoInfo = res.data as any;
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

  async baixarEInstalar(url: string): Promise<{ ok: boolean; erro?: string }> {
    try {
      console.log('[UpdateService] Abrindo URL de download:', url);
      await Browser.open({ url });
      return { ok: true };
    } catch (err) {
      console.error('[UpdateService] Erro ao abrir download:', err);
      return { ok: false, erro: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }
}
