import { environment } from '../../../environments/environment';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonSpinner, ToastController, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { HistoricoService } from '../../services/historico.service';
import { ConfigService } from '../../services/config.service';

interface Endereco {
  id: number;
  apelido: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}

interface AlertaPreco {
  id: number;
  produto: string;
  produto_id: number;
  precoDesejado: number;
  ativo: boolean;
  imagem: string;
  supermercado_id?: number;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonSpinner]
})
export class PerfilPage {
  configService = inject(ConfigService);
  authService = inject(AuthService);
  carrinhoService = inject(CarrinhoService);
  historicoService = inject(HistoricoService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  abaAtiva: 'dados' | 'enderecos' | 'alertas' | 'seguranca' = 'dados';
  editandoDados = false;
  modalEnderecoAberto = false;
  editandoEndereco = false;
  imagemPreview: string | null = null;
  buscandoCep = false;
  loadingAlertas = true;

  dados = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    cidade: '',
    estado: '',
    raio: 10
  };

  senhas = {
    atual: '', nova: '', confirmar: '',
    mostrarAtual: false, mostrarNova: false, mostrarConfirmar: false
  };

  enderecos: Endereco[] = [];
  enderecoForm: Endereco = this.novoEndereco();
  alertas: AlertaPreco[] = [];

  ionViewWillEnter() {
    const u = this.authService.usuario;
    if (u) {
      this.dados.nome = u.nome;
      this.dados.email = u.email;
      this.carregarPerfil(u.token);
    }
  }

  async carregarPerfil(token: string) {
    try {
      const [perfilRes] = await Promise.all([
        fetch(environment.apiUrl + '/api/auth/perfil?token=' + token),
        this.carregarEnderecos(token),
        this.carregarAlertas(),
      ]);
      const data = await perfilRes.json();
      if (data.nome) this.dados.nome = data.nome;
      if (data.telefone) this.dados.telefone = data.telefone;
      if (data.cidade) this.dados.cidade = data.cidade;
      if (data.cpf) this.dados.cpf = this.formatCpf(data.cpf);
      if (data.estado) this.dados.estado = data.estado;
      if (data.raio_busca) this.dados.raio = data.raio_busca;
      if (data.foto_perfil && this.authService.usuario) {
        this.authService.usuario.foto_perfil = data.foto_perfil;
        this.imagemPreview = null;
      }
      if (data.email) this.dados.email = data.email;
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  }

  async carregarEnderecos(token: string) {
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/enderecos?token=' + token);
      this.enderecos = await res.json();
    } catch {}
  }

