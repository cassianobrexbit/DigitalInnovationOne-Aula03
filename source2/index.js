window.addEventListener('load', async () => {
    //Instanciando o Web3 provider
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          //Solicitando permissão de usuário
          await ethereum.enable();
          //Usuário aprova permissão
      } catch (error) {
          //Usuário rejeita permissão
          console.log('Acesso negado');
      }
    }
    // No web3 provider
    else {
        console.log('Provedor Web3 não encontrado');
    }

    //ABI do contrato compilado no formato json
    abi = JSON.parse('[{ "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "insertVote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32[]", "name": "names", "type": "bytes32[]" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "candidates", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "isValid", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "name": "totalVotes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "totalVotesFor", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }],"stateMutability": "view","type": "function"}]')

    //Atualizar com o seu endereço do contrato
    contractAddress = "0x38Dc5c8d0753728d8F9EfC50201eB47a2816fA46";
  
    //Instanciando contrato
    contract =  new web3.eth.Contract(abi, contractAddress);

  });

  console.log (window.web3.currentProvider)

  var account;

  web3.eth.getAccounts(function(err, accounts) {

    if (err != null) {
      alert("Erro ao recuperar contas.");
      return;
    }

    if (accounts.length == 0) {
      alert("Conta não encontrada, verifique a configuração do seu cliente Ethereum");
      return;
    }

    //Obtendo a primeira conta do Metamask
    account = accounts[0];
    console.log('Account: ' + account);
    web3.eth.defaultAccount = account;
  
  });

  //Array de candidatos
  candidates = {"Cassiano": "candidate-1", "Carlos": "candidate-2", "Joao": "candidate-3"}

  //Função para inserir voto de um candidato
  function insertVote(votedCandidate) {

    candidate = $("#candidate").val();
    console.log(candidate);

    //Chamada do método do contrato para inserir voto
    contract.methods.insertVote(web3.utils.asciiToHex(candidate)).send({from: account}).then((f) => {

      let div_id = candidates[candidate];

      contract.methods.totalVotesFor(web3.utils.asciiToHex(candidate)).call().then((f) => {
        $("#" + div_id).html(f);
      })

    })

  }

  //Função para recuperar lista de candidatos com a contagem de votos
  $(document).ready(function() {

    candidateNames = Object.keys(candidates);

    for(var i=0; i<candidateNames.length; i++) {

      let name = candidateNames[i];
      contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
        $("#" + candidates[name]).html(f);
      })

    }

});