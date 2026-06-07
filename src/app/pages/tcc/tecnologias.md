## 2.1. Tecnologias Utilizadas no Desenvolvimento

O desenvolvimento do aplicativo ARCA envolveu um conjunto de tecnologias modernas voltadas para a criação de aplicações móveis híbridas. A escolha dessas tecnologias foi baseada em critérios como produtividade, desempenho, compatibilidade multiplataforma e suporte da comunidade de desenvolvimento.

### 2.1.1. Linguagens de Programação

O projeto ARCA utiliza três linguagens principais que trabalham em conjunto para compor a interface e a lógica do aplicativo.

#### 2.1.1.1. HTML

O HTML (*HyperText Markup Language*) é a linguagem de marcação responsável por estruturar o conteúdo das páginas do aplicativo. No contexto do ARCA, o HTML é utilizado em conjunto com os componentes do framework Ionic, como `ion-header`, `ion-content`, `ion-footer` e `ion-searchbar`, que estendem as capacidades nativas do HTML para elementos específicos de aplicativos móveis. Cada página do aplicativo possui seu próprio arquivo HTML, onde a estrutura visual é definida de forma declarativa.

#### 2.1.1.2. CSS / SCSS

O CSS (*Cascading Style Sheets*) é a linguagem responsável pela aparência visual do aplicativo. O ARCA utiliza o SCSS (*Sassy CSS*), uma extensão do CSS que permite o uso de variáveis, aninhamento de seletores e outros recursos avançados. A identidade visual do aplicativo é construída a partir de uma paleta de cores própria, com destaque para o verde-teal (`#00BF9F`), cor principal da marca ARCA. Os estilos são organizados por componente, com cada página possuindo seu próprio arquivo `.scss`, além de um arquivo global (`global.scss`) que define estilos compartilhados entre todas as telas. Todos os tamanhos de fonte utilizam a unidade `rem`, que escala proporcionalmente conforme a configuração de acessibilidade escolhida pelo usuário.

#### 2.1.1.3. TypeScript

O TypeScript é uma linguagem de programação desenvolvida pela Microsoft que adiciona tipagem estática ao JavaScript. No ARCA, o TypeScript é utilizado em todos os arquivos de lógica do projeto (`.ts`), incluindo componentes, serviços e páginas. A tipagem estática auxilia na prevenção de erros em tempo de desenvolvimento, tornando o código mais seguro e fácil de manter. Funcionalidades como autenticação de usuário, gerenciamento do carrinho de compras, pesquisa de produtos, notificações, alertas de preço e tickets de suporte são implementadas em TypeScript.

### 2.1.2. Back-end e Front-end

No desenvolvimento de aplicações, é comum a divisão entre *front-end* e *back-end*. O *front-end* refere-se à parte visual e interativa da aplicação — tudo aquilo que o usuário vê e com o qual interage diretamente. O *back-end*, por sua vez, é responsável pelo processamento dos dados, regras de negócio e comunicação com o banco de dados.

O ARCA possui uma arquitetura completa dividida em duas camadas. O *front-end* foi desenvolvido com o framework Ionic em conjunto com o Angular, responsável por todas as telas e interações visuais do aplicativo. O *back-end* é composto por um pipeline de coleta e tratamento de dados construído em Python, responsável pela raspagem automática de preços de produtos em supermercados, e pelo framework Next.js, que realiza a integração entre os bancos de dados e o *front-end* por meio de uma API REST.

A linguagem Python foi escolhida para o *back-end* devido à sua vasta coleção de bibliotecas voltadas para raspagem de dados (*web scraping*), como `Requests` e `BeautifulSoup`, que permitem coletar preços de produtos diretamente dos sites dos supermercados de forma automatizada. O Next.js, framework baseado em React desenvolvido pela Vercel, é utilizado como camada de integração, conectando os bancos de dados ao *front-end* e expondo os dados tratados por meio de rotas de API.

