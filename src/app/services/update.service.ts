import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
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
  private readonly VERSION_CODE = 14;
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

  async baixarEInstalar(url: string): Promise<{ ok: boolean; erro?: string }> {
    try {
      console.log('[UpdateService] Baixando APK de', url);

      const response = await fetch(url);
      if (!response.ok) {
        return { ok: false, erro: `HTTP ${response.status}` };
      }

      const blob = await response.blob();
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const fileName = `arca-update-${Date.now()}.apk`;
      console.log('[UpdateService] Salvando APK como', fileName);

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
      });

      const fileUri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
      });

      console.log('[UpdateService] URI do APK:', fileUri.uri);

      await Browser.open({ url: fileUri.uri });

      return { ok: true };
    } catch (err) {
      console.error('[UpdateService] Erro no download:', err);
      return { ok: false, erro: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }
}
