const svg = document.getElementById('svg');
const viewport = document.getElementById('viewport');
const info = document.getElementById('info');

let isPanning = false;
let startX, startY;
let currentTranslate = { x: 920, y: 420 };
let scale = 0.2;
let mouseMoved = false;

const oneWeek = 7 * 24 * 60 * 60 * 1000;

function shouldShowModal() {
    const lastClosed = localStorage.getItem('modalClosedAt');
    if (!lastClosed) return true;
    const lastClosedTime = parseInt(lastClosed, 10);
    const now = Date.now();
    return (now - lastClosedTime) > oneWeek;
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

document.getElementById('continueBtn').addEventListener('click', () => {
    localStorage.setItem('modalClosedAt', Date.now().toString());
    hideModal();
});

window.addEventListener('DOMContentLoaded', () => {
    if (shouldShowModal()) {
        showModal();
    }
});

const minScale = 0.1; // 0.08 e 0.02
const maxScale = 0.8;

updateTransform();

svg.addEventListener('mousedown', (e) => {
    svg.classList.add('dragging');
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
    mouseMoved = false;
});

svg.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseMoved = true;
    }

    currentTranslate.x += dx;
    currentTranslate.y += dy;

    updateTransform();

    startX = e.clientX;
    startY = e.clientY;
});

svg.addEventListener('mouseup', () => {
    isPanning = false;
    svg.classList.remove('dragging');
});

svg.addEventListener('mouseleave', () => {
    isPanning = false;
    svg.classList.remove('dragging');
});

svg.addEventListener('wheel', (e) => {
    e.preventDefault();

    const scaleFactor = 1.1;
    const delta = e.deltaY < 0 ? 1 : -1;
    const zoom = delta > 0 ? scaleFactor : 1 / scaleFactor;
    const newScale = scale * zoom;

    if (newScale < minScale || newScale > maxScale) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgP = pt.matrixTransform(viewport.getCTM().inverse());

    scale = newScale;

    currentTranslate.x = e.clientX - svgP.x * scale;
    currentTranslate.y = e.clientY - svgP.y * scale;

    updateTransform();
});

function updateTransform() {
    viewport.setAttribute('transform',
        `translate(${currentTranslate.x}, ${currentTranslate.y}) scale(${scale})`
    );
}

