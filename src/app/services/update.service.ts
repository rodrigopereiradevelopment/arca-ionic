import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Browser } from '@capacitor/browser';
import { LoadingController } from '@ionic/angular/standalone';

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
      const response = await CapacitorHttp.get({
        url,
        responseType: 'arraybuffer',
      });
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const base64 = response.data as string;

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
      await Browser.open({ url });
      return { ok: false, erro: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }
}