### 2.2. Banco de Dados

Um banco de dados é um sistema organizado para armazenar, gerenciar e recuperar informações de forma eficiente. Em aplicações móveis, o banco de dados é essencial para persistir informações como cadastros de usuários, histórico de compras, listas de produtos e alertas de preço.

O ARCA utiliza uma arquitetura de dois bancos de dados com responsabilidades distintas. O primeiro é o MongoDB, um banco de dados NoSQL orientado a documentos, utilizado para armazenar os dados brutos coletados pela raspagem em Python. Por ser flexível e não exigir um esquema rígido de dados, o MongoDB é ideal para receber informações brutas e não padronizadas provenientes de diferentes fontes na internet.

Após o tratamento e a padronização dos dados coletados, as informações são transferidas para o PostgreSQL hospedado no Supabase. O PostgreSQL é um banco de dados relacional robusto e de código aberto, que garante integridade e consistência dos dados tratados. O Supabase é uma plataforma *open-source* que oferece o PostgreSQL como serviço, além de recursos como autenticação de usuários, armazenamento de arquivos (bucket para imagens de perfil e logos), controle de acesso por linha (RLS — *Row Level Security*) e API em tempo real. Essa combinação garante que os dados exibidos ao usuário final no aplicativo sejam precisos, organizados e seguros.

### 2.3. Experiência do Usuário (UX)

A Experiência do Usuário, conhecida pela sigla UX (do inglês *User Experience*), é uma área do design que estuda e projeta a interação entre o usuário e o produto digital, com foco em tornar essa experiência intuitiva, agradável e eficiente.

No desenvolvimento do ARCA, os princípios de UX foram aplicados em diversas decisões de design, como: utilização de uma paleta de cores consistente; navegação simplificada por meio de um rodapé fixo com ícones intuitivos e menu lateral; tela de introdução animada com o logotipo do aplicativo; *feedback* visual em ações como adição de produtos ao carrinho e exibição de notificações; e configurações de acessibilidade que permitem ao usuário ajustar o tamanho da fonte, ativar o modo escuro, o alto contraste e reduzir animações. O objetivo foi garantir que qualquer usuário, independentemente de seu nível de familiaridade com tecnologia, consiga utilizar o aplicativo de forma simples e satisfatória.

### 2.4. Frameworks e Bibliotecas

Um *framework* é um conjunto de ferramentas, bibliotecas e convenções que facilita o desenvolvimento de software, fornecendo uma estrutura base que o desenvolvedor pode utilizar e personalizar. O uso de um *framework* reduz o tempo de desenvolvimento, promove boas práticas de programação e facilita a manutenção do código.

O ARCA foi desenvolvido utilizando o Ionic Framework em conjunto com o Angular. O Ionic é um *framework open-source* voltado para o desenvolvimento de aplicações móveis híbridas — aplicações que podem ser executadas tanto em dispositivos Android e iOS quanto em navegadores web, a partir de um único código-fonte. Ele fornece componentes de interface prontos, como barras de navegação, botões, listas e modais, que seguem os padrões visuais das plataformas móveis. O Angular, por sua vez, é um *framework* JavaScript desenvolvido pelo Google que fornece uma arquitetura organizada baseada em componentes, serviços e injeção de dependências.

Além dos *frameworks* principais, o ARCA utiliza as seguintes bibliotecas especializadas:

- **Leaflet** — biblioteca JavaScript para mapas interativos, utilizada na tela de mercados próximos para exibir a localização dos supermercados e traçar rotas até o estabelecimento selecionado.
- **Google Gemini API** — utilizada no assistente virtual integrado ao aplicativo, permitindo que o usuário tire dúvidas sobre produtos, promoções e funcionalidades por meio de um chat com inteligência artificial.
- **Nominatim (OpenStreetMap)** — serviço de geocoding que converte endereços de mercados em coordenadas geográficas automaticamente no momento do cadastro.
- **ViaCEP** — serviço gratuito de busca de endereços por CEP, integrado aos formulários de cadastro de usuário e de mercados.