const mensagens = {
    pistaProjetoGemeoCinzento: [
        'Uma câmara vazia dentro do Gêmeo Cinzento. Os cabos de energia da superfície foram conectados a um invólucro protetor no centro do planeta',
        'Há oito monólitos com máscaras Nomai presas. Três dessas máscaras estão recebendo dados respectivamente do Módulo de Rastreamento de Sonda, do Profundezas do Gigante e do Recanto Lenhoso.',
        'O Projeto do Gêmeo Cinzento foi desenvolvido para usar a energia de uma supernova (desencadeada pela Estação Solar) para enviar dados da sonda do Canhão de Sonda Orbital para 22 minutos no passado.',
        'A Estação Solar não funcionou. Apesar do Projeto do Gêmeo Cinzento ser teoricamente seguro, os Nomai foram incapazes de energizá-lo.',
        'Há um núcleo de transortação avançado dentro do invólucro protetor no centro do planeta. A remoção do núcleo desativará o Projeto do Gêmeo Cinzento.'
    ],
    pistaMinasNomai: [
        'Os Nomai extraíram minérios desse lugar para construir um invólucro protetor, desenvolvido para selar fisicamente a câmara central dentro do Gêmeo Cinzento.',
        'Assim que o invólucro foi finalizado, os Nomai verificaram para garantir que não havia mais nenhuma entrada física ou rachadura.',
        'Os Nomai descobriram uma espécie de forma de vida semiaquática de quatro olhos nos canais próximos à mina.'
    ],
    pistaLocalExperimentos: [
        'Amostragens de minério das Minas Nomai, no Recanto Lenhoso, foram enviadas a esse vulcão para experimentos de durabilidade.',
        'Os Nomai estavam tentando criar um invólucro capaz de suportar (por pouco tempo) uma supernova, para revestir o Projeto do Gêmeo Cinzento.',
        'Até mesmo a menor rachadura ou abertura no invólucro protetor poderia colocar tudo a perder.'
    ],
    pistaOficinaEstatuas: [
        'As estátuas Nomai foram desenvolvidas para parear com um único usuário, gravar suas memórias e enviá-las para uma unidade de armazenamento dentro do Projeto Gêmeo Cinzento.',
        'Cada unidade de armazenamento dentro do Projeto do Gêmeo Cinzento era equipada com uma máscara (a parelha da estátua), que pôde então enviar as memórias armazenadas de volta ao usuário correspondente.',
        'As estátuas foram desenvolvidas para se ativarem somente quando o Projeto do Gêmeo Cinzento fosse bem sucedido, ou no caso de falha.'
    ],
    pistaIlhaEstatua: [
        'A ilha deve ser onde os Nomai criavam estátuas como aquela do nosso observatório.',
        'Encontrei uma estátua Nomai na praia. Se parece com a que temos no observatório.'
    ],
    pistaLaboratorioAltaEnergia: [
        'Os Nomai conseguiram reproduzir com sucesso a anomalia temporal observada a princípio na Estação do Buraco Branco (objetos transportados parecem chegar antes de partir).',
        'Os Nomai descobriram que conseguiriam aumentar o intervalo de tempo negativo entre chegada e partida, adicionando energia nos núcleos de transportação.',
        'Os Nomai queriam saber se um intervalo negativo de 22 minutos seria possível. Eles concluíram que era preciso uma nova tecnologia para produzir a energia necessária, assim como um núcleo de translocação avançado capaz de suportá-la. O Gêmeo Cinzento foi sugerido como o local para esse projeto.'
    ],
    pistaEsquemasTorre: [
        'Esquemas para cada uma das torres no equador do Gêmeo Cinzento.',
        'Cada torre leva a um planeta diferente (mas muitos Nomai perceberam rapidamente que o sol não é um planeta, na verdade).',
        'Cada torre foi desenvolvida para refletir visualmente o seu destino de translação.',
        'As torres permitiram que os Nomai viajassem rapidamente do Gêmeo Cinzento para todos os demais locais cruciais ao Projeto do Gêmeo Cinzento.'
    ],
    pistaUsinaBuracosNegros: [
        'O ponto de alinhamento de uma torre de translação não é seu receptor de translação. Na verdade, uma torre de translação sempre se alinha com o centro do seu corpo astral correspondente.',
        'O receptor de translação precisa estar localizado no corpo astral relevante (ou em órbita próxima).',
        'Os Gêmeos da Ampulheta estão tão perto um do outro que funcionam como um único corpo astral, com um ponto de alinhamento compartilhado entre eles.',
        'Todas as torres de translação estavam sendo construídas no Gêmeo Cinzento, enquanto os seis receptores de translação eram construídos em locais diferentes.',
        'Uma Nomai chamada Poke criou com sucesso um núcleo avançado de translação para o Projeto do Gêmeo Cinzento.'
    ],
    pistaDiagramaAngulo: [
        'Um diagrama que mostra o ângulo de alinhamento entre uma torre de translação e seu corpo astral correspondente.',
        'Os ângulos de alinhamento da torre de translação não são exatos. Eles só precisam estar dentro de cinco graus do centro do corpo astral.',
        'Isto resulta em janelas de translação ligeiramente maiores, que duram por volta de alguns segundos.',
        'Qualquer Nomai que pisar na plataforma de translação durante a janela de ativação será imediatamente transladado.'
    ],
    pistaEstacaoBuracoBranco: [
        'Todas as torres de translação Nomai estão sintonizadas a um corpo astral específico.',
        'Para usar uma torre, você precisa estar sobre a plataforma durante o alinhamento da torre com seu corpo astral correspondente (o alinhamento ocorre quando o corpo astral está diretamente acima de você).',
        'Os Nomai perceberam algo estranho: Os objetos transportados pareciam chegar no receptor do Valo Incerto um pouco antes de terem partido da Estação do Buraco Negro.'
    ],
    pistaTorresGemeoCinzento: [
        'Várias e enormes torres Nomai formam um círculo em volta do equador do Gêmeo Cinzento.',
        'A Estação do Buraco Branco foi usada como modelo para essas torres que foram construídas para o Projeto do Gêmeo Cinzento.'
    ],
    pistaEstacaoSolar: [
        'A Estação Solar foi desenvolvida para forçar o sol a ser uma supernova.',
        'Os Nomai dispararam a Estação Solar, mas não afetou o sol. Eles concluíram que a Estação Solar nunca conseguiria levar o sol a ser uma supernova.',
        'Após a Estação Solar falhar, os Nomai deram uma pausa para investigar o cometa recém-chegado.',
        'De acordo com um computador Nomai, nosso sol chegou ao fim de seu ciclo de vida natural.'
    ],
    pistaIlhaGabro: [
        'Gabro está descansando numa rede na praia da ilha.',
        'Gabro encontrou a estátua Nomai em outra ilha. Os olhos da estátua começaram a brilhar e Gabro viu suas memórias sendo reproduzidas diante de seus olhos.',
        'Gabro se lembra de ter morrido. Viu suas memórias sendo reproduzidas diante de seus olhos, assim como ocorreu naquela vez com a estátua.',
        'Parece que só eu e Gabro estamos conscientes de que estamos em um loop temporal.'
    ],
    pistaCanhaoSondaOrbital: [
        'Os restos quebrados de uma estação espacial Nomai orbitando o Profundezas do Gigante. Há três caminhos de acesso partindo da área de comando central.',
        'O Canhão de Sonda Orbital foi criado para encontrar a localização exata do Olho do Universo.',
        'Os Nomai forçaram o Canhão de Sonda Orbital até o seu poder máximo, para criar a melhor chance de encontrar o Olho do Universo.'
    ],
    pistaModuloControle: [
        'O Módulo de Controle (recentemente) recebeu uma solicitação do Projeto do Gêmeo Cinzento para lançar uma sonda. O canhão estava alinhado com uma trajetória de sonda selecionada aleatoriamente.',
        'A sonda foi lançada com sucesso, mas a integridade estrutural do canhão foi comprometida no processo. Danos foram detectados em vários módulos.'
    ],
    pistaModuloLancamento: [
        'O Módulo de Lançamento foi extremamente danificado, mas sua piscina de projeção ainda está intacta.',
        'Uma Nomai chamada Mallow disse que não importava se a integridade estrutural do canhão fosse comprometida já que só precisaria disparar a sonda uma única vez.',
        'Uma Nomai chamada Privet informou que eles não seriam capazes de receber os dados da sonda, se o Módulo de Rastreamento de Sonda fosse destruído.'
    ],
    pistaModuloRastreamentoSonda: [
        'O Canhão de Sonda Orbital lançou milhões de sondas.',
        'A 9.318.054ª sonda localizou uma anomalia de espaço profundo que engloba todos os critérios do Olho do universo.',
        'A estátua no Módulo de Rastreamento de Sonda grava automaticamente a trajetória de cada sonda e transmite os dados para o Projeto do Gêmeo Cinzento.',
        'Encontrei coordenadas Nomai que marcam a localização do Olho do universo.'
    ],
    pistaProfundezasOceano: [
        'O oceano é surpreendente calmo por baixo da correnteza. Algum tipo de campo elétrico reveste o núcleo do planeta.',
        'Passei por uma barreira elétrica e alcancei a floresta de corais no núcleo do planeta.'
    ],
    pistaVila: [
        'A primeira e única vila Lenhosa, assim como a principal origem das explosões desse planeta.',
        'A estátua Nomai no observatório abriu os olhos e me olhou! Vi estranhas luzes brilhantes e as minhas próprias memórias passaram diante de meus olhos.'
    ],
    pistaCavernaGravidadeZero: [
        'Uma caverna no centro do Recanto Lenhoso e utilizada pelo Outer Wilds Ventures para treinar novos astronautas.',
        'Eu consertei brilhantemente outro "satélite" para Gossan.'
    ],
    pistaAcampamentoEsker: [
        'Esker está cultivando mudas de árvores em seu acampamento. Aparentemente está se dando bem lá, mas pode estar só a tempo demais.'
    ],
    pistaRadarSinalOlho: [
        'Um dispositivo Nomai criado para determinar a origem dos sinais distantes.',
        'Os Nomai ficaram desapontados quando falharam ao detectar o sinal de algo chamado Olho do universo.'
    ],
    pistaAcampamentoRiebeck: [
        'Riebeck montou um acampamento no fundo das Encruzilhadas. Sua empolgação por estar em meio a tanta história Nomai só se compara ao medo que sente por buracos negros.',
        'De todo o Recanto Lenhoso, só Riebeck se dedicou à arqueologia. Após superar seu medo do espaço e partir para o Vale Incerto a fim de explorar o imenso tesouro que é a cultura Nomai.'
    ],
    pistaSimulacaoTornados: [
        'A maioria dos ciclones nas Profundezas do Gigante gira em sentido horário. Esses são os ciclones que Cassava geralmente usava para colocar os componentes em órbita.',
        'Mas também existe um tipo mais raro de ciclone que gira em sentido anti-horário e empurra o objeto por baixo das águas e para baixo da corrente.'
    ],
    pistaObservatorioSul: [
        'O radar novo e mais sensível que os Nomai construíram nesse observatório foi incapaz de detectar qualquer traço do sinal do Olho.',
        'De acordo com o conhecimento deles sobre a Lua Quântica, os Nomai acreditavam que o Olho estava em uma órbita distante do sol.',
        'Os Nomai decidiram interromper a busca pelo sinal do Olho e em vez disso passaram a buscá-lo visualmente, enviando uma sonda pelo espaço profundo.',
        'Preocupavem-se que a probabilidade de lançarem uma sonda na direção certa fosse absurdamente pequena.'
    ],
    pistaObservacaoLunar: [
        'Uma plataforma de observação com uma vista espetacular do sistema solar. Esker usa seu onduloscópio aqui para ficar de olho nos outros viajantes.'
    ],
    pistaIlhaAbrolho: [
        'Uma ilha com vinhas espinhentas e o que parece ser uma água-viva congelada. Parece que Feldsapto acampou aqui antes de se dirigir ao Abrolho Sombrio.'
    ],
    pistaAcampamentoFeldspato: [
        'Feldspato não morreu! Sua nave caiu e agora está acampando dentro de um enorme esqueleto de tamboril.',
        'Feldspato não acha que o radar do meu batedor está errado quando mostra que meu batedor está em dois lugares ao mesmo tempo. Sua teoria é de que o espaço não funciona do mesmo jeito dentro do Abrolho Sombrio.',
        'Feldspato não demonstra nenhum desejo de retornar à civilização. Tem aproveitado muito a paz e a quietude (relativas) de lá.'
    ],
    pistaAguavivaCongelada: [
        'Feldspato anotou suas tentativas de comer a enorme água-viva congelada. O lado de fora era borrachudo e duro, possivelmente para isolar o interior da água-viva da eletricidade.',
        'Feldspato decidiu se aventurar pela cavidade interior da água-viva para ver se o gosto era melhor por dentro.',
        'Após experimentar o interior da água-viva, Feldspato concluiu que elas só são úteis para isolar eletricidade.'
    ],
    pistaEstaleiroConstrucao: [
        'Aqui é a ilha onde os Nomai construíram o Canhão de Sonda Orbital.',
        'Por algum motivo, os Nomai colocaram o Canhão de Sonda Orbital num intervalo por tempo inderterminado. Não mandaram o canhão disparar.',
        'De acordo com um computador Nomai, uma sonda de longo alcance foi recentemente lançada do Canhão de Sonda Orbital.'
    ],
    pistaSementeAbrolhoSombrio: [
        'Uma semente do Abrolho Sombrio caiu aqui e já fincou raízes. Tektite quer usar o lançador de batedores para dar uma olhada lá dentro.',
        'Meu onduloscópio captou uma música de gaita quando mirei na semente.',
        'Eu lancei meu Batedorzinho dentro da semente. De alguma forma a semente é bem maior por dentro.'
    ],
    pistaGeleiraNorte: [
        'O polo norte do Vale Incerto é coberto de neve e gelo. Há uma ruína Nomai de formato singular na superfície.',
        'Os Nomai foram capazes de se transportar até aqui da Estação do Buraco Branco. Aqui é onde eles recriaram a tecnologia de transportação pela primeira vez.'
    ],
    pistaLuaQuantica: [
        'Fui capaz de aterrissar na superfície da Lua Quântica.',
        'Encontrei uma Nomai morta usando traje espacial no polo sul.'
    ],
    pistaExploradoraSolanum: [
        'Uma Nomai chamada Solanum pousou sua exploradora no polo sul da Lua Quântica e se preparou para finalizar sua jornada a pé.',
        'Visitantes da Lua Quântica sempre chegam ao polo sul (por razões desconhecidas pelos Nomai).'
    ],
    pistaTemploQuantico: [
        'Um templo Nomai que vaga em volta da Lua Quântica.',
        '"Você se lembrou da lei do pensamento quântico" está inscrito próximo a um mural de uma torre na ilha.',
        '"Lembre-se da lei da confusão quântica" está inscrito próximo a um mural de um fragmento quântico na caverna.',
        '"Lembre-se da lei da sexta localização" está inscrito próximo a um mural de uma torre suspensa sobre um buraco negro.'
    ],
    pistaSextaLocalizacao: [
        'Encontrei uma Nomai viva chamada Solanum no polo sul!',
        'A Lua Quântica é a lua do Olho do universo.',
        'Nesse local, a Lua Quântica se torna o próprio reflexo do Olho.',
        'O Olho talvez seja a origem de todos os fenômenos quânticos macroscópicos de nosso sistema solar.',
        'Solanum se pergunta o que aconteceria se um observador consciente entrasse no Olho.',
        'A hipótese de Solanum é de que ela não está completamente viva.'
    ],
    pistaRadarLuaQuantica: [
        'Um dispositivo Nomai criado para rastrear a localização da Lua Quântica.',
        'Segundo os Nomai, a Lua Quântica deve ser alguma forma de mecânica quântica macroscópica.',
        'A Lua Quântica vaga por cinco locais ao todo.'
    ],
    pistaTorreConhecimentoQuantico: [
        'Os Nomai construíram um templo na Lua Quântica para ajudá-los na peregrinação até a sexta localização. "Não se esqueça da regra final: Para explorar a sexta localização, o templo precisa estar no polo norte da lua".',
        'A peregrinação à Lua Quântica era uma viagem significativa para um Nomai.',
        'Após os dois grupos de Nomai isolados no Gêmeo Cálido e no Vale Incerto se reunirem, encontrar e visitar a Lua Quântica tornou-se o objetivo comum a eles.'
    ],
    pistaCanhaoGravitacional: [
        'Uma enorme estrutura cilíndrica que gera um forte campo gravitacional ascendente.',
        'Eu recuperei uma exploradora Nomai da Lua Quântica.'
    ],
    pistaFragmentoQuantico: [
        'Um estranho fragmento de pedra que vaga quando não é observado. Os Nomai determinaram que esse fragmento era o responsável pelo bosque se comportar de maneira quântica.',
        'Os Nomai acreditam que esse fragmento seja na verdade um pedaço da Lua Quântica.',
        'Esse fragmento emite o mesmo sinal que a Lua Quântica.'
    ],
    pistaTorreJulgamentosQuanticos: [
        'Essa torre guarda o conhecimento que um Nomai precisava para fazer sua primeira jornada quântica.',
        '"Analisar um objeto quântico; analisar a imagem de um objeto quântico. Resulta no mesmo."',
        'Os Nomai a chamaram de "Lei do Pensamento Quântico".',
        '"Lembre-se, os demais fragmentos quânticos também têm lições a ensinar".'
    ],
    pistaBosqueQuantico: [
        'Há um fragmento estranho de rocha nesse bosque, que se move quando não é observado. Ele emite um sinal na frequência de Flutuações Quânticas.',
        'Encontrei um poema em uma das árvores desse bosque.'
    ],
    pistaCavernasQuanticas: [
        'Encontrei um estranho fragmento de pedra que se move quando não estou observando. Ele emite um sinal na frequência de Flutuações Quânticas.'
    ],
    pistaCavernaFundoSecoLago: [
        'Um Nomai chamada Coleus estava em cima da pedra errante quando outra lanterna Nomai se apagou. Quando religaram a laterna, Coleus e a pedra haviam sumido.',
        'Para viajar com um objeto quântico, é necessário ficar sobre o objeto e deixar de observar seus arredores (significando que tem que haver uma completa escuridão). Coleus usou essa regra quântica para escapar da caverna onde ficou preso.',
        'Coleus e Melorae voltaram para analisar a rocha. Na teoria deles, quando um ser consciente entra em contato com um objeto quântico e deixa de observar os arredores, eles podem ficar presos e se moverem juntos.'
    ],
    pistaCidadeOcaso: [
        'Uma cidade Nomai construída nas paredes de uma enorme caverna subterrânea. A cidade é dividida verticalmente em quatro distritos.',
        'Os Nomai discutiram sobre construir uma Estação Solar a fim de energizar o Projeto do Gêmeo Cinzento. Muitos Nomai se opuseram à construção, pois uma falha poderia resultar na destruição do nosso sistema solar.',
        'Os Nomai viajaram para esse sistema solar atrás de um sinal mais antigo que o próprio universo. Eles chamaram a fonte desse sinal de o "Olho do universo".'
    ],
    pistaAcampamentoCherte: [
        'Cherte montou seu equipamento de astronomia no polo norte do Gêmeo Cálido.',
        'Cherte observou um estranho aumento no número de supernovas recentemente.',
        'Todas as estrelas do universo estão morrendo, inclusive nosso sol.',
        'As estrelas simplesmente estão morrendo de velhice. Aparentemente elas são mais velhas do que imaginávamos.',
        'Cherte entrou em estado catatônico ao saber da morte iminente do nosso sol.'
    ],
    pistaCidadeDependurada: [
        'Uma cidade Nomai suspensa sob a geleira norte do Vale Incerto. A cidade é dividida verticalmente em quatro distritos.',
        'Eu encontrei uma alavanca no Distrito do Degelo que eleva e rebaixa a Usina de Buracos Negros.',
        'Os Nomai discutiram sobre como obter o poderoso e altamente avançado núcleo de transportação necessário para o Projeto do Gêmeo Cinzento.',
        'Os Nomai viajaram para esse sistema solar atrás de um sinal mais antigo que o próprio universo. Eles chamaram a fonte desse sinal de o "Olho do universo".'
    ],
    pistaAntigoAssentamento: [
        'Os Nomai construíram um assentamento temporário abaixo do local da queda de sua cápsula de escape.',
        'Os Nomai trabalharam juntos para recuperar um sinal com formato de um olho, que eles encontraram quando estavam a bordo do Hospedeiro.',
        'O sinal de certa forma era mais antigo que o próprio universo. Os Nomai decidiram chamá-lo de o "Olho do Universo".',
        'Os Nomai abandonaram seu assentamento após uma crescente preocupação em relação a sua estabilidade.'
    ],
    pistaFossilTamboril: [
        'As crianças Nomai costumavam jogar um jogo aqui. Um jogador era o tamboril e usava uma venda. As demais crianças (os peixinhos) formavam uma fila contra uma parede. Quando o tamboril dizia para ir, os peixinhos andavam devagar até o outro lado.',
        'A regra da venda foi incluída porque os tamboris de verdade são cegos.',
        'Os Nomai adultos ficavam extasiados em ver as crianças incorporando a pesquisa deles nas regras do jogo.'
    ],
    pistaMuralPainel3: [
        'Um mural de três cápsulas de escape abandonado o hospedeiro Nomai.'
    ],
    pistaMuralPainel2: [
        'Uma mural do Abrolho Sombrio aprisionando o hospedeiro Nomai.'
    ],
    pistaMuralPainel1: [
        'Um mural de um hospedeiro Nomai se deparando com um sinal.'
    ],
    pistaCapsulaEscape1: [
        'Uma das três cápsulas de escape Nomai que caíram em nosso sistema solar.',
        'Todas as três cápsulas de escape foram lançadas de algo chamado Hospedeiro, que estavam bem danificado.'
    ],
    pistaCapsulaEscape2: [
        'Uma das três cápsulas de escape Nomai que caíram em nosso sistema solar.',
        'Todas as três cápsulas de escape foram lançadas de algo chamado Hospedeiro, que estavam bem danificado.'
    ],
    pistaCapsulaEscape3: [
        'Uma das três cápsulas de escape Nomai que caíram em nosso sistema solar.',
        'Todas as três cápsulas de escape foram lançadas de algo chamado Hospedeiro, que estavam bem danificado.',
        'Os sobreviventes da cápsula de escape 3 encontraram dois sinalizadores diferentes vindo do Hospedeiro, como se estivesse em dois lugares ao mesmo tempo.'
    ],
    pistaTumuloNomai: [
        'Os sobreviventes da Cápsula de Escape 3 seguiram um dos dois sinalizadores emitidos pelo Hospedeiro até uma pequena semente do Abrolho Sombrio, por onde não conseguiram mais avançar.',
        'Os Nomai mal conseguiram captar o sinalizador do Hospedeiro dentro da semente, mas a abertura era muito pequena para um único Nomai passar, muito menos uma cápsula de escape.',
        'O sinalizador do Hospedeiro estava se esvaindo e logo não existiria mais.',
        'Se eu lançar meu batedor na semente, poderei tirar fotos de uma enorme nave Nomai abandonada.'
    ],
    pistaOHospedeiro: [
        'Encontrei o Hospedeiro Nomai abandonado bem dentro do Abrolho Sombrio.',
        'O núcleo de transportação do Hospedeiro já morreu há muito tempo.',
        'Eu ativei o pilar triangular na ponte de comando do Hospedeiro que parecia algum tipo de dispositivo de entrada.',
        'Os Nomai tentaram chamar por ajuda, mas o sistema de envio de mensagens do Hospedeiro quebrou durante a queda.',
        'O Hospedeiro ainda pode captar mensagens oriundas de outros hospedeiros Nomai. Os demais clãs Nomai estão se reagrupando devido à iminente morte do universo.',
        'Encontrei a gravação do sinal original do Olho do universo que os Nomai encontraram. Os Nomai se preocuparam caso o sinal desaparecesse, então eles se transportaram antes que pudessem contar para outro clã para onde iriam.'
    ],
    pistaNucleoRompido: [
        'Encontrei as duas integrantes da tripulação, da exploradora Nomai, próximo de uma rocha quebrada, que parece ter se implodido.',
        'As Nomai rastrearam as estranhas leituras de energia até uma pedra esférica que cobria alguma forma de matéria exótica.',
        'Elas determinaram que a matéria exótica fosse letal e estava sob extrema pressão. Se a pedra se rompesse, a matéria ali contida iria se expandir rapidamente, apagando quase que completamente o sistema solar.',
        'Uma das Nomai ficou para trás para analisar a matéria alienígena enquanto a outra retornou à superfície para alertar os demais Nomai.'
    ],
    pistaExploradoraNomaiCongelada: [
        'Encontrei uma exploradora Nomai quase que completamente congelada.',
        'Os Nomai pousaram no Xereta logo após a sua chegada ao nosso sistema solar. O equipamento da exploradora captou estranhas leituras vindas de algum lugar sob a superfície.',
        'Havia três Nomai a bordo da exploradora. Uma delas ficou para trás para manter a exploradora aquecida enquanto as outras duas exploraram o Xereta.',
        'Clary, a Nomai que ficou para trás, perdeu contato com as outras duas assim que desceram abaixo da superfície do Xereta.'
    ],
    pistaCanhaoGravitacional2: [
        'Uma enorme estrutura cilíndrica que gera um forte campo gravitacional ascendente.',
        'Eu recuperei uma exploradora Nomai no Xereta.'
    ],
    pistaTorreRadio: [
        'Uma torre de rádio desenvolvida para receber fotos tiradas pelo satélite de espaço profundo. Há inúmeras fotos de todo o sistema solar penduradas nas paredes. Corneana percebeu algo estranho em uma das fotos, mas chegou à conclusão de que um problema no equipamento era a única explicação razoável.'
    ],
    pistaODesconhecido: [
        'Um gigantesco mundo anelar artificial oculto por algum tipo de campo de camuflagem. Não parece ter sido criado pelos Lenhosos ou Nomai.'
    ],
    pistaReservatorio: [
        'Um enorme reservatório com píeres de madeira e edifícios nas duas margens.',
        'Eu encontrei uma sala com uma interface de controle incendiada e uma projeção que parece indicar uma conexão partida entre o Desconhecido e outra nave.',
        'Eu encontrei uma projeção que mostra a trajetória atual do Desconhecido e o raio esperado da supernova do sol.'
    ],
    pistaRoloFilmeQueimado1: [
        'Um rolo de filme que mostra um estranho cofre sendo colocado em uma grande estrutura de metal e mergulhado na água.',
        'Quase todos os filmes foram queimados e não podem ser visualizados.'
    ],
    pistaEstruturaSubmersa: [
        'Uma grande estrutura de metal suspensa por correntes. É possível entrar nadando por debaixo dela.',
        'Há um cofre selado e iluminado por um fogo verde dentro da estrutura.'
    ],
    pistaLagoSubterraneo: [
        'Eu descobri um vasto lago subterrâneo sob a estrutura submersa. O cofre selado repousa na margem do lago. Há três interfaces, cada uma marcada com um dos três símbolos do cofre.',
        'Eu girei o mecanismo em frente ao cofre e as correntes que o fechavam foram puxadas. Em seguida, raios de luz verde saíram do cofre.'
    ],
    pistaCofreSelado: [
        'Eu encontrei um dos habitantes do Desconhecido aprisionando no cofre!',
        'O Prisioneiro me mostrou uma visão revelando as ações que praticou e que resultaram em seu confinamento eterno.',
        'Eu usei o archote de visão para compartilhar meu conhecimento sobre a história do sistema solar com o Prisioneiro.',
        'O Prisioneiro deixou uma versão final para mim perto da margem como despedida.'
    ],
    pistaDesfiladeiroOculto: [
        'Um estreito desfiladeiro ao longo da ramificação mais à direita do rio. Há habitações construídas no topo das duas paredes do penhasco.'
    ],
    pistaLaboratórioAvariado: [
        'Um laboratório com três câmaras de testes. A segunda câmara está seriamente avariada e pode ser acessada através de uma brecha na lateral do casco do Desconhecido.',
        'Eu vi uma gravação semelhante a uma visão de alguém pegando um artefato e dormindo em frente a um fogo verde. O resto da visão estava distorcido e difícil de entender, mas uma chama pareceu surgir dentro do artefato.',
        'Eu encontrei um rolo de filme que mostra três experimentos conduzidos com três artefatos diferentes. O terceiro experimento parece ter sido um sucesso.'
    ],
    pistaRoloFilmeQueimado2: [
        'Um rolo de filme que mostra os habitantes do Desconhecido reunindo-se ao redor de um estranho fogo verde.',
        'Vários filmes foram queimados e não podem ser visualizados.'
    ],
    pistaSalaIncineracaoFilmes1: [
        'Uma sala cheia de rolos de filmes queimados, empilhados ao lado de um estranho dispositivo.',
        'Eu encontrei um rolo de filme escondido que mostra um recipiente marcado com um símbolo luminoso sendo entregue para uma figura sombria. As luzes se apagam, e a figura carrega o recipiente para uma passagem secreta atrás do mural de uma grande árvore.'
    ],
    pistaPlaniciesRio: [
        'Uma região de terreno baixo próxima à entrada do Desconhecido. Há edifícios de madeira ao longo das margens do rio.',
        'Eu encontrei diversos artefatos ornados de metal dentro de uma oficina cercada de matéria fantasma.'
    ],
    pistaSalaIncineracaoFilmes2: [
        'Uma sala cheia de rolos de filmes queimados, empilhados ao lado de um estranho dispositivo.',
        'Eu encontrei um rolo de filme escondido que mostra um recipiente marcado com sum símbolo luminoso sendo entregue para uma figura sombria. A figura segue uma fila de luzes verdes pela floresta até um edifício iluminado por velas, onde carrega o recipiente para uma passagem secreta atrás de uma lareira ardente.'
    ],
    pistaRoloFilmeQueimado3: [
        'Um rolo de filme que mostra a origem do Desconhecido e seus habitantes.',
        'Vários filmes foram queimados e não podem ser visualizados.'
    ],
    pistaTemploAbandonado: [
        'Um templo abandonado marcado com o símbolo de um rolo de filme queimado. Ele pode ser acessado a partir de uma passagem no Desfiladeiro Oculto.',
        'Há uma interface no andar de cima que pode ser usada para alinhar símbolos em uma sequência vertical.',
        'Inserir a sequência correta abre o caminho para uma sala secreta sob o templo.',
        'Eu encontrei um rolo de filme que mostra os habitantes do Desconhecido removendo todos os rolos de filme das prateleiras, escaneando cada rolo com um dispositivo e incinerando tanto filmes específicos quanto rolos inteiros.'
    ],
    pistaProjecaoMapa1: [
        'Uma projeção que parece revelar uma localização secreta em algum lugar dentro do Desconhecido.'
    ],
    pistaProjecaoMapa2: [
        'Uma projeção que parece revelar uma localização secreta em algum lugar dentro do Desconhecido.'
    ],
    pistaProjecaoMapa3: [
        'Uma projeção que parece revelar uma localização secreta em algum lugar dentro do Desconhecido.'
    ],
    pistaIlhasCinerarias: [
        'Um par de pequenas ilhas rochosas conectadas por uma vila de palafitas.',
        'Eu encontrei um grande símbolo de metal do Olho do universo dentro de um edifício incendiado.'
    ],
    pistaTorreIlha: [
        'Uma torre que repousa no topo das Ilhas Cinerárias. Os andares mais altos só podem ser alcançados a partir de uma segunda entrada atrás da torre.',
        'Eu encontrei um rolo de filme que mostra os habitantes do Desconhecido abrindo uma passagem secreta em uma sala circular repleta de lanternas e murais. Os habitantes são mostrados entrando em três salas como essa ao redor do Desconhecido.'
    ],
    pistaSalaSimbolos: [
        'Uma sala secreta repleta de recipientes de madeira marcados com diferentes símbolos',
        'Três dos recipientes estão marcados com selos luminosos, mas seus conteúdo foi incendiado.',
        'Eu abri o recipiente marcado com símbolo de um rolo de filme queimando e encontrei uma sequência vertical de símbolos em seu interior.'
    ],
    pistaSalaIncineracaoFilmes3: [
        'Um sala cheia de rolos de filmes queimados, empilhados ao lado de um estranho dispositivo.',
        'Eu encontrei um rolo de filme escondido que mostra um recipiente marcado com um símbolo luminoso sendo entregue para uma figura sombria. As luzes se apagam, e a figura carrega o recipiente para dentro de um poço escuro.'
    ],
    pistaRoloFilmeQueimado4: [
        'Um rolo de filme que mostra os habitantes do Desconhecido analisando o Olho do universo.',
        'Vários filmes foram queimados e não podem ser visualizados.'
    ],
    pistaEnseadaEstrelada: [
        'Uma vila isolada situada dentro de uma enseada. Uma torre iluminada por velas repousa no topo de uma ilha próxima.',
        'O poço no fundo da vila está protegido por uma estátua que ativa um alarme ao me ver.',
        'Eu encontrei os restos de um edifício incendiado nos arredores da vila.',
        'Eu alcancei os pisos superiores da torre ao projetar um caminho até a segunda entrada na parte de trás dela.'
    ],
    pistaArquivoProibido1: [
        'Uma biblioteca repleta de rolos de filme intactos escondida muito abaixo do solo.',
        'Há um recipiente marcado com um dos selos do cofre, mas o conteúdo foi destruído.',
        'Eu encontrei um rolo de filme que mostra os habitantes do Desconhecido analisando o Olho do Universo.',
        'Filmes intactos revelam a construção e lançamento de uma espaçonave criada para bloquear o sinal do Olho.',
        'Eu encontrei um rolo de filme que revela que artefatos podem ser acesos de duas formas diferentes.',
        'Eu encontrei um rolo de filme que parece ser algum tipo de relatório de erros. Ele mostra um alarme incapaz de acordar um dos habitantes do Desconhecido.'
    ],
    pistaCanionInfinito: [
        'Um enorme cânion que se estende até onde a vista alcança. Uma cabana iluminada por velas foi construída na parede do penhasco a distância.',
        'Eu encontrei o mural de uma grande árvore no térreo da cabana.'
    ],
    pistaArquivoProibido2: [
        'Uma biblioteca repleta de rolos de filme intactos escondida muito abaixo do solo.',
        'Há um recipiente marcado com um dos selos do cofre, mas o conteúdo foi destruído.',
        'Eu encontrei um rolo de filme que mostra os habitantes do Desconhecido reunindo-se ao redor de um estranho fogo verde.',
        'Filmes intactos revelam a criação de uma realidade simulada, moldada a partir do seu mundo natal.',
        'Eu encontrei um rolo de filme que parece ser algum tipo de relatório de erros. Ele mostra um dos habitantes do Desconhecido soltando um artefato no chão e se distanciando do seu raio de projeção.'
    ],
    pistaFlorestaNebulosa: [
        'Uma densa floresta ao longo das margens de um rio.',
        'Eu posso ouvir uma música vindo de um edifício iluminado por velas do outro lado da água.',
        'Eu encontrei uma ponte coberta que leva até a parte mais escura da floresta.'
    ],
    pistaArquivoProibido3: [
        'Uma biblioteca repleta de rolos de filme intactos escondida muito abaixo do solo.',
        'Há um recipiente marcado com um dos selos do cofre, mas o conteúdo foi destruído.',
        'Eu encontrei um rolo de filme que mostra a origem do Desconhecido e seus habitantes.',
        'Filmes intactos revelam o sacrifício feito para construir o Desconhecido.',
        'Eu encontrei um rolo de filme que parece ser algum tipo de relatório de erros. Ele mostra um dos habitantes do Desconhecido pulando de uma jangada durante uma transição entre áreas e caindo embaixo do mundo.'
    ]
};

