/**
 * Banco de perguntas local (fallback).
 * Usado quando a API não está disponível.
 * O banco real vive no PostgreSQL; este arquivo é o espelho estático.
 */
export const questions = [
  // === FEMINICÍDIO (Categoria 1) ===
  {
    id: 101,
    categoria_id: 1,
    numero: "1.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      "Você ouve gritos constantes, choro e barulho de objetos quebrando na casa ao lado. O que fazer?",
    dica: "Pense no impacto da intervenção imediata para salvar uma vida.",
    alternativas: [
      {
        letra: "A",
        texto: "Ignorar o fato, achando que em briga de casal ninguém deve dar sua opinião.",
      },
      {
        letra: "B",
        texto: "Ligar para o número 190 ou 180 de imediato para garantir a proteção da mulher.",
      },
      {
        letra: "C",
        texto: "Esperar a briga acabar para tentar falar com o agressor de forma bem calma.",
      },
      {
        letra: "D",
        texto: "Não fazer absolutamente nada, esperando que a própria vítima mude de casa.",
      },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "Importante: Denunciar salva vidas. A violência doméstica não é uma questão privada, mas um crime público.",
  },
  {
    id: 102,
    categoria_id: 1,
    numero: "1.2",
    tipo_pergunta: "A Quem Ligar",
    texto:
      "Uma amiga confidencia que está sofrendo agressões psicológicas do parceiro. Qual é o canal de denúncia mais adequado?",
    dica: "Conheça os canais de proteção à mulher.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar (emergência)" },
      { letra: "B", texto: "180 - Central de Atendimento à Mulher" },
      { letra: "C", texto: "100 - Disque Direitos Humanos" },
      { letra: "D", texto: "181 - Disque Denúncia" },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "O Disque 180 oferece atendimento gratuito, sigiloso e 24h para mulheres em situação de violência.",
  },
  {
    id: 103,
    categoria_id: 1,
    numero: "1.3",
    tipo_pergunta: "Sinal Sutil",
    texto:
      'Qual destes comportamentos pode ser um sinal de abuso psicológico disfarçado de "normalidade"?',
    dica: "O abuso nem sempre deixa marcas visíveis.",
    alternativas: [
      { letra: "A", texto: 'O parceiro controla suas redes sociais e amizades "por preocupação".' },
      { letra: "B", texto: "O parceiro demonstra carinho e apoio nas decisões." },
      { letra: "C", texto: "O parceiro respeita seu espaço pessoal e tempo com amigos." },
      { letra: "D", texto: "O parceiro incentiva seus projetos pessoais." },
    ],
    resposta_correta: "A",
    feedback_acerto:
      'Controle disfarçado de "preocupação" é uma forma de violência psicológica prevista na Lei Maria da Penha.',
  },
  {
    id: 104,
    categoria_id: 1,
    numero: "1.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre a Lei Maria da Penha, qual afirmação está correta?",
    dica: "Conheça seus direitos legais.",
    alternativas: [
      { letra: "A", texto: "Só protege mulheres casadas." },
      { letra: "B", texto: "Aplica-se a qualquer mulher, independente de vínculo conjugal." },
      { letra: "C", texto: "Não inclui violência psicológica." },
      { letra: "D", texto: "Só pode ser acionada pela própria vítima." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A Lei Maria da Penha (Lei 11.340/2006) protege todas as mulheres, em qualquer relação, e inclui violência física, psicológica, sexual, patrimonial e moral.",
  },

  // === BULLYING (Categoria 2) ===
  {
    id: 201,
    categoria_id: 2,
    numero: "2.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      "Você percebe que um colega de classe está sendo alvo de comentários ofensivos e fotos editadas de forma humilhante em um grupo de WhatsApp da turma. Qual é a atitude mais eficaz e segura a se tomar?",
    dica: "Cenário: Redes Sociais",
    alternativas: [
      { letra: "A", texto: "Ignorar a situação para não se tornar o próximo alvo do grupo." },
      { letra: "B", texto: "Printar as ofensas e reportar aos pais ou coordenação da escola." },
      {
        letra: "C",
        texto: "Entrar na discussão para defender o colega usando o mesmo tom agressivo.",
      },
      {
        letra: "D",
        texto: "Compartilhar o link do grupo com pessoas de fora para aumentar a audiência.",
      },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "Importante: Denunciar agressões digitais é fundamental para a segurança de todos. Manter evidências ajuda na investigação.",
  },
  {
    id: 202,
    categoria_id: 2,
    numero: "2.2",
    tipo_pergunta: "A Quem Ligar",
    texto: "Em caso de cyberbullying grave, qual é o canal de denúncia mais adequado?",
    dica: "Conheça os canais de proteção.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar (emergência)" },
      { letra: "B", texto: "100 - Disque Direitos Humanos" },
      { letra: "C", texto: "Dial 180 - Central de Atendimento à Mulher" },
      { letra: "D", texto: "SaferNet Brasil (denúncia online)" },
    ],
    resposta_correta: "D",
    feedback_acerto:
      "A SaferNet Brasil é a principal ONG de denúncia de crimes na internet no país, com canal online 24h.",
  },
  {
    id: 203,
    categoria_id: 2,
    numero: "2.3",
    tipo_pergunta: "Sinal Sutil",
    texto: 'Qual destes comportamentos pode ser um sinal de bullying disfarçado de "brincadeira"?',
    dica: "O bullying nem sempre é óbvio.",
    alternativas: [
      { letra: "A", texto: "Exclusão sistemática de um colega de atividades em grupo." },
      { letra: "B", texto: "Brincadeiras que todos participam e se divertem." },
      { letra: "C", texto: "Discussões saudáveis sobre diferenças de opinião." },
      { letra: "D", texto: "Competições amistosas entre colegas." },
    ],
    resposta_correta: "A",
    feedback_acerto:
      'Exclusão sistemática, apelidos humilhantes e "brincadeiras" que machucam são formas de bullying que devem ser denunciadas.',
  },
  {
    id: 204,
    categoria_id: 2,
    numero: "2.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre bullying no Brasil, qual é a verdade?",
    dica: "Conheça a legislação.",
    alternativas: [
      { letra: "A", texto: "Bullying não é crime no Brasil." },
      {
        letra: "B",
        texto: "Bullying pode ser enquadrado em crimes como injúria, difamação e ameaça.",
      },
      { letra: "C", texto: "Apenas agressões físicas são puníveis." },
      { letra: "D", texto: "Escolas não têm obrigação de intervir." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      'Embora não haja lei específica para "bullying", as condutas associadas podem ser enquadradas em diversos crimes do Código Penal.',
  },

  // === ABUSO SEXUAL (Categoria 3) ===
  {
    id: 301,
    categoria_id: 3,
    numero: "3.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      "Em uma situação onde alguém consome álcool excessivamente e não consegue expressar vontade, o que define consentimento?",
    dica: "Reflita sobre a autonomia e a capacidade de decisão lúcida.",
    alternativas: [
      {
        letra: "A",
        texto:
          "O consentimento é implícito se a pessoa já teve relações anteriores com o parceiro.",
      },
      {
        letra: "B",
        texto: "O silêncio ou a falta de resistência física são formas válidas de aceitação.",
      },
      {
        letra: "C",
        texto:
          'Só existe consentimento real quando há um "sim" entusiástico e lúcido, dado sem pressão.',
      },
      {
        letra: "D",
        texto:
          "O consentimento pode ser dado antecipadamente, valendo para qualquer momento futuro.",
      },
    ],
    resposta_correta: "C",
    feedback_acerto:
      'O consentimento deve ser entusiástico, livre e revogável a qualquer momento. Se não há um "sim" claro, é violência sexual.',
  },
  {
    id: 302,
    categoria_id: 3,
    numero: "3.2",
    tipo_pergunta: "A Quem Ligar",
    texto: "Em caso de violência sexual, qual é o canal de atendimento mais adequado?",
    dica: "Conheça os canais de apoio.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar (emergência)" },
      { letra: "B", texto: "180 - Central de Atendimento à Mulher" },
      { letra: "C", texto: "100 - Disque Direitos Humanos" },
      { letra: "D", texto: "Todos os anteriores" },
    ],
    resposta_correta: "D",
    feedback_acerto:
      "Todos esses canais podem orientar e encaminhar vítimas de violência sexual. O atendimento deve ser humanizado e sigiloso.",
  },
  {
    id: 303,
    categoria_id: 3,
    numero: "3.3",
    tipo_pergunta: "Sinal Sutil",
    texto: 'Qual destas situações pode indicar abuso sexual disfarçado de "brincadeira"?',
    dica: "O abuso nem sempre é óbvio.",
    alternativas: [
      { letra: "A", texto: 'Toques "acidentais" repetidos em áreas íntimas.' },
      { letra: "B", texto: "Abraços de despedida entre amigos." },
      { letra: "C", texto: "Aperto de mão em contexto profissional." },
      { letra: "D", texto: "Cumprimento com beijo no rosto entre conhecidos." },
    ],
    resposta_correta: "A",
    feedback_acerto:
      'Toques "acidentais" repetidos, comentários de duplo sentido e invasão de espaço pessoal são sinais de abuso que devem ser denunciados.',
  },
  {
    id: 304,
    categoria_id: 3,
    numero: "3.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre a Lei 13.010/2014 (Lei da Palmada), qual é a verdade?",
    dica: "Conheça a legislação de proteção.",
    alternativas: [
      { letra: "A", texto: "A lei proíbe apenas castigos físicos em escolas." },
      {
        letra: "B",
        texto:
          "A lei proíbe castigos corporais e tratamentos humilhantes contra crianças e adolescentes.",
      },
      { letra: "C", texto: "A lei não se aplica a pais e responsáveis." },
      { letra: "D", texto: "A lei permite palmadas leves como forma de disciplina." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A Lei 13.010/2014 proíbe castigos corporais e tratamentos humilhantes em qualquer contexto, incluindo o lar, escolas e instituições.",
  },

  // === DIREITOS HUMANOS (Categoria 4) ===
  {
    id: 401,
    categoria_id: 4,
    numero: "4.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      "Um trabalhador é contratado para uma colheita rural. Seus documentos são retidos e ele descobre que já deve passagens e alimentação.",
    dica: "Essa situação configura:",
    alternativas: [
      {
        letra: "A",
        texto: "Apenas uma negociação trabalhista comum em áreas rurais de difícil acesso.",
      },
      {
        letra: "B",
        texto: "Trabalho escravo contemporâneo por servidão por dívida e retenção de documentos.",
      },
      {
        letra: "C",
        texto:
          "Direito de retenção contratual previsto na CLT para garantir o pagamento de custos.",
      },
      {
        letra: "D",
        texto: "Uma infração administrativa leve que não fere a dignidade da pessoa humana.",
      },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A servidão por dívida e a retenção de documentos são elementos centrais que caracterizam o trabalho análogo à escravidão no Brasil.",
  },
  {
    id: 402,
    categoria_id: 4,
    numero: "4.2",
    tipo_pergunta: "A Quem Ligar",
    texto: "Qual é o canal de denúncia para trabalho escravo no Brasil?",
    dica: "Conheça os canais de denúncia.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar" },
      { letra: "B", texto: "100 - Disque Direitos Humanos" },
      { letra: "C", texto: "181 - Disque Denúncia" },
      { letra: "D", texto: "Todos os anteriores" },
    ],
    resposta_correta: "D",
    feedback_acerto:
      "Todos esses canais podem receber denúncias de trabalho escravo. A denúncia pode ser feita anonimamente.",
  },
  {
    id: 403,
    categoria_id: 4,
    numero: "4.3",
    tipo_pergunta: "Sinal Sutil",
    texto: "Qual destas condições pode indicar trabalho análogo à escravidão?",
    dica: "Fique atento aos sinais.",
    alternativas: [
      { letra: "A", texto: "Jornada de trabalho de 8 horas diárias com registro em carteira." },
      { letra: "B", texto: "Trabalhadores dormindo no local de trabalho em condições precárias." },
      { letra: "C", texto: "Recebimento de salário mínimo com todos os benefícios legais." },
      { letra: "D", texto: "Intervalo de almoço de 1 hora e folgas semanais." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "Condições degradantes, jornada exaustiva e servidão por dívida são características do trabalho escravo contemporâneo.",
  },
  {
    id: 404,
    categoria_id: 4,
    numero: "4.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre a legislação brasileira contra trabalho escravo, qual é a verdade?",
    dica: "Conheça a legislação.",
    alternativas: [
      { letra: "A", texto: "Trabalho escravo só existe no Brasil rural." },
      { letra: "B", texto: "A Lei 13.344/2016 tipifica o trabalho escravo contemporâneo." },
      { letra: "C", texto: "Apenas estrangeiros podem ser vítimas de trabalho escravo." },
      { letra: "D", texto: "Trabalho escravo não é crime no Brasil." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A Lei 13.344/2016 fortaleceu a tipificação do trabalho escravo contemporâneo, incluindo condições degradantes e jornada exaustiva.",
  },

  // === RACISMO (Categoria 5) ===
  {
    id: 501,
    categoria_id: 5,
    numero: "5.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      'Durante uma entrevista de emprego, o recrutador questiona um candidato sobre sua religião de matriz africana, sugerindo que suas práticas poderiam "conflitar" com a cultura da empresa. Esta conduta caracteriza:',
    dica: "Reflita sobre os limites legais e éticos em processos seletivos.",
    alternativas: [
      { letra: "A", texto: "Apenas uma curiosidade cultural do recrutador." },
      { letra: "B", texto: "Liberdade de expressão corporativa." },
      { letra: "C", texto: "Intolerância religiosa e possível discriminação." },
      { letra: "D", texto: "Procedimento padrão de segurança." },
    ],
    resposta_correta: "C",
    feedback_acerto:
      "Importante: Questionamentos sobre religião em entrevistas são discriminatórios e ferem a liberdade de crença garantida por lei.",
  },
  {
    id: 502,
    categoria_id: 5,
    numero: "5.2",
    tipo_pergunta: "A Quem Ligar",
    texto: "Em caso de racismo ou intolerância religiosa, qual canal de denúncia é mais adequado?",
    dica: "Conheça seus direitos.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar (emergência)" },
      { letra: "B", texto: "100 - Disque Direitos Humanos" },
      { letra: "C", texto: "180 - Central de Atendimento à Mulher" },
      { letra: "D", texto: "181 - Disque Denúncia" },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "O Disque 100 (Direitos Humanos) é o canal específico para denúncias de racismo, intolerância religiosa e outros crimes de ódio.",
  },
  {
    id: 503,
    categoria_id: 5,
    numero: "5.3",
    tipo_pergunta: "Sinal Sutil",
    texto: "Qual destas situações pode configurar racismo estrutural?",
    dica: "O racismo vai além de ofensas diretas.",
    alternativas: [
      { letra: "A", texto: "Um segurança abordar apenas pessoas negras em um shopping." },
      { letra: "B", texto: "Uma empresa contratar o candidato mais qualificado." },
      { letra: "C", texto: "Um professor tratar todos os alunos com igualdade." },
      { letra: "D", texto: "Um médico atender todos os pacientes com o mesmo cuidado." },
    ],
    resposta_correta: "A",
    feedback_acerto:
      "Racismo estrutural se manifesta em práticas institucionais que discriminam de forma velada, como a abordagem seletiva por cor.",
  },
  {
    id: 504,
    categoria_id: 5,
    numero: "5.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre a Lei 7.716/89, qual é a verdade?",
    dica: "Conheça a legislação anti-racismo.",
    alternativas: [
      { letra: "A", texto: "Racismo é crime de menor potencial ofensivo." },
      { letra: "B", texto: "Racismo é crime inafiançável e imprescritível." },
      { letra: "C", texto: "A lei só protege pessoas negras." },
      { letra: "D", texto: "Racismo só é crime quando há violência física." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A Lei 7.716/89 define crimes de preconceito de raça ou cor como inafiançáveis e imprescritíveis, com pena de reclusão de 2 a 5 anos.",
  },

  // === CAUSA ANIMAL (Categoria 6) ===
  {
    id: 601,
    categoria_id: 6,
    numero: "6.1",
    tipo_pergunta: "Situação Prática Geral",
    texto:
      "Você presencia um cão acorrentado sob sol forte, sem água e visivelmente debilitado. Qual a conduta correta?",
    dica: "Reflita sobre os canais oficiais de denúncia e proteção animal.",
    alternativas: [
      { letra: "A", texto: "Ignorar, pois o animal está em propriedade privada." },
      { letra: "B", texto: "Entrar na casa e levar o animal sem avisar ninguém." },
      {
        letra: "C",
        texto:
          "Registrar com fotos/vídeos e denunciar às autoridades competentes (Polícia ou órgãos ambientais).",
      },
      { letra: "D", texto: "Apenas oferecer comida através do portão e ir embora." },
    ],
    resposta_correta: "C",
    feedback_acerto:
      "Importante: Denunciar maus-tratos é um dever cívico amparado pela Lei 9.605/98.",
  },
  {
    id: 602,
    categoria_id: 6,
    numero: "6.2",
    tipo_pergunta: "A Quem Ligar",
    texto: "Qual é o canal de denúncia para maus-tratos a animais?",
    dica: "Conheça os canais de proteção animal.",
    alternativas: [
      { letra: "A", texto: "190 - Polícia Militar" },
      { letra: "B", texto: "181 - Disque Denúncia" },
      { letra: "C", texto: "IBAMA (denúncia ambiental)" },
      { letra: "D", texto: "Todos os anteriores" },
    ],
    resposta_correta: "D",
    feedback_acerto:
      "Todos esses canais podem receber denúncias de maus-tratos. A documentação fotográfica é fundamental para a investigação.",
  },
  {
    id: 603,
    categoria_id: 6,
    numero: "6.3",
    tipo_pergunta: "Sinal Sutil",
    texto: "Qual destas situações pode indicar negligência com animais?",
    dica: "Fique atento aos sinais.",
    alternativas: [
      { letra: "A", texto: "Animal com acesso a água limpa e abrigo adequado." },
      { letra: "B", texto: "Animal visivelmente desnutrido com feridas não tratadas." },
      { letra: "C", texto: "Animal recebendo cuidados veterinários regulares." },
      { letra: "D", texto: "Animal com espaço para exercício e socialização." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "Desnutrição, feridas não tratadas, falta de água e abrigo são sinais claros de maus-tratos e negligência.",
  },
  {
    id: 604,
    categoria_id: 6,
    numero: "6.4",
    tipo_pergunta: "Desmistificando a Lei",
    texto: "Sobre a Lei 9.605/98 (Lei de Crimes Ambientais), qual é a verdade?",
    dica: "Conheça a legislação de proteção animal.",
    alternativas: [
      { letra: "A", texto: "A lei só protege animais silvestres." },
      { letra: "B", texto: "Maus-tratos a animais domésticos podem resultar em pena de reclusão." },
      { letra: "C", texto: "Apenas veterinários podem denunciar maus-tratos." },
      { letra: "D", texto: "A lei não prevê punição para abandono de animais." },
    ],
    resposta_correta: "B",
    feedback_acerto:
      "A Lei 9.605/98 prevê pena de reclusão de 1 a 4 anos para quem pratica maus-tratos ou realiza experiências cruéis com animais.",
  },
];