  async carregarAlertas() {
    this.loadingAlertas = true;
    try {
      const tk = this.authService.usuario?.token;
      if (!tk) return;
      const res = await fetch(environment.apiUrl + '/api/alertas', {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.ok) {
        const data = await res.json();
        this.alertas = (data ?? []).map((a: any) => ({
          id: a.id,
          produto: a.produto,
          produto_id: a.produto_id,
          precoDesejado: a.precoDesejado,
          ativo: a.ativo,
          imagem: a.imagem,
          supermercado_id: a.supermercado_id,
        }));
      }
    } catch {}
    this.loadingAlertas = false;
  }

  async onImagemSelecionada(event: any) {
    const file = event.target.files[0] as File;
    if (!file) return;
    this.imagemPreview = URL.createObjectURL(file);

    const webpBlob = await this.converterParaWebp(file);
    const formData = new FormData();
    formData.append('file', webpBlob, `${Date.now()}.webp`);
    formData.append('token', this.authService.usuario?.token || '');

    try {
      formData.append('folder', 'avatars');
      const res = await fetch(environment.apiUrl + '/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        this.imagemPreview = data.url;
        if (this.authService.usuario) {
          this.authService.usuario.foto_perfil = data.url;
        }
      }
    } catch {}
  }

  private converterParaWebp(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Falha ao converter'));
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async salvarDados() {
    const usuario = this.authService.usuario;
    if (!usuario?.token) {
      await this.toast('Sessão expirada. Faça login novamente.', 'danger'); return;
    }
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: usuario.token, nome: this.dados.nome,
          telefone: this.dados.telefone, cidade: this.dados.cidade,
          cpf: this.dados.cpf.replace(/\D/g, ''),
          estado: this.dados.estado, raio_busca: this.dados.raio
        })
      });
      const data = await res.json();
      if (data.erro) { await this.toast(data.erro, 'danger'); return; }
      this.editandoDados = false;
      await this.toast('Dados atualizados! ✅', 'success');
    } catch {
      await this.toast('Erro ao salvar dados.', 'danger');
    }
  }

  novoEndereco(): Endereco {
    return { id: 0, apelido: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', principal: false };
  }

  abrirNovoEndereco() {
    this.editandoEndereco = false;
    this.enderecoForm = this.novoEndereco();
    this.modalEnderecoAberto = true;
  }

  editarEndereco(e: Endereco) {
    this.editandoEndereco = true;
    this.enderecoForm = { ...e };
    this.modalEnderecoAberto = true;
  }

  async definirPrincipal(e: Endereco) {
    const tk = this.authService.usuario?.token;
    if (!tk) return;
    try {
      await Promise.all(
        this.enderecos.map(end =>
          fetch(environment.apiUrl + '/api/auth/enderecos', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tk, id: end.id, principal: end.id === e.id })
          })
        )
      );
      this.enderecos.forEach(end => end.principal = false);
      e.principal = true;
      await this.toast('Endereço principal atualizado!', 'success');
    } catch {
      await this.toast('Erro ao atualizar endereço principal.', 'danger');
    }
  }

  async excluirEndereco(e: Endereco) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Endereço',
      message: `Deseja excluir "${e.apelido}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive',
          handler: async () => {
            const token = this.authService.usuario?.token;
            if (token) {
              await fetch(environment.apiUrl + '/api/auth/enderecos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, id: e.id })
              });
              await this.carregarEnderecos(token);
            }
            await this.toast('Endereço removido!', 'warning');
          }
        }
      ]
    });
    await alert.present();
  }

  async salvarEndereco() {
    if (!this.enderecoForm.apelido || !this.enderecoForm.rua) {
      await this.toast('Preencha os campos obrigatórios!', 'warning');
      return;
    }
    const token = this.authService.usuario?.token;
    if (!token) { await this.toast('Sessão expirada.', 'danger'); return; }
    try {
      const method = this.editandoEndereco ? 'PUT' : 'POST';
      const res = await fetch(environment.apiUrl + '/api/auth/enderecos', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...this.enderecoForm })
      });
      const data = await res.json();
      if (data.erro) { await this.toast(data.erro, 'danger'); return; }
      await this.carregarEnderecos(token);
      this.modalEnderecoAberto = false;
      await this.toast(this.editandoEndereco ? 'Endereço atualizado! ✅' : 'Endereço adicionado! ✅', 'success');
    } catch { await this.toast('Erro ao salvar endereço.', 'danger'); }
  }

  async buscarCep() {
    const cep = this.enderecoForm.cep.replace(/\D/g, '');
    if (cep.length !== 8) { await this.toast('CEP inválido!', 'warning'); return; }
    this.buscandoCep = true;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) { await this.toast('CEP não encontrado!', 'warning'); }
      else {
        this.enderecoForm.rua = data.logradouro;
        this.enderecoForm.bairro = data.bairro;
        this.enderecoForm.cidade = data.localidade;
        this.enderecoForm.estado = data.uf;
      }
    } catch { await this.toast('Erro ao buscar CEP!', 'danger'); }
    this.buscandoCep = false;
  }

  async toggleAlerta(a: AlertaPreco) {
    try {
      const tk = this.authService.usuario?.token;
      if (!tk) return;
      const res = await fetch(environment.apiUrl + '/api/alertas', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tk, id: a.id, ativo: !a.ativo })
      });
      if (res.ok) {
        a.ativo = !a.ativo;
        await this.toast(a.ativo ? '🔔 Alerta ativado!' : '🔕 Alerta pausado!', a.ativo ? 'success' : 'warning');
      }
    } catch {}
  }

  async excluirAlerta(a: AlertaPreco) {
    try {
      const tk = this.authService.usuario?.token;
      if (!tk) return;
      const res = await fetch(environment.apiUrl + '/api/alertas', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tk, id: a.id })
      });
      if (res.ok) {
        this.alertas = this.alertas.filter(x => x.id !== a.id);
        await this.toast('Alerta removido!', 'warning');
      }
    } catch {}
  }

  async alterarSenha() {
    if (!this.senhas.atual || !this.senhas.nova || !this.senhas.confirmar) {
      await this.toast('Preencha todos os campos!', 'warning'); return;
    }
    if (this.senhas.nova !== this.senhas.confirmar) {
      await this.toast('As senhas não coincidem!', 'danger'); return;
    }
    if (this.senhas.nova.length < 6) {
      await this.toast('Senha deve ter mínimo 6 caracteres!', 'warning'); return;
    }
    const usuario = this.authService.usuario;
    if (!usuario?.token) {
      await this.toast('Sessão expirada. Faça login novamente.', 'danger'); return;
    }
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/alterar-senha', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: usuario.token, novaSenha: this.senhas.nova })
      });
      const data = await res.json();
      if (data.erro) { await this.toast(data.erro, 'danger'); return; }
      this.senhas = { atual: '', nova: '', confirmar: '', mostrarAtual: false, mostrarNova: false, mostrarConfirmar: false };
      await this.toast('Senha alterada com sucesso! ✅', 'success');
    } catch {
      await this.toast('Erro ao alterar senha.', 'danger');
    }
  }

  async confirmarExcluirConta() {
    const alert = await this.alertCtrl.create({
      header: '⚠️ Excluir Conta',
      message: 'Esta ação é irreversível! Todos os seus dados serão removidos.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Desativar', role: 'destructive',
          handler: async () => {
            try {
              const tk = this.authService.usuario?.token;
              if (!tk) return;
              const res = await fetch(environment.apiUrl + '/api/auth/deletar-conta', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tk })
              });
              if (res.ok) await this.authService.logout();
            } catch {}
          }
        }
      ]
    });
    await alert.present();
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }

  formatCpf(cpf: string): string {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0,3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6)}`;
    return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9,11)}`;
  }

  onCpfInput() {
    this.dados.cpf = this.formatCpf(this.dados.cpf);
  }
}