const pistasVisitadas = {};
const fiosVisitados = {};

function escreverTextoSimultaneo(elemento, textos, velocidade = 12) {
    elemento.innerHTML = '';

    const paragrafos = textos.map(() => {
        const p = document.createElement('p');
        elemento.appendChild(p);
        return p;
    });

    let indices = new Array(textos.length).fill(0);

    function digitar() {
        let algumAtivo = false;

        textos.forEach((texto, i) => {
            if (indices[i] < texto.length) {
                paragrafos[i].textContent += texto.charAt(indices[i]);
                indices[i]++;
                algumAtivo = true;
            }
        });

        if (algumAtivo) {
            setTimeout(digitar, velocidade);
        }
    }

    digitar();
}

document.querySelectorAll('.pista').forEach(pista => {
    pista.addEventListener('click', (e) => {
        if (mouseMoved) return;
        const id = pista.dataset.id;

        if (pista.classList.contains('selecionada')) {
            pista.classList.remove('selecionada');
            info.style.display = 'none';
            return;
        }

        document.querySelectorAll('.pista').forEach(p => p.classList.remove('selecionada'));
        document.querySelectorAll('.fio-interativo').forEach(f => f.classList.remove('selecionado'));
        pista.classList.add('selecionada');

        const textos = mensagens[id] || ['Pista clicada.'];

        info.innerHTML = '';
        info.style.display = 'block';

        if (pistasVisitadas[id]) {
            textos.forEach(txt => {
                const p = document.createElement('p');
                p.textContent = txt;
                info.appendChild(p);
            });
        } else {
            escreverTextoSimultaneo(info, textos);
            pistasVisitadas[id] = true;
        }
    });
});

