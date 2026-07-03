import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { LoadingController } from '@ionic/angular/standalone';

export interface VersaoInfo {
  versao: string;
  versionCode: number;
  url: string;
  obrigatorio: boolean;
  mensagem: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private ultimaVerificacao = 0;
  private versionCode = 0;
  private loadingCtrl = inject(LoadingController);

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
    const loading = await this.loadingCtrl.create({
      message: 'Baixando atualização...',
      spinner: 'circular',
      backdropDismiss: false,
    });
    await loading.present();

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);

      const result = await Filesystem.writeFile({
        path: 'arca-update.apk',
        data: base64,
        directory: Directory.Data,
      });

      await loading.dismiss();

      await FileOpener.open({
        filePath: result.uri,
        contentType: 'application/vnd.android.package-archive',
      });

      return { ok: true };
    } catch (err) {
      await loading.dismiss();
      return { ok: false, erro: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }
}