O aplicativo é publicado na plataforma **Vercel**, que oferece hospedagem com deploy automático integrado ao GitHub, garantindo que as atualizações cheguem aos usuários de forma rápida e confiável.

---

## 3.1.2. Telas do Projeto

O aplicativo ARCA possui uma interface visual consistente, desenvolvida com os componentes do Ionic Framework e estilizada com a paleta de cores da marca. A seguir são apresentadas as principais telas do sistema.

**Figura 1 — Tela Inicial (Home)**
A tela inicial do ARCA apresenta um carousel de banners promocionais com informações sobre o aplicativo e ofertas atualizadas diariamente. Na parte superior, há uma barra de pesquisa para busca por categoria ou produto. O rodapé fixo com ícones de navegação permite acesso rápido às principais funcionalidades do aplicativo, como mercados, notificações e perfil do usuário.

**Figura 2 — Tela de Cadastro**
A tela de cadastro permite que novos usuários criem uma conta no ARCA. O formulário está dividido em duas seções: Dados Básicos (obrigatório), contendo campos para nome completo, e-mail, senha e confirmação de senha; e Informações Adicionais (opcional), com campos para CPF, telefone e cidade.

**Figura 3 — Menu de Navegação**
O menu lateral de navegação do ARCA organiza todas as funcionalidades do aplicativo em três níveis de acesso. Para usuários comuns, estão disponíveis as opções: Início, Pesquisar Produtos, Mercados Próximos, Comparar Preços, Meu Carrinho, Histórico, Configurações, Cadastrar Mercado e Ajuda e Suporte. Para moderadores, há acesso ao painel de Gerenciar Produtos. Para administradores, são liberadas as opções de Gerenciar Mercados, Gerenciar Usuários e Gerenciar Produtos.

**Figura 4 — Tela de Mapa e Rota até o Mercado**
A tela de mapa exibe a localização do usuário e os mercados próximos, com a rota calculada até o estabelecimento selecionado. A funcionalidade utiliza a biblioteca Leaflet para renderização do mapa interativo, exibindo a distância, o tempo estimado de deslocamento e as instruções de navegação passo a passo.

---

## 3.1.3. Arquitetura do Sistema

O aplicativo ARCA foi desenvolvido com uma arquitetura moderna dividida em camadas com responsabilidades bem definidas. Cada camada se comunica com a seguinte por meio de interfaces padronizadas, garantindo organização, escalabilidade e facilidade de manutenção. A arquitetura completa envolve cinco componentes principais: o módulo de coleta de dados em Python, o banco de dados MongoDB, o banco de dados PostgreSQL hospedado no Supabase, a camada de integração em Next.js e o front-end desenvolvido com Ionic e Angular.

### 3.1.3.1. Visão Geral da Arquitetura

O fluxo de dados do sistema ARCA percorre o seguinte caminho: o módulo Python realiza a coleta automática de preços nos sites dos supermercados e armazena os dados brutos no MongoDB. Em seguida, um processo de tratamento padroniza essas informações e as transfere para o PostgreSQL no Supabase. O Next.js consome esses dados e os disponibiliza por meio de uma API para o front-end desenvolvido em Ionic com Angular, que apresenta as informações ao usuário final de forma visual e interativa.

### 3.1.3.2. Camada 1 — Coleta de Dados (Python)

A primeira camada da arquitetura é responsável pela coleta automática de preços. Scripts desenvolvidos em Python utilizam as bibliotecas `Requests` e `BeautifulSoup` para acessar os sites dos supermercados e extrair informações como nome do produto, preço e data da coleta. Para sites que carregam conteúdo dinamicamente via JavaScript, é utilizado o `Playwright`, que simula a navegação de um usuário real. Os dados coletados são armazenados imediatamente no MongoDB sem nenhum tratamento, preservando o formato original de cada fonte.