function getPistaCenter(pista) {
    const transform = pista.getAttribute('transform');
    const match = /translate\(([^,]+),\s*([^)]+)\)/.exec(transform);
    const tx = parseFloat(match[1]);
    const ty = parseFloat(match[2]);

    const rect = pista.querySelector('rect');
    const width = parseFloat(rect.getAttribute('width'));
    const height = parseFloat(rect.getAttribute('height'));

    const centerX = tx + width / 2;
    const centerY = ty + height / 2;

    return { x: centerX, y: centerY };
}

function desenharFios(pares) {
    const fiosGrupo = document.getElementById('fios');

    pares.forEach(([id1, id2, label]) => {
        const pista1 = document.querySelector(`#${id1}`);
        const pista2 = document.querySelector(`#${id2}`);

        const p1 = getPistaCenter(pista1);
        const p2 = getPistaCenter(pista2);

        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.classList.add('fio-interativo');

        const linha = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        linha.setAttribute('x1', p1.x);
        linha.setAttribute('y1', p1.y);
        linha.setAttribute('x2', p2.x);
        linha.setAttribute('y2', p2.y);
        linha.setAttribute('class', 'fio');
        grupo.appendChild(linha);

        const marcador = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        marcador.setAttribute('d', 'M14.166 0L.16 14.41l13.995 14.417 24.164.007-14.995-14.418L38.328.007z');
        marcador.setAttribute('fill', '#7F807A');
        marcador.setAttribute('stroke', 'rgb(8, 20, 28)');
        marcador.setAttribute('stroke-width', '4');
        marcador.setAttribute('transform', `translate(${mx - 20}, ${my - 21.5}) rotate(${angle}, 20, 21.5) scale(1.5)`);

        grupo.appendChild(marcador);
        fiosGrupo.appendChild(grupo);

        grupo.addEventListener('mouseenter', () => grupo.classList.add('hover'));
        grupo.addEventListener('mouseleave', () => grupo.classList.remove('hover'));

        grupo.addEventListener('click', () => {
            const isSelecionado = grupo.classList.contains('selecionado');

            document.querySelectorAll('.fio-interativo').forEach(g => g.classList.remove('selecionado'));
            document.querySelectorAll('.pista').forEach(p => p.classList.remove('selecionada'));

            if (isSelecionado) {
                info.style.display = 'none';
                return;
            }

            grupo.classList.add('selecionado');

            const key = `${id1}-${id2}`;
            const textos = Array.isArray(label) ? label : [label || `Fio conectando ${id1} e ${id2}`];

            info.innerHTML = '';
            info.style.display = 'block';

            if (fiosVisitados[key]) {
                textos.forEach(txt => {
                    const p = document.createElement('p');
                    p.textContent = txt;
                    info.appendChild(p);
                });
            } else {
                escreverTextoSimultaneo(info, textos);
                fiosVisitados[key] = true;
            }
        });
    });
}

