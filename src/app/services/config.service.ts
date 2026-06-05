import { Injectable } from '@angular/core';

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
  preferencias: { ordenacaoPadrao: string; apenasAprovados: boolean };
  privacidade: { salvarHistorico: boolean; dadosAnonimos: boolean };
}

const DEFAULT_CONFIG: ConfigApp = {
  aparencia: { modoEscuro: false, altoContraste: false },
  acessibilidade: { tamanhoFonte: 'medio', negrito: false, reduzirAnimacoes: false, leitorTela: false, espacamentoLinhas: 'normal' },
  localizacao: { automatica: true, raio: 10 },
  notificacoes: { alertasPreco: true, promocoes: true, email: false, push: true },
  preferencias: { ordenacaoPadrao: 'preco', apenasAprovados: true },
  privacidade: { salvarHistorico: true, dadosAnonimos: false },
};

const STORAGE_KEY = 'arca_config';

@Injectable({ providedIn: 'root' })
export class ConfigService {

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
      if (raw) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      }
    } catch {}
    return { ...DEFAULT_CONFIG };
  }

  salvar(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config));
    } catch {}
  }

  resetar(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._config = { ...DEFAULT_CONFIG };
    this.aplicar();
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
      pequeno: '13px',
      medio: '16px',
      grande: '20px',
      extra: '24px',
    };
    document.documentElement.style.setProperty(
      '--font-size-base',
      tamanhos[acessibilidade.tamanhoFonte] || '16px'
    );
    document.documentElement.style.setProperty(
      '--font-weight-base',
      acessibilidade.negrito ? '700' : '400'
    );
    document.documentElement.style.setProperty(
      '--line-height-base',
      acessibilidade.espacamentoLinhas === 'amplo' ? '2' : '1.5'
    );
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.aplicar();
  }
}