### 3.1.3.3. Camada 2 — Armazenamento Bruto (MongoDB)

O MongoDB é um banco de dados NoSQL orientado a documentos, escolhido para armazenar os dados brutos coletados pelo Python. Por não exigir um esquema fixo de dados, o MongoDB é ideal para receber informações provenientes de diferentes supermercados, que podem ter estruturas variadas. Cada documento armazenado representa um produto coletado e contém os campos disponíveis naquela fonte específica, sem necessidade de padronização prévia. Essa flexibilidade torna o MongoDB a escolha natural para a etapa inicial do pipeline de dados do ARCA.

### 3.1.3.4. Camada 3 — Tratamento e Armazenamento Estruturado (PostgreSQL/Supabase)

Após a coleta, um processo de tratamento de dados percorre os registros armazenados no MongoDB, padroniza os nomes dos produtos, converte os preços para formato numérico e organiza as informações em um esquema relacional. Os dados tratados são então armazenados no PostgreSQL, banco de dados relacional robusto e de código aberto, hospedado na plataforma Supabase.

O Supabase é uma plataforma *open-source* que oferece o PostgreSQL como serviço, com recursos adicionais como autenticação de usuários, armazenamento de arquivos e controle de acesso por linha (RLS). A escolha do PostgreSQL para esta etapa se justifica pela necessidade de garantir integridade e consistência dos dados que serão consultados pelo front-end, além de suportar consultas complexas como comparações de preços entre diferentes supermercados.

### 3.1.3.5. Camada 4 — Integração e API (Next.js)

O Next.js é um framework baseado em React, desenvolvido pela Vercel, que permite a criação de aplicações web com renderização no servidor (SSR) e geração de páginas estáticas (SSG). No ARCA, o Next.js atua como a camada de integração entre os bancos de dados e o front-end, expondo os dados do PostgreSQL por meio de rotas de API (*API Routes*).

Essa camada é responsável por receber as requisições do aplicativo Ionic, consultar o Supabase, processar os dados e retornar as respostas em formato JSON. A separação entre a API e o front-end garante segurança — as credenciais do banco de dados ficam no servidor Next.js e nunca são expostas ao dispositivo do usuário — além de facilitar futuras integrações com outros clientes, como um site web ou outro aplicativo móvel.

### 3.1.3.6. Camada 5 — Front-end (Ionic + Angular)

O front-end do ARCA foi desenvolvido com o Ionic Framework em conjunto com o Angular, formando a camada de apresentação do sistema. É nessa camada que o usuário interage com o aplicativo, realizando buscas de produtos, comparando preços entre supermercados, gerenciando sua lista de compras e configurando alertas de preço.

O front-end consome os dados disponibilizados pela API Next.js por meio de requisições HTTP, utilizando os serviços Angular para gerenciar a comunicação e o estado da aplicação. A interface foi construída com componentes Ionic como `ion-header`, `ion-content`, `ion-searchbar` e `ion-footer`, garantindo uma experiência visual consistente e adaptada para dispositivos móveis. O aplicativo é compatível com navegadores web, dispositivos Android e iOS, sendo publicado na plataforma Vercel para acesso público.

### 3.1.3.7. Camada 6 — Usuário Final

O usuário final acessa o aplicativo ARCA por meio de um navegador web ou dispositivo móvel. Ao realizar uma busca, o front-end envia uma requisição à API Next.js, que consulta o PostgreSQL e retorna os preços atualizados dos produtos nos supermercados cadastrados. O usuário pode então comparar os preços, adicionar produtos à sua lista de compras, configurar alertas para ser notificado quando um produto atingir determinado preço e visualizar o histórico de variações.

### 3.1.3.8. Resumo do Fluxo de Dados

