import { environment } from '../../../environments/environment.js';
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
    cpf: '000.000.000-00',
    telefone: '(19) 99999-0000',
    cidade: 'Mogi Mirim',
    estado: 'SP',
    raio: 10
  };

  senhas = {
    atual: '', nova: '', confirmar: '',
    mostrarAtual: false, mostrarNova: false, mostrarConfirmar: false
  };

  enderecos: Endereco[] = [];
  enderecoForm: Endereco = this.novoEndereco();
  alertas: AlertaPreco[] = [];

  ngOnInit() {
    const u = this.authService.usuario;
    if (u) {
      this.dados.nome = u.nome;
      this.dados.email = u.email;
      this.carregarPerfil(u.token);
    }
  }

  async carregarPerfil(token: string) {
    try {
      const res = await fetch(environment.apiUrl + '/api/auth/perfil?token=' + token);
      const data = await res.json();
      if (data.nome) this.dados.nome = data.nome;
      if (data.telefone) this.dados.telefone = data.telefone;
      if (data.cidade) this.dados.cidade = data.cidade;
    } catch {}
    await Promise.all([
      this.carregarEnderecos(token),
      this.carregarAlertas(),
    ]);
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

  onImagemSelecionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
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
          telefone: this.dados.telefone, cidade: this.dados.cidade
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
    this.enderecos.forEach(end => end.principal = false);
    e.principal = true;
    await this.toast('Endereço principal atualizado!', 'success');
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
        { text: 'Excluir', role: 'destructive', handler: () => this.authService.logout() }
      ]
    });
    await alert.present();
  }

  async toast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color, position: 'top' });
    await t.present();
  }
}