desenharFios([
    ['pistaProjetoGemeoCinzento', 'pistaMinasNomai', 'A câmara central dentro do Gêmeo Cinzento foi selada fisicamente por um imenso e robusto invólucro protetor.'],
    ['pistaMinasNomai', 'pistaLocalExperimentos', 'Os Nomai estavam extraindo minérios em algum lugar no Recanto Lenhoso.'],
    ['pistaProjetoGemeoCinzento', 'pistaOficinaEstatuas', 'Cada memória gravada por uma estátua Nomai é transmitida à unidade de armazenamento correspondente dentro do Gêmeo Cinzento.'],
    ['pistaProjetoGemeoCinzento', 'pistaLaboratorioAltaEnergia', 'Os Nomai planejaram construir uma tecnologia capaz de produzir um intervalo de tempo negativo de 22 minutos no Gêmeo Cinzento.'],
    ['pistaEsquemasTorre', 'pistaUsinaBuracosNegros', 'Há esquemas de torres no Laboratório de Alta Energia que revelam a localização de cada receptor de translocação.'],
    ['pistaProjetoGemeoCinzento', 'pistaUsinaBuracosNegros', 'Um núcleo de translação avançado foi aprovado para ser instalado na câmara central do Gêmeo Cinzento.'],
    ['pistaLaboratorioAltaEnergia', 'pistaEstacaoBuracoBranco', 'O intervalo de tempo negativo medido na Estação do Buraco Branco foi investigado profundamente no Laboratório de Alta Energia (no canyon no equador Gêmeo Cálido).'],
    ['pistaUsinaBuracosNegros', 'pistaTorresGemeoCinzento', 'Os Nomai construíram núcleos de translação na Usina de Buracos Negros antes de enviá-los para o Gêmeo Cinzento.'],
    ['pistaEstacaoBuracoBranco', 'pistaTorresGemeoCinzento', 'As torres no Gêmeo Cinzento foram feitas no molde da Estação do Buraco Branco.'],
    ['pistaEstacaoSolar', 'pistaTorresGemeoCinzento', 'Os Nomai construíram algo chamado de Estação Solar, mas nem todos aprovaram sua construção.'],
    ['pistaIlhaEstatua', 'pistaIlhaGabro', [
        'Uma das ilhas no Profundezas do Gigante tem uma estátua Nomai na praia, assim como a que Gabro trouxe para o Recanto Lenhoso.',
        'A Ilha da Estátua (como Gabro a chama) é aquela com duas ilhas conectadas por um arco de pedra.'
    ]],
    ['pistaCanhaoSondaOrbital', 'pistaIlhaGabro', 'Gabro vê uma luz brilhante no céu no início de cada loop. Algo deve estar acontecendo na órbita do Profundezas do Gigante.'],
    ['pistaProfundezasOceano', 'pistaIlhaGabro', 'Gabro disse que há uma forte correnteza por baixo da superfície do oceano que evita que qualquer coisa afunde ali.'],
    ['pistaIlhaGabro', 'pistaVila', 'Hal disse que Gabro voltou ao Profundezas do Gigante para tentar aprender mais sobre a estátua Nomai do observatório.'],
    ['pistaRadarSinalOlho', 'pistaVila', [
        'Soube que há algumas ruínas lunares em algum lugar na Pedra de Lia. Ninguém sabe o que são ou porque elas foram construídas.',
        'O texto Nomai no observatório fala sobre a calibragem de algum tipo de dispositivo na Pedra de Lia.'
    ]],
    ['pistaAcampamentoEsker', 'pistaVila', 'Parece que Esker ainda está na Pedra na Lia. Já está lá há algum tempo.'],
    ['pistaAcampamentoRiebeck', 'pistaRadarSinalOlho', 'Riebeck se dirigiu ao Vale Incerto para investigar o que os Nomai faziam no polo sul.'],
    ['pistaObservatorioSul', 'pistaAcampamentoRiebeck', 'Riebeck disse que não tem como chegar ao observatório pela superfície (após tentar e falhar), mas provavelmente há uma trilha sob a crosta em algum lugar.'],
    ['pistaObservatorioSul', 'pistaRadarSinalOlho', 'Os Nomai decidiram criar um radar maior e mais elaborado para captar o sinal do Olho no polo sul do Vale Incerto.'],
    ['pistaCanhaoSondaOrbital', 'pistaObservatorioSul', 'Os Nomai decidiram construir um canhão de sonda para orbitar o Profundezas do Gigante'],
    ['pistaProfundezasOceano', 'pistaEstaleiroConstrucao', 'Os Nomai no Estaleiro de Construção viram algo afundar por baixo da correnteza subaquática, o que eles antes achavam impossível.'],
    ['pistaCanhaoSondaOrbital', 'pistaEstaleiroConstrucao', [
        'Os Nomai finalizaram a construção do módulo final do Canhão de Sonda Orbital e o colocaram em órbita em torno do Profundezas do Gigante.',
        'Utilizei uma piscina de projeção Nomai e vi o interior de uma estação espacial orbitando o Profundezas do Gigante.'
    ]],
    ['pistaObservatorioSul', 'pistaEstaleiroConstrucao', 'Há duas trilhas abaixo da superfície do Vale Incerto que levam ao observatório. Uma começa no canhão gravitacional e a outra começa na Torre do Conhecimento Quântico.'],
    ['pistaSimulacaoTornados', 'pistaEstaleiroConstrucao', 'Os Nomai no Observatório do Sul construíram um modelo do Profundezas do Gigante, mostrando como um objeto pode afundar por baixo da forte correnteza do oceano.'],
    ['pistaObservacaoLunar', 'pistaAcampamentoEsker', 'Esker diz que o polo norte da Pedra de Lia (marcado em vermelho no minimapa) é um ótimo lugar para escutar a música dos demais viajantes com um onduloscópio.'],
    ['pistaProfundezasOceano', 'pistaIlhaAbrolho', 'Feldspato encontrou um jeito de alcançar o núcleo do Profundezas do Gigante.'],
    ['pistaAcampamentoFeldspato', 'pistaIlhaAbrolho', 'Feldspato se dirigiu ao Abrolho Sombrio após chegar até o núcleo do Profundezas do Gigante.'],
    ['pistaAguavivaCongelada', 'pistaAcampamentoFeldspato', 'Feldspato contou que o segredo de chegar até o núcleo do Profundezas do Gigante se encontra no fim da vinha oca, por onde sua nave caiu. Para encontrar a nave de Feldspato, é preciso ir até o final da cauda desse esqueleto de tamboril e procurar por uma luz reluzindo na névoa.'],
    ['pistaSementeAbrolhoSombrio', 'pistaObservacaoLunar', 'As entradas do Onduloscópio de Esker registram música de gaita vinda de algum lugar no Recanto Lenhoso. Aparentemente lembram o som da gaita de Feldspato, mas Feldspato desapareceu no espaço anos atrás.'],
    ['pistaAcampamentoFeldspato', 'pistaSementeAbrolhoSombrio', 'Quando lanço meu batedor dentro da semente que caiu no Recanto Lenhoso, ele acaba indo parar em um espaço bem maior, repleto de névoa e vinhas espinhentas.'],
    ['pistaEstacaoBuracoBranco', 'pistaGeleiraNorte', [
        'Há uma Estação do Buraco Branco do lado oposto ao buraco negro do Vale Incerto.',
        'Muitos Nomai retornaram à estação para investigar a leitura do equipamento que registrava uma violação à causalidade.'
    ]],
    ['pistaLuaQuantica', 'pistaGeleiraNorte', 'Os Nomai no Vale Incerto observaram a lua fantasma que às vezes aparece no céu.'],
    ['pistaLuaQuantica', 'pistaRadarLuaQuantica', 'Os Nomai no Gêmeo Cálido observaram a lua que desaparecia quando ninguém a via.'],
    ['pistaSextaLocalizacao', 'pistaRadarLuaQuantica', 'A Lua Quântica de vez em quando desaparece, talvez para uma sexta e desconhecida localização.'],
    ['pistaTemploQuantico', 'pistaTorreConhecimentoQuantico', 'Os Nomai construíram um templo na Lua Quântica para ajudá-los na peregrinação até a sexta localização.'],
    ['pistaSextaLocalizacao', 'pistaTorreConhecimentoQuantico', [
        'Muitos Nomai foram carregados pela Lua Quântica até sua sexta e mais secreta localização durante suas peregrinações.',
        'Para explorar a sexta localização, o templo na Lua Quântica precisa estar no polo norte da Lua.'
    ]],
    ['pistaTorreConhecimentoQuantico', 'pistaCanhaoGravitacional', 'Disseram para uma Nomai chamada Solanum visitou a Torre do Conhecimento Quântico (no equador do Vale Incerto) para aprender sobre a regra final, antes de embarcar em sua peregrinação à Lua Quântica.'],
    ['pistaTorreJulgamentosQuanticos', 'pistaFragmentoQuantico', 'Os Nomai detectaram um sinal quântico vindo de algum lugar no Profundezas do Gigante.'],
    ['pistaBosqueQuantico', 'pistaFragmentoQuantico', [
        'Há um fragmento estranho de rocha nesse bosque, que se move quando não é observado. Ele emite um sinal na frequência de Flutuações Quânticas.',
        'Encontrei um poema em uma das árvores desse bosque.'
    ]],
    ['pistaCavernasQuanticas', 'pistaFragmentoQuantico', 'Os Nomai captaram um sinal quântico vindo de algum lugar nos Gêmeos da Ampulheta.'],
    ['pistaCavernaFundoSecoLago', 'pistaCavernasQuanticas', [
        'A rocha errante foi vista pela primeira vez na caverna no fundo seco do lago no polo norte do Gêmeo Cálido.',
        'Um Nomai chamado Coleus desapareceu misteriosamente da caverna no fundo seco do lago no polo norte do Gêmeo Cálido.'
    ]],
    ['pistaEstacaoSolar', 'pistaCidadeOcaso', [
        'Há um modo seguro de viajar do Gêmeo Cinzento até a Estação Solar.',
        'Os Nomai discutiram sobre construir uma Estação Solar a fim de energizar o Projeto do Gêmeo Cinzento.'
    ]],
    ['pistaCidadeOcaso', 'pistaAcampamentoCherte', 'Cherte crê que a falta de ruínas na superfície mostra que os Nomai devem ter vivido no subterrâneo.'],
    ['pistaUsinaBuracosNegros', 'pistaCidadeDependurada', [
        'A Usina de Buracos Negros é suspensa e fica acima da Cidade Dependurada. Eu encontrei uma alavanca no Distrito do Degelo que eleva e rebaixa a Usina.',
        'O Distrito da Usina de Buracos Negros é o distrito mais alto na Cidade Dependurada.',
        'Uma Nomai chamada Poke tentou criar um núcleo avançado de transportação na Usina de Buracos Negros.'
    ]],
    ['pistaFossilTamboril', 'pistaCidadeDependurada', 'Os Nomai aprenderam a fugir de um tamboril (ao menos teoricamente), ao analisar o fóssil encontrado no Gêmeo Cálido.'],
    ['pistaFossilTamboril', 'pistaCidadeOcaso', [
        'As crianças Nomai costumavam jogar um jogo na Caverna do Fóssil de Peixe. Há um jeito de entrar na Caverna do Fóssil de Peixe através da Caverna dos Pisos de Pedra.',
        'A entrada da Caverna dos Pisos de Pedra é difícil de ver, a menos que alimente o tamboril com uma luz antes.'
    ]],
    ['pistaFossilTamboril', 'pistaCapsulaEscape2', 'Encontrei uma caverna com um fóssil de tamboril lá dentro, mas sua abertura era pequena demais e só o batedor conseguiu entrar.'],
    ['pistaCidadeOcaso', 'pistaCapsulaEscape2', [
        'Os sobreviventes que caíram no Gêmeo Cálido decidiram buscar abrigo nas cavernas, sob o local da queda da cápsula de escape deles.',
        'Os Nomai descobriram um lugar para abrigarem-se em longo prazo, no fim de umas das passagens sob a cápsula de escape.'
    ]],
    ['pistaCapsulaEscape2', 'pistaAcampamentoCherte', 'Cherte encontrou destroços Nomai emitindo um sinalizador de luz para o céu, em algum lugar no hemisfério sul do Gêmeo Cálido.'],
    ['pistaCidadeDependurada', 'pistaAntigoAssentamento', 'Os Nomai decidiram migrar para o Antigo Assentamento na geleira norte. Eles usaram cristais de gravidade para criar um caminho estável por baixo da superfície.'],
    ['pistaAntigoAssentamento', 'pistaCapsulaEscape1', 'Os sobreviventes Nomai que caíram no Vale Incerto desceram por um penhasco até um local para se abrigarem abaixo da superfície.'],
    ['pistaCapsulaEscape1', 'pistaMuralPainel3', 'Uma das três cápsulas de escape Nomai pousou em algum lugar do Vale Incerto.'],
    ['pistaCapsulaEscape2', 'pistaMuralPainel3', 'Uma das três cápsulas de escape Nomai pousou em algum lugar nos Gêmeos da Ampulheta.'],
    ['pistaCapsulaEscape3', 'pistaMuralPainel3', 'Uma das três cápsulas de escape Nomai nunca conseguiu sair do Abrolho Sombrio.'],
    ['pistaTumuloNomai', 'pistaCapsulaEscape3', [
        'Os sobreviventes da cápsula de escape 3 abandonaram os destroços e tentaram retornar ao Hospedeiro.',
        'Os sobreviventes decidiram seguir o sinalizador mais próximo do Hospedeiro, devido ao suprimento limitado de ar. Eles planejaram deixar um rastro de luzes pelo caminho caso alguém respondesse ao sinal de socorro.'
    ]],
    ['pistaOHospedeiro', 'pistaMuralPainel3', 'O Hospedeiro caiu em algum lugar no Abrolho Sombrio.'],
    ['pistaOHospedeiro', 'pistaTumuloNomai', 'Eu lancei meu batedor na semente no Túmulo Nomai e tirei fotos de uma enorme nave Nomai abandonada.'],
    ['pistaOHospedeiro', 'pistaCidadeDependurada', 'O núcleo de transportação do Hospedeiro se quebrou com a queda da nave no Abrolho Sombrio.'],
    ['pistaNucleoRompido', 'pistaExploradoraNomaiCongelada', [
        'O equipamento da exploradora captou estranhas leituras vindas de algum lugar sob a superfície.',
        'Duas das Nomai localizaram a fissura no gelo no lado ensolarado do Xereta. Elas desceram até lá dentro para investigar.'
    ]],
    ['pistaCanhaoGravitacional2', 'pistaExploradoraNomaiCongelada', 'A exploradora Nomai congelada, no Xereta, pode ser recuperada através do canhão gravitacional no Gêmeo Cálido.'],
    ['pistaEstruturaSubmersa', 'pistaReservatorio', 'Eu encontrei um diagrama de uma estrutura oca de metal suspensa por correntes. Embaixo dela há um buraco circular que parece ser a única entrada.'],
    ['pistaEstruturaSubmersa', 'pistaRoloFilmeQueimado1', 'De acordo com um rolo de filme, um estranho cofre foi colocado em uma grande estrutura de metal e mergulhado na água.'],
    ['pistaCofreSelado', 'pistaDesfiladeiroOculto', 'Um rolo de filme do Desfiladeiro Oculto mostrou um símbolo luminoso e correntes aparecendo em volta de um estranho cofre.'],
    ['pistaCofreSelado', 'pistaPlaniciesRio', 'Um rolo de filme das Planícies do Rio mostrou um estranho cofre sendo selado com correntes e um símbolo luminoso.'],
    ['pistaSalaIncineracaoFilmes1', 'pistaProjecaoMapa3', 'Um mapa que encontrei no Templo Abandonado revela uma localização secreta em alum lugar dentro do Desconhecido.'],
    ['pistaSalaIncineracaoFilmes2', 'pistaProjecaoMapa1', 'Um mapa que encontrei no Templo Abandonado revela uma localização secreta em alum lugar dentro do Desconhecido.'],
    ['pistaSalaIncineracaoFilmes3', 'pistaProjecaoMapa2', 'Um mapa que encontrei no Templo Abandonado revela uma localização secreta em alum lugar dentro do Desconhecido.'],
    ['pistaEstruturaSubmersa', 'pistaIlhasCinerarias', 'Um rolo de filme das Ilhas Cinerárias mostrou um símbolo luminoso e correntes aparecendo em volta de um estranho cofre.'],
    ['pistaSalaSimbolos', 'pistaLagoSubterraneo', [
        'A luz vinda do cofre em trouxe a visão de uma escada caracol que subia até uma sala perto do topo de uma torre idêntica sob um planeta circundado por anéis, em seguida, pegou um artefato e desceu com ele a escada em direção a uma sala com fogo verde. Algum tempo depois, duas das lamparinas na sala do mural se apagaram, mergulhando o mural nas trevas e revelando uma passagem secreta.',
        'A passagem levava a três recipientes de madeira, cada um deles marcado com um lacre de cofre brilhante.'
    ]],
    ['pistaTorreIlha', 'pistaIlhasCinerarias', 'Eu encontrei uma projeção que revela a entrada de uma caverna na base de uma ilha rochosa com uma torre alta.'],
    ['pistaArquivoProibido1', 'pistaSalaIncineracaoFilmes3', 'O rolo que encontrei na sala de incineração de filmes mostra um recipiente marcado com um símbolo luminoso sendo entregue para uma figura sombria. As luzes se apagam, e a figura carrega o recipiente para dentro de um poço escuro.'],
    ['pistaArquivoProibido2', 'pistaSalaIncineracaoFilmes1', 'O rolo que encontrei na sala de incineração de filmes mostra um recipiente marcado com um símbolo luminoso sendo entregue para uma figura sombria. As luzes se apagam, e a figura carrega o recipiente para uma passagem secreta atrás do mural de uma grande árvore.'],
    ['pistaArquivoProibido3', 'pistaSalaIncineracaoFilmes2', 'Eu encontrei um rolo de filme escondido que mostra um recipiente marcado com um símbolo luminoso sendo entregue para uma figura sombria. A figura segue uma fila de luzes pela floresta até um edifício iluminado por velas, onde carrega o recipiente para dentro de uma passagem secreta atrás de uma lareira ardente.']
]);

updateTransform();