1. Python coleta preços nos sites dos supermercados e armazena os dados brutos no MongoDB.
2. Um script de tratamento padroniza os dados e os transfere do MongoDB para o PostgreSQL no Supabase.
3. O Next.js expõe os dados do PostgreSQL por meio de uma API REST consumida pelo front-end.
4. O Ionic com Angular apresenta os dados ao usuário de forma visual, permitindo buscas, comparações e gerenciamento da lista de compras.
5. O usuário acessa o aplicativo pelo navegador ou dispositivo móvel e interage com as funcionalidades disponíveis.

---

## Referências Bibliográficas

ANGULAR. Angular Documentation. Google, 2024. Disponível em: <https://angular.dev/overview>. Acesso em: 24 mar. 2026.

BEAUTIFUL SOUP. Beautiful Soup Documentation. Crummy, 2024. Disponível em: <https://www.crummy.com/software/BeautifulSoup/bs4/doc/>. Acesso em: 24 mar. 2026.

GOOGLE. Gemini API Documentation. Google, 2024. Disponível em: <https://ai.google.dev/docs>. Acesso em: 24 mar. 2026.

IONIC. Ionic Framework Documentation. Ionic, 2024. Disponível em: <https://ionicframework.com/docs>. Acesso em: 24 mar. 2026.

LEAFLET. Leaflet — an open-source JavaScript library for mobile-friendly interactive maps. Leaflet, 2024. Disponível em: <https://leafletjs.com>. Acesso em: 24 mar. 2026.

MICROSOFT. Playwright Documentation. Microsoft, 2024. Disponível em: <https://playwright.dev/docs/intro>. Acesso em: 24 mar. 2026.

MICROSOFT. TypeScript Documentation. Microsoft, 2024. Disponível em: <https://www.typescriptlang.org/docs/>. Acesso em: 24 mar. 2026.

MONGODB. MongoDB Documentation. MongoDB, Inc., 2024. Disponível em: <https://www.mongodb.com/docs/>. Acesso em: 24 mar. 2026.

NEXT.JS. Next.js Documentation. Vercel, 2024. Disponível em: <https://nextjs.org/docs>. Acesso em: 24 mar. 2026.

NOMINATIM. Nominatim Documentation. OpenStreetMap. Disponível em: <https://nominatim.org/release-docs/latest/>. Acesso em: 24 mar. 2026.

POSTGRESQL. PostgreSQL Documentation. The PostgreSQL Global Development Group, 2024. Disponível em: <https://www.postgresql.org/docs/>. Acesso em: 24 mar. 2026.

PYTHON SOFTWARE FOUNDATION. Python Documentation. Python Software Foundation, 2024. Disponível em: <https://docs.python.org/3/>. Acesso em: 24 mar. 2026.

SASS. Sass: Syntactically Awesome Style Sheets. Sass, 2024. Disponível em: <https://sass-lang.com/documentation/>. Acesso em: 24 mar. 2026.

SUPABASE. Supabase Documentation. Supabase, Inc., 2024. Disponível em: <https://supabase.com/docs>. Acesso em: 24 mar. 2026.

VERCEL. Next.js Documentation. Vercel, 2024. Disponível em: <https://nextjs.org/docs>. Acesso em: 24 mar. 2026.

VIACEP. ViaCEP Web Service. Disponível em: <https://viacep.com.br>. Acesso em: 24 mar. 2026.

W3SCHOOLS. CSS Tutorial. W3Schools, 2024. Disponível em: <https://www.w3schools.com/css/>. Acesso em: 24 mar. 2026.

W3SCHOOLS. HTML Tutorial. W3Schools, 2024. Disponível em: <https://www.w3schools.com/html/>. Acesso em: 24 mar. 2026.

W3SCHOOLS. JavaScript Tutorial. W3Schools, 2024. Disponível em: <https://www.w3schools.com/js/>. Acesso em: 24 mar. 2026.
