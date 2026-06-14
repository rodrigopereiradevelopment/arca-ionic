# Documento Técnico — ARCA

---

## 2.1. Tecnologias Utilizadas no Desenvolvimento

O desenvolvimento do aplicativo ARCA envolveu um conjunto de tecnologias modernas voltadas para a criação de aplicações móveis híbridas. A escolha dessas tecnologias foi baseada em critérios como produtividade, desempenho, compatibilidade multiplataforma e suporte da comunidade de desenvolvimento.

### 2.1.1. Linguagens de Programação

O projeto ARCA utiliza três linguagens principais que trabalham em conjunto para compor a interface e a lógica do aplicativo.

#### 2.1.1.1. HTML

O HTML (HyperText Markup Language) é a linguagem de marcação responsável por estruturar o conteúdo das páginas do aplicativo. No contexto do ARCA, o HTML é utilizado em conjunto com os componentes do framework Ionic, como `ion-header`, `ion-content`, `ion-footer` e `ion-searchbar`, que estendem as capacidades nativas do HTML para elementos específicos de aplicativos móveis. Cada página do aplicativo possui seu próprio arquivo HTML, onde a estrutura visual é definida de forma declarativa.

#### 2.1.1.2. CSS / SCSS

O CSS (Cascading Style Sheets) é a linguagem responsável pela aparência visual do aplicativo. O ARCA utiliza o SCSS (Sassy CSS), uma extensão do CSS que permite o uso de variáveis, aninhamento de seletores e outros recursos avançados. A identidade visual do aplicativo é construída a partir de uma paleta de cores própria, com destaque para o verde-teal (#00BF9F), cor principal da marca ARCA. Os estilos são organizados por componente, com cada página possuindo seu próprio arquivo `.scss`, além de um arquivo global (`global.scss`) que define estilos compartilhados entre todas as telas. Todos os tamanhos de fonte utilizam a unidade `rem`, que escala proporcionalmente conforme a configuração de acessibilidade escolhida pelo usuário, por meio da variável CSS `--font-size-base`.

#### 2.1.1.3. TypeScript

O TypeScript é uma linguagem de programação desenvolvida pela Microsoft que adiciona tipagem estática ao JavaScript. No ARCA, o TypeScript é utilizado em todos os arquivos de lógica do projeto (`.ts`), incluindo componentes, serviços e páginas. A tipagem estática auxilia na prevenção de erros em tempo de desenvolvimento, tornando o código mais seguro e fácil de manter. Funcionalidades como autenticação de usuário, gerenciamento do carrinho de compras, pesquisa de produtos, notificações, alertas de preço e tickets de suporte são implementadas em TypeScript.

---

### 2.1.2. Back-end e Front-end

No desenvolvimento de aplicações, é comum a divisão entre front-end e back-end. O front-end refere-se à parte visual e interativa da aplicação — tudo aquilo que o usuário vê e com o qual interage diretamente. O back-end, por sua vez, é responsável pelo processamento dos dados, regras de negócio e comunicação com o banco de dados.

O ARCA possui uma arquitetura completa dividida em camadas. O front-end foi desenvolvido com o framework Ionic em conjunto com o Angular, responsável por todas as telas e interações visuais do aplicativo. O back-end é composto por dois módulos principais: um pipeline de coleta e tratamento de dados construído em Python, responsável pela raspagem automática de preços de produtos em supermercados; e o framework Next.js, que realiza a integração entre os bancos de dados e o front-end por meio de uma API REST.

A linguagem Python foi escolhida para o pipeline de coleta devido à sua vasta coleção de bibliotecas voltadas para raspagem de dados (web scraping), como Requests e BeautifulSoup. Cada supermercado monitorado utiliza uma estratégia de coleta específica: o Atacadão é acessado por meio de uma API GraphQL; o São Vicente utiliza a API Demandware (Salesforce Commerce Cloud); o PagueMenos e o GoodBom empregam parsing de HTML; e o Ponto Novo e o Imperial são acessados por meio de APIs REST proprietárias da plataforma MobileSim. O Next.js, framework baseado em React desenvolvido pela Vercel, atua como camada de integração, conectando os bancos de dados ao front-end e expondo os dados tratados por meio de rotas de API.

---

## 2.2. Banco de Dados

Um banco de dados é um sistema organizado para armazenar, gerenciar e recuperar informações de forma eficiente. Em aplicações móveis, o banco de dados é essencial para persistir informações como cadastros de usuários, histórico de compras, listas de produtos e alertas de preço.

O ARCA utiliza uma arquitetura de dois bancos de dados com responsabilidades distintas, organizados em um pipeline de dados com duas camadas: **Bronze** e **Gold**.

A camada **Bronze** corresponde ao MongoDB, banco de dados NoSQL orientado a documentos, utilizado para armazenar os dados brutos coletados pelo módulo Python. Por ser flexível e não exigir um esquema rígido, o MongoDB é ideal para receber informações não padronizadas provenientes de diferentes fontes. Cada documento armazenado representa um produto coletado e contém os dados disponíveis naquela fonte específica. Além dos dados básicos, o histórico de preços de cada produto é armazenado diretamente no mesmo documento (embedded), eliminando a necessidade de uma coleção separada e reduzindo o espaço em disco em aproximadamente 93% em relação à arquitetura anterior. Ao todo, são armazenados cerca de 57.000 produtos de 6 supermercados de Mogi Mirim/SP.

Após o tratamento e a padronização dos dados, um processo de ETL (Extração, Transformação e Carga), implementado no script `migrate_to_supabase.py`, transfere as informações para a camada **Gold**: o PostgreSQL hospedado no Supabase. O PostgreSQL é um banco de dados relacional robusto e de código aberto que garante integridade e consistência dos dados exibidos ao usuário. O Supabase oferece o PostgreSQL como serviço, com recursos adicionais como autenticação de usuários, armazenamento de arquivos (bucket para imagens de perfil e logos de mercados), controle de acesso por linha (RLS — Row Level Security) e suporte a extensões avançadas.

Entre as extensões PostgreSQL utilizadas no ARCA, destacam-se:

- **pg_trgm** — permite busca fuzzy por similaridade de texto, possibilitando que o usuário encontre produtos mesmo com erros de digitação (por exemplo, "acucar" encontra "açúcar").
- **pgvector** — permite busca semântica por vetores, utilizada para correlacionar nomes de produtos entre diferentes supermercados com um limiar de similaridade de cosseno de 0,92, garantindo que variantes do mesmo produto sejam reconhecidas como equivalentes.
- **PostGIS** — extensão geoespacial utilizada para armazenar e consultar as coordenadas geográficas dos supermercados cadastrados.

O banco de dados Gold é composto por 24 tabelas e conta com políticas de RLS aplicadas com o padrão `(select auth.uid())`, garantindo que cada usuário acesse apenas seus próprios dados em tabelas sensíveis como notificações, alertas de preço e histórico de atividades.

---

## 2.3. Experiência do Usuário (UX)

A Experiência do Usuário, conhecida pela sigla UX (do inglês *User Experience*), é uma área do design que estuda e projeta a interação entre o usuário e o produto digital, com foco em tornar essa experiência intuitiva, agradável e eficiente.

No desenvolvimento do ARCA, foram aplicadas técnicas de UX específicas para dispositivos móveis Android:

- **Modo imersivo**: a `MainActivity.java` oculta as barras de sistema (status e navegação) com `SYSTEM_UI_FLAG_IMMERSIVE_STICKY`, `SYSTEM_UI_FLAG_HIDE_NAVIGATION` e `SYSTEM_UI_FLAG_FULLSCREEN`. Um listener `OnSystemUiVisibilityChangeListener` reaplica a ocultação sempre que o usuário desliza para revelar as barras, e o `onResume()` garante que o modo imersivo seja restaurado após o aplicativo voltar de segundo plano.
- **Safe-area para notch e botões de navegação**: o header `.topo` recebe `padding-top: var(--ion-safe-area-top) !important` para respeitar o notch, e o footer usa `bottom: env(safe-area-inset-bottom)` para flutuar acima dos botões de navegação do Android. O menu lateral também aplica `padding-bottom: max(env(safe-area-inset-bottom), 10px)` no `.menu-footer` para que o botão "Sair" não fique encoberto.
- **Atualização in-app**: um `UpdateService` verifica a versão atual contra `GET /api/versao` 5 segundos após a inicialização. Se houver uma versão mais recente, exibe um `AlertController` com link para download. Em caso de erro de rede, realiza até 3 tentativas com intervalo de 30 segundos, com cooldown mínimo de 60 segundos entre verificações. A verificação só ocorre em plataforma nativa (`Capacitor.isNativePlatform()`).
- **Fallback de imagens**: produtos sem foto exibem uma imagem padrão local (`assets/img/Produto1.png`) por meio de `onerror` com guard `this.onerror=null` para evitar loop infinito de requisições.

Além disso, os princípios gerais de UX foram aplicados em diversas decisões de design:

- **Onboarding interativo**: na primeira abertura do aplicativo, o usuário é guiado por 5 slides deslizáveis que apresentam as funcionalidades principais e solicitam permissões necessárias (localização e câmera) de forma contextualizada.
- **Paleta de cores consistente**: identidade visual baseada no verde-teal (#00BF9F), aplicada de forma uniforme em todas as telas.
- **Navegação simplificada**: rodapé fixo com ícones intuitivos e menu lateral organizado por nível de acesso (usuário comum, moderador e administrador).
- **Feedback visual e multissensorial**: confirmações de ações são acompanhadas de efeitos sonoros (`HTMLAudioElement`) e vibração tátil (`navigator.vibrate()`), ambos configuráveis independentemente nas preferências do usuário.
- **Representação visual dos resultados**: o ranking de mercados mais baratos é apresentado com medalhas de ouro, prata e bronze para os três melhores colocados, tornando o resultado imediatamente compreensível.
- **Configurações de acessibilidade** centralizadas, que permitem ao usuário:
  - Ajustar o tamanho da fonte em quatro níveis (13px, 16px, 20px e 24px) por meio da variável `--font-size-base`, que escala todos os elementos do app proporcionalmente, já que todos os tamanhos utilizam a unidade `rem`.
  - Ativar o modo escuro (classe `body.dark-theme`).
  - Ativar o alto contraste (classe `body.alto-contraste`, em conformidade com WCAG AA).
  - Ativar texto negrito global (`font-weight: 700`).
  - Reduzir animações (`transition: none`).
  - Ativar o modo de leitor de tela, com foco visível e classe `.sr-only` para elementos auxiliares.

O objetivo foi garantir que qualquer usuário, independentemente de seu nível de familiaridade com tecnologia, consiga utilizar o aplicativo de forma simples e satisfatória.

---

## 2.4. Frameworks e Bibliotecas

Um framework é um conjunto de ferramentas, bibliotecas e convenções que facilita o desenvolvimento de software, fornecendo uma estrutura base que o desenvolvedor pode utilizar e personalizar. O uso de um framework reduz o tempo de desenvolvimento, promove boas práticas de programação e facilita a manutenção do código.

O ARCA foi desenvolvido utilizando o Ionic Framework em conjunto com o Angular. O Ionic é um framework open-source voltado para o desenvolvimento de aplicações móveis híbridas — aplicações que podem ser executadas tanto em dispositivos Android e iOS quanto em navegadores web, a partir de um único código-fonte. Ele fornece componentes de interface prontos, como barras de navegação, botões, listas e modais, que seguem os padrões visuais das plataformas móveis. O Angular, por sua vez, é um framework JavaScript desenvolvido pelo Google que fornece uma arquitetura organizada baseada em componentes, serviços e injeção de dependências. No ARCA, o Angular é utilizado com **Standalone Components** (sem NgModules) e **Lazy Loading** em todas as rotas, configurações modernas que reduzem o tamanho do bundle inicial e aceleram o carregamento do aplicativo. O roteamento utiliza **HashLocationStrategy** (URLs com `#`), necessário para compatibilidade com o empacotamento via Capacitor. O estado da aplicação é gerenciado por meio de `BehaviorSubject` + `localStorage`, sem dependência de bibliotecas externas como NgRx. O ciclo de vida `ionViewWillEnter` é utilizado em vez de `ngOnInit` para evitar problemas de cache de navegação do Ionic ao retornar a uma página já instanciada.

O empacotamento do aplicativo como aplicativo nativo (APK Android) é realizado pelo **Capacitor**, da Ionic, que serve como ponte entre o código web e as APIs nativas do dispositivo. Os seguintes plugins Capacitor são utilizados:

- **@capacitor/camera** — captura de fotos da câmera e seleção da galeria para foto de perfil, com conversão para WebP via canvas (80% de compressão)
- **@capacitor/push-notifications** — registro e recebimento de notificações push via Firebase Cloud Messaging
- **@capacitor/status-bar** — controle da barra de status, configurada com estilo escuro (`Style.Dark`)
- **@capacitor/haptics** — feedback tátil leve em interações
- **@capacitor/keyboard** — gerenciamento do teclado virtual, com `overlaysWebView: true` para layout imersivo
- **@capacitor/app** — controle do ciclo de vida do aplicativo nativo

Além dos frameworks principais, o ARCA utiliza as seguintes bibliotecas e serviços especializados:

- **Leaflet** — biblioteca JavaScript para mapas interativos, utilizada na tela de mercados próximos para exibir a localização dos supermercados.
- **Leaflet Routing Machine** — extensão do Leaflet que calcula rotas entre o usuário e o supermercado selecionado, exibindo distância, tempo estimado e instruções passo a passo.
- **Swiper.js** — biblioteca de navegação por toque utilizada no onboarding interativo de 5 slides na primeira abertura do aplicativo.
- **Google Gemini API** — utilizada no assistente virtual integrado ao aplicativo, permitindo que o usuário tire dúvidas sobre produtos, promoções e funcionalidades por meio de um chat com inteligência artificial. As últimas 10 mensagens da conversa são enviadas como contexto a cada requisição.
- **Nominatim (OpenStreetMap)** — serviço de geocoding que converte endereços de mercados em coordenadas geográficas automaticamente no momento do cadastro.
- **ViaCEP** — serviço gratuito de busca de endereços por CEP, integrado aos formulários de cadastro de usuário e de mercados.
- **Firebase Cloud Messaging (FCM)** — serviço de notificações push da Google, integrado via Capacitor e `firebase-admin`, permitindo o envio de notificações em tempo real para dispositivos Android.
- **Firebase Admin SDK** (`firebase-admin`) — SDK server-side utilizado no Next.js para envio de notificações push via `sendEachForMulticast`, com auto-desativação de tokens inválidos. Configurado via variável de ambiente `FIREBASE_SERVICE_ACCOUNT_JSON` (string JSON) ou arquivo local `FIREBASE_ACCOUNT_PATH`.
- **Resend** — serviço de e-mail transacional utilizado no fluxo de recuperação de senha, responsável pelo disparo dos e-mails com link de redefinição.
- **Open Food Facts** — API pública utilizada para buscar informações nutricionais de produtos a partir do código de barras (EAN/GTIN), com resultados armazenados em cache na tabela `info_nutricional_cache` do Supabase por 7 dias para evitar requisições repetidas. Os resultados são exibidos no modal do produto com classificação Nutri-Score (A 🟢 a E 🔴).

O aplicativo é publicado na plataforma Vercel, que oferece hospedagem com deploy automático integrado ao GitHub, garantindo que as atualizações cheguem aos usuários de forma rápida e confiável.

---

## 3.1.2. Telas do Projeto

O aplicativo ARCA possui uma interface visual consistente, desenvolvida com os componentes do Ionic Framework e estilizada com a paleta de cores da marca. A seguir são apresentadas as principais telas do sistema.

**Figura 1 — Tela Inicial (Home)**
A tela inicial do ARCA apresenta um carousel de banners promocionais com informações sobre o aplicativo e ofertas atualizadas. Na parte superior, há uma barra de pesquisa para busca por categoria ou produto. O rodapé fixo com ícones de navegação permite acesso rápido às principais funcionalidades do aplicativo, como mercados, notificações e perfil do usuário.

**Figura 2 — Tela de Cadastro**
A tela de cadastro permite que novos usuários criem uma conta no ARCA. O formulário está dividido em duas seções: Dados Básicos (obrigatório), contendo campos para nome completo, e-mail, senha e confirmação de senha; e Informações Adicionais (opcional), com campos para CPF, telefone e cidade. O campo de CEP utiliza integração com o ViaCEP para preenchimento automático do endereço.

**Figura 3 — Menu de Navegação**
O menu lateral de navegação do ARCA organiza todas as funcionalidades do aplicativo em três níveis de acesso. Para usuários comuns, estão disponíveis as opções: Início, Pesquisar Produtos, Mercados Próximos, Comparar Preços, Meu Carrinho, Cupons de Desconto, Favoritos, Histórico, Configurações, Cadastrar Mercado e Ajuda e Suporte. Para moderadores, há acesso ao painel de Gerenciar Produtos e Gerenciar Denúncias. Para administradores, são liberadas as opções de Gerenciar Mercados, Gerenciar Usuários, Gerenciar Produtos e Gerenciar Denúncias.

**Figura 4 — Tela de Pesquisa de Produtos**
A tela de pesquisa utiliza busca fuzzy baseada na extensão pg_trgm do PostgreSQL, permitindo que o usuário encontre produtos mesmo com erros de digitação. Os resultados exibem nome, categoria e preços por mercado. O usuário pode adicionar produtos ao carrinho diretamente nessa tela, definindo a quantidade desejada por meio dos botões de incremento e decremento.

**Figura 5 — Lista Rápida**
A tela de Lista Rápida permite que o usuário digite os nomes dos produtos desejados em formato de texto livre, um por linha. O sistema interpreta a lista, busca cada item no banco de dados e executa a comparação de preços automaticamente, sem necessidade de pesquisar produto por produto. Essa funcionalidade é especialmente útil para usuários que já têm sua lista de compras escrita.

**Figura 6 — Comparação de Preços (Ranking)**
Após montar o carrinho ou utilizar a Lista Rápida, o usuário acessa a tela de comparação, que exibe o custo total da cesta em cada supermercado cadastrado, ordenados do mais barato ao mais caro. Os três melhores mercados recebem medalhas de ouro, prata e bronze, tornando o resultado visualmente imediato. A comparação é realizada em paralelo com `Promise.all`, consultando todos os mercados simultaneamente.

**Figura 7 — Tela de Mapa e Rota até o Mercado**
A tela de mapa exibe a localização do usuário e os mercados próximos, com a rota calculada até o estabelecimento selecionado. A funcionalidade utiliza a biblioteca Leaflet para renderização do mapa interativo, exibindo a distância, o tempo estimado de deslocamento e as instruções de navegação passo a passo.

**Figura 8 — Tela de Perfil**
A tela de perfil centraliza as informações do usuário: dados pessoais, endereços cadastrados, alertas de preço ativos e foto de perfil. O upload da foto é realizado diretamente no dispositivo, com conversão para o formato WebP via canvas antes do envio, reduzindo o tamanho do arquivo. A imagem é armazenada no bucket de avatars do Supabase Storage.

---

## 3.1.3. Arquitetura do Sistema

O aplicativo ARCA foi desenvolvido com uma arquitetura moderna dividida em camadas com responsabilidades bem definidas. Cada camada se comunica com a seguinte por meio de interfaces padronizadas, garantindo organização, escalabilidade e facilidade de manutenção. A arquitetura completa envolve cinco componentes principais: o módulo de coleta de dados em Python, o banco de dados MongoDB (camada Bronze), o banco de dados PostgreSQL hospedado no Supabase (camada Gold), a camada de integração em Next.js e o front-end desenvolvido com Ionic e Angular.

### 3.1.3.1. Visão Geral da Arquitetura

O fluxo de dados do sistema ARCA percorre o seguinte caminho: o módulo Python realiza a coleta automática de preços nos supermercados e armazena os dados brutos no MongoDB (Bronze). Um processo de ETL padroniza essas informações e as transfere para o PostgreSQL no Supabase (Gold). O Next.js consome esses dados e os disponibiliza por meio de uma API REST para o front-end em Ionic com Angular, que apresenta as informações ao usuário final de forma visual e interativa.

### 3.1.3.2. Camada 1 — Coleta de Dados (Python)

A primeira camada da arquitetura é responsável pela coleta automática de preços. Scripts desenvolvidos em Python acessam os sistemas de cada supermercado por meio de estratégias distintas, adequadas à tecnologia de cada fonte:

- **Atacadão**: consulta à API GraphQL interna, percorrendo 104 subcategorias.
- **São Vicente**: consulta à API Demandware (Salesforce Commerce Cloud), com 15 categorias.
- **PagueMenos**: parsing de HTML com BeautifulSoup, 13 categorias.
- **GoodBom**: parsing de HTML com expressões regulares, 9 categorias.
- **Ponto Novo** e **Imperial**: consulta a APIs REST proprietárias da plataforma MobileSim, cujos tokens de autenticação expiram mensalmente e requerem renovação manual.

A normalização dos nomes de produtos é centralizada na classe `BaseScraper`, classe mãe herdada por todos os scrapers, garantindo padronização consistente entre as fontes. O histórico de preços é armazenado diretamente no documento do produto no MongoDB (embedded), eliminando a necessidade de uma coleção separada.

A execução é automatizada via **GitHub Actions** com agendamento para segundas e quintas-feiras à meia-noite (horário de Brasília, fuso `America/Sao_Paulo`). Utiliza **matrix strategy** com 6 jobs paralelos — um por supermercado — e **ThreadPoolExecutor** internamente em cada scraper. Essa arquitetura reduziu o tempo total do pipeline de aproximadamente 272 minutos (execução sequencial) para cerca de 71 minutos. Além da coleta, o workflow também executa o script de ETL (`migrate_to_supabase.py`) e envia notificação ao Discord em caso de falha, via webhook configurado como segredo do repositório.

### 3.1.3.3. Camada 2 — Armazenamento Bruto (MongoDB)

O MongoDB é um banco de dados NoSQL orientado a documentos, escolhido para armazenar os dados brutos coletados pelo Python. Por não exigir um esquema fixo de dados, o MongoDB é ideal para receber informações provenientes de diferentes supermercados, que podem ter estruturas variadas. Cada documento representa um produto e contém seus dados básicos, o preço atual e o histórico de preços embutido. Essa arquitetura consolidada (em vez de coleções separadas) reduziu o número de documentos de aproximadamente 424.000 para 53.000 e o espaço utilizado de cerca de 250 MB para 18 MB — uma redução de 93%.

### 3.1.3.4. Camada 3 — Tratamento e Armazenamento Estruturado (PostgreSQL/Supabase)

Após a coleta, o script `migrate_to_supabase.py` executa o processo de ETL: percorre os registros do MongoDB, padroniza os nomes dos produtos, converte os preços para formato numérico, valida os códigos de barras (EAN-8 e EAN-13) e organiza as informações no esquema relacional do PostgreSQL.

O Supabase oferece o PostgreSQL como serviço com recursos adicionais: autenticação de usuários, armazenamento de arquivos e controle de acesso por linha (RLS). As políticas de RLS aplicam o padrão `(select auth.uid())` para garantir que cada usuário acesse somente seus próprios registros nas tabelas sensíveis. As extensões **pg_trgm** (busca fuzzy), **pgvector** (busca semântica por similaridade de cosseno) e **PostGIS** (geolocalização) ampliam as capacidades de consulta do banco.

### 3.1.3.5. Camada 4 — Integração e API (Next.js)

O Next.js é um framework baseado em React, desenvolvido pela Vercel, que permite a criação de aplicações web com renderização no servidor (SSR). No ARCA, o Next.js atua como camada de integração entre os bancos de dados e o front-end, expondo os dados do PostgreSQL por meio de rotas de API (API Routes) organizadas no App Router.

Essa camada é responsável por receber as requisições do aplicativo Ionic, consultar o Supabase, processar os dados e retornar as respostas em formato JSON. A separação entre a API e o front-end garante segurança — as credenciais do banco de dados e as chaves de serviços externos (Gemini, Firebase) ficam no servidor Next.js e nunca são expostas ao dispositivo do usuário —, além de facilitar futuras integrações com outros clientes.

### 3.1.3.6. Camada 5 — Front-end (Ionic + Angular)

O front-end do ARCA foi desenvolvido com o Ionic Framework em conjunto com o Angular, formando a camada de apresentação do sistema. É nessa camada que o usuário interage com o aplicativo, realizando buscas de produtos, comparando preços entre supermercados, gerenciando sua lista de compras e configurando alertas de preço.

O front-end consome os dados disponibilizados pela API Next.js por meio de requisições HTTP gerenciadas por serviços Angular. A interface foi construída com Standalone Components e Lazy Loading em todas as rotas, garantindo carregamento eficiente. O roteamento utiliza `HashLocationStrategy` (URLs com `#`), necessário para compatibilidade com o empacotamento via Capacitor. O ciclo de vida `ionViewWillEnter` é utilizado em vez de `ngOnInit` para evitar problemas de cache de navegação do Ionic ao retornar a uma página já instanciada. O estado da aplicação é gerenciado por meio de `BehaviorSubject` + `localStorage`, sem dependência de bibliotecas externas como NgRx.

**Otimizações de performance:**

- **Parallelização com `Promise.all`**: requisições independentes são executadas em paralelo — por exemplo, em `gerenciar-produtos.page.ts` (categorias + produtos), `perfil.page.ts` (perfil + endereços + alertas) e `app.component.ts` (config + carrinho), reduzindo em 40–60% o tempo de carregamento dessas páginas.
- **Técnica "fetch one extra"**: em listagens paginadas (produtos, histórico), em vez de usar `count: "exact"` do Supabase — que causa timeout em tabelas grandes — o sistema busca `limit + 1` registros. Se vierem `limit + 1`, existe página seguinte (`temMais = true`); caso contrário, não. Isso elimina o custo do `COUNT(*)` em tabelas com milhares de registros.
- **Índices de performance**: a migration `20260614000000_indexes_performance.sql` cria índices estratégicos — `produtos (ativo, created_at DESC)` para busca de produtos ativos ordenados por data, `precos (produto_id)` para joins rápidos e `precos (supermercado_id)` para filtro por mercado.
- **Requisições com `fetch()` nativo**: em vez do `HttpClient` do Angular, todas as requisições HTTP utilizam a API `fetch()` nativa do JavaScript com suporte a `AbortController`, eliminando a dependência do módulo `HttpClientModule` e reduzindo o bundle.

O aplicativo é compatível com navegadores web, dispositivos Android e iOS, e está publicado na plataforma Vercel.

### 3.1.3.7. Camada 6 — Usuário Final

O usuário final acessa o aplicativo ARCA por meio de um navegador web ou dispositivo móvel. Ao realizar uma busca, o front-end envia uma requisição à API Next.js, que consulta o PostgreSQL e retorna os preços atualizados dos produtos nos supermercados cadastrados. O usuário pode então comparar os preços, adicionar produtos à sua lista de compras, configurar alertas para ser notificado quando um produto atingir determinado preço e visualizar o histórico de variações.

### 3.1.3.8. Resumo do Fluxo de Dados

1. Python coleta preços nos supermercados — cada fonte com sua estratégia específica — e armazena os dados brutos no MongoDB (Bronze).
2. O script de ETL (`migrate_to_supabase.py`) padroniza os dados e os transfere do MongoDB para o PostgreSQL no Supabase (Gold).
3. O Next.js expõe os dados do PostgreSQL por meio de uma API REST consumida pelo front-end.
4. O Ionic com Angular apresenta os dados ao usuário de forma visual, permitindo buscas, comparações e gerenciamento da lista de compras.
5. O usuário acessa o aplicativo pelo navegador ou dispositivo móvel e interage com as funcionalidades disponíveis.

---

## Lista de Funcionalidades Implementadas

### v1.1.1
- Correção: menu footer com padding safe-area para não ficar atrás dos botões Android
- Bump de versão (versionCode 11)

### v1.1.0
- Categoria browse no Search: navegação por categoria sem texto de busca, com paginação 15 em 15
- Parallelização com `Promise.all` em gerenciar-produtos, perfil e app.component (40–60% mais rápido)
- Perfil resiliente: `maybeSingle()` + `upsert()` no lugar de `single()` + `update()`
- Favoritos CORS: `corsOk()`/`corsErr()` em todas as respostas — resolve bloqueio WebView Android
- Fetch one extra: técnica que substitui `count: "exact"` para evitar timeout em listagens
- Índices de performance: migration com índices em `produtos`, `precos`
- Safe-area headers/footer e modo imersivo (MainActivity.java)
- In-app update notification (UpdateService + AlertController)
- Fix: `Style.Dark` enum em vez de string `'DARK'` (resolve TS2322 na Vercel)
- Fix: `import L from 'leaflet'` (default import) para mapa offline
- Fix: rota de editar produtos resolvendo `categoria` de `categoria_id`
- Remoção de splash duplicada no `styles.xml`

### v1.0.9
- Versão intermediária com correções de deployment e CORS

### v1.0.8
- Onboarding interativo com 5 slides swipeable (Swiper.js)
- Push notifications via Firebase Cloud Messaging (FCM) + Capacitor
- Plugin de câmera (Capacitor Camera) com permissões Android
- Upload de foto de perfil com conversão WebP via canvas (80%)
- Informações nutricionais com cache Supabase (7 dias) + Open Food Facts (Nutri-Score A🟢–E🔴)
- Avaliação de supermercados (4 critérios + comentário + estrelas nos cards)
- Efeitos sonoros nativos (HTMLAudioElement, pool de 5 sons)
- Vibração tátil (navigator.vibrate, 10ms ação / 30ms erro)
- Recuperação de senha via Resend (com migration `recovery_tokens`)
- Firebase Admin SDK (`firebase-admin`, `sendEachForMulticast`)
- Disparo push automático ao criar notificação no banco
- Migration `device_tokens` com RLS e trigger `updated_at`
- Correção: upload imagem (arquivo → file), esqueci senha (profiles.email), moderador (moderator → moderador)
- Correção: CORS em 11 rotas de auth, PGRST116 (maybeSingle), lifecycle (ionViewWillEnter)
- Correção: rotas duplicadas (configuracoes, ajuda, perfil), imports .js, CORS favoritos 204
- Correção: `onerror` com guard anti-loop em imagens de produto
- Ícone do app gerado a partir de `assets/img/logo.png` (adaptive icon `#00BF9F`)
- `google-services.json` removido do tracking git

### v1.0.7
- Cupons de desconto (migration `cupons_desconto` + `uso_cupons`, API, CupomService)
- Favoritos (API GET/POST/DELETE, FavoritoService, ♥ nos cards, aba no Histórico)
- Denúncias de produtos, preços e mercados (migration + RLS, API, DenunciaService, 🚩 nos cards)

### v1.0.6
- Mapa e rotas (Leaflet + Nominatim + Leaflet Routing Machine)
- Cache de comparação (hash dos produtos + TTL 30 min em localStorage)
- Sincronização de configurações com servidor (ConfigService)

### v1.0.5
- Chat com IA (Gemini com contexto das últimas 10 mensagens)
- Alertas de preço com notificação push
- Gestão de catálogo completa (CRUD de produtos, categorias, mercados)
- Tickets de suporte com conversa ao vivo
- Acessibilidade (fonte 4 níveis em `rem`, contraste WCAG AA, leitor de tela, redução de animações)
- Modo escuro (`body.dark-theme`) e alto contraste (`body.alto-contraste`)

---

## Referências Bibliográficas

ANGULAR. *Angular Documentation*. Google, 2024. Disponível em: https://angular.dev/overview. Acesso em: 24 mar. 2026.

BEAUTIFUL SOUP. *Beautiful Soup Documentation*. Crummy, 2024. Disponível em: https://www.crummy.com/software/BeautifulSoup/bs4/doc/. Acesso em: 24 mar. 2026.

CAPACITOR. *Capacitor Documentation*. Ionic, 2024. Disponível em: https://capacitorjs.com/docs. Acesso em: 24 mar. 2026.

CAPACITOR. *Capacitor Camera Plugin*. Ionic, 2024. Disponível em: https://capacitorjs.com/docs/apis/camera. Acesso em: 14 jun. 2026.

CAPACITOR. *Capacitor Push Notifications Plugin*. Ionic, 2024. Disponível em: https://capacitorjs.com/docs/apis/push-notifications. Acesso em: 14 jun. 2026.

CAPACITOR. *Capacitor Status Bar Plugin*. Ionic, 2024. Disponível em: https://capacitorjs.com/docs/apis/status-bar. Acesso em: 14 jun. 2026.

FIREBASE. *Firebase Admin SDK Documentation*. Google, 2024. Disponível em: https://firebase.google.com/docs/admin/setup. Acesso em: 14 jun. 2026.

FIREBASE. *Firebase Cloud Messaging Documentation*. Google, 2024. Disponível em: https://firebase.google.com/docs/cloud-messaging. Acesso em: 24 mar. 2026.

GITHUB. *GitHub Actions Documentation*. GitHub, 2024. Disponível em: https://docs.github.com/en/actions. Acesso em: 14 jun. 2026.

GOOGLE. *Gemini API Documentation*. Google, 2024. Disponível em: https://ai.google.dev/docs. Acesso em: 24 mar. 2026.

IONIC. *Ionic Framework Documentation*. Ionic, 2024. Disponível em: https://ionicframework.com/docs. Acesso em: 24 mar. 2026.

LEAFLET. *Leaflet — an open-source JavaScript library for mobile-friendly interactive maps*. Leaflet, 2024. Disponível em: https://leafletjs.com. Acesso em: 24 mar. 2026.

LEAFLET. *Leaflet Routing Machine*. GitHub, 2024. Disponível em: https://www.liedman.net/leaflet-routing-machine/. Acesso em: 14 jun. 2026.

MICROSOFT. *TypeScript Documentation*. Microsoft, 2024. Disponível em: https://www.typescriptlang.org/docs/. Acesso em: 24 mar. 2026.

MONGODB. *MongoDB Documentation*. MongoDB, Inc., 2024. Disponível em: https://www.mongodb.com/docs/. Acesso em: 24 mar. 2026.

NEXT.JS. *Next.js Documentation*. Vercel, 2024. Disponível em: https://nextjs.org/docs. Acesso em: 24 mar. 2026.

NOMINATIM. *Nominatim Documentation*. OpenStreetMap. Disponível em: https://nominatim.org/release-docs/latest/. Acesso em: 24 mar. 2026.

OPEN FOOD FACTS. *Open Food Facts API Documentation*. Open Food Facts, 2024. Disponível em: https://world.openfoodfacts.org/data. Acesso em: 24 mar. 2026.

PGVECTOR. *pgvector: open-source vector similarity search for Postgres*. GitHub, 2024. Disponível em: https://github.com/pgvector/pgvector. Acesso em: 24 mar. 2026.

POSTGRESQL. *PostgreSQL Documentation*. The PostgreSQL Global Development Group, 2024. Disponível em: https://www.postgresql.org/docs/. Acesso em: 24 mar. 2026.

PYTHON SOFTWARE FOUNDATION. *Python Documentation*. Python Software Foundation, 2024. Disponível em: https://docs.python.org/3/. Acesso em: 24 mar. 2026.

REQUESTS. *Requests: HTTP for Humans*. Python Software Foundation, 2024. Disponível em: https://requests.readthedocs.io. Acesso em: 14 jun. 2026.

RESEND. *Resend Documentation*. Resend, 2024. Disponível em: https://resend.com/docs. Acesso em: 24 mar. 2026.

SASS. *Sass: Syntactically Awesome Style Sheets*. Sass, 2024. Disponível em: https://sass-lang.com/documentation/. Acesso em: 24 mar. 2026.

SUPABASE. *Supabase Documentation*. Supabase, Inc., 2024. Disponível em: https://supabase.com/docs. Acesso em: 24 mar. 2026.

SWIPER. *Swiper.js Documentation*. 2024. Disponível em: https://swiperjs.com. Acesso em: 14 jun. 2026.

VERCEL. *Next.js Documentation*. Vercel, 2024. Disponível em: https://nextjs.org/docs. Acesso em: 24 mar. 2026.

VIACEP. *ViaCEP Web Service*. Disponível em: https://viacep.com.br. Acesso em: 24 mar. 2026.

W3SCHOOLS. *CSS Tutorial*. W3Schools, 2024. Disponível em: https://www.w3schools.com/css/. Acesso em: 24 mar. 2026.

W3SCHOOLS. *HTML Tutorial*. W3Schools, 2024. Disponível em: https://www.w3schools.com/html/. Acesso em: 24 mar. 2026.

W3SCHOOLS. *JavaScript Tutorial*. W3Schools, 2024. Disponível em: https://www.w3schools.com/js/. Acesso em: 24 mar. 2026.