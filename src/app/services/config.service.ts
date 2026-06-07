import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ConfigAparencia {
  modoEscuro: boolean;
  altoContraste: boolean;
}

export interface ConfigAcessibilidade {
  tamanhoFonte: string;
  negrito: boolean;
  reduzirAnimacoes: boolean;
  leitorTela: boolean;
  espacamentoLinhas: string;
}

export interface ConfigApp {
  aparencia: ConfigAparencia;
  acessibilidade: ConfigAcessibilidade;
  localizacao: { automatica: boolean; raio: number };
  notificacoes: { alertasPreco: boolean; promocoes: boolean; email: boolean; push: boolean };
  preferencias: { ordenacaoPadrao: string; apenasAprovados: boolean; som: boolean; vibrar: boolean };
  privacidade: { salvarHistorico: boolean; dadosAnonimos: boolean };
}

const DEFAULT_CONFIG: ConfigApp = {
  aparencia: { modoEscuro: false, altoContraste: false },
  acessibilidade: { tamanhoFonte: 'medio', negrito: false, reduzirAnimacoes: false, leitorTela: false, espacamentoLinhas: 'normal' },
  localizacao: { automatica: true, raio: 10 },
  notificacoes: { alertasPreco: true, promocoes: true, email: false, push: true },
  preferencias: { ordenacaoPadrao: 'preco', apenasAprovados: true, som: true, vibrar: true },
  privacidade: { salvarHistorico: true, dadosAnonimos: false },
};

const STORAGE_KEY = 'arca_config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private auth = inject(AuthService);
  private _config: ConfigApp;
  private initialized = false;

  constructor() {
    this._config = this.carregar();
  }

  get config(): ConfigApp {
    return this._config;
  }

  private carregar(): ConfigApp {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULT_CONFIG };
  }

  salvar(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config));
    } catch {}
    this.aplicar();
    this.sync();
  }

  resetar(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._config = { ...DEFAULT_CONFIG };
    this.aplicar();
    this.sync();
  }

  aplicar(): void {
    const body = document.body;
    const { aparencia, acessibilidade } = this._config;

    body.classList.toggle('dark-theme', aparencia.modoEscuro);
    body.classList.toggle('alto-contraste', aparencia.altoContraste);
    body.classList.toggle('texto-negrito', acessibilidade.negrito);
    body.classList.toggle('reduzir-animacoes', acessibilidade.reduzirAnimacoes);
    body.classList.toggle('leitor-tela', acessibilidade.leitorTela);

    if (acessibilidade.leitorTela) {
      body.setAttribute('aria-live', 'polite');
    } else {
      body.removeAttribute('aria-live');
    }

    const tamanhos: Record<string, string> = {
      pequeno: '13px', medio: '16px', grande: '20px', extra: '24px',
    };
    document.documentElement.style.setProperty(
      '--font-size-base', tamanhos[acessibilidade.tamanhoFonte] || '16px'
    );
    document.documentElement.style.setProperty(
      '--font-weight-base', acessibilidade.negrito ? '700' : '400'
    );
    document.documentElement.style.setProperty(
      '--line-height-base', acessibilidade.espacamentoLinhas === 'amplo' ? '2' : '1.5'
    );
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.aplicar();
    if (this.auth.logado) this.carregarDoServidor();
  }

  async carregarDoServidor(): Promise<void> {
    if (!this.auth.logado) return;
    try {
      const res = await fetch(`${environment.apiUrl}/api/configuracoes`, {
        headers: { Authorization: `Bearer ${this.auth.usuario?.token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.user_id) return;

      if (typeof data.modo_escuro === 'boolean') {
        this._config.aparencia.modoEscuro = data.modo_escuro;
      }
      if (typeof data.notificacao_promocoes === 'boolean')
        this._config.notificacoes.promocoes = data.notificacao_promocoes;
      if (typeof data.notificacoes_email === 'boolean')
        this._config.notificacoes.email = data.notificacoes_email;
      if (typeof data.notificacoes_push === 'boolean')
        this._config.notificacoes.push = data.notificacoes_push;
      if (data.raio_busca_km != null) this._config.localizacao.raio = Number(data.raio_busca_km);
      if (data.ordenacao_padrao) this._config.preferencias.ordenacaoPadrao = data.ordenacao_padrao;
      if (typeof data.exibir_apenas_promocoes === 'boolean')
        this._config.preferencias.apenasAprovados = data.exibir_apenas_promocoes;

      this.salvar();
    } catch {
      /* offline — só localStorage */
    }
  }

  private async sync(): Promise<void> {
    if (!this.auth.logado) return;
    try {
      await fetch(`${environment.apiUrl}/api/configuracoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.auth.usuario?.token,
          modo_escuro: this._config.aparencia.modoEscuro,
          notificacao_promocoes: this._config.notificacoes.promocoes,
          notificacoes_email: this._config.notificacoes.email,
          notificacoes_push: this._config.notificacoes.push,
          raio_busca_km: this._config.localizacao.raio,
          ordenacao_padrao: this._config.preferencias.ordenacaoPadrao,
          exibir_apenas_promocoes: this._config.preferencias.apenasAprovados,
        }),
      });
    } catch {
      /* offline */
    }
  }
}
