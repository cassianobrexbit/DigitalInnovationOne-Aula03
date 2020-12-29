window.addEventListener('load', async () => {
    // New web3 provider
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // ask user for permission
            await ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
    // Old web3 provider
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // no need to ask for permission
    }
    // No web3 provider
    else {
        console.log('No web3 provider detected');
    }

    abi = JSON.parse('[{ "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "insertVote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32[]", "name": "names", "type": "bytes32[]" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "candidates", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "isValid", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "name": "totalVotes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "totalVotesFor", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }],"stateMutability": "view","type": "function"}]')

    contractAddress = "0x38Dc5c8d0753728d8F9EfC50201eB47a2816fA46";
    // update this contract address with your contract address
    contract =  new web3.eth.Contract(abi, contractAddress);

  });
  console.log (window.web3.currentProvider)



var account;

web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly.");
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});


candidates = {"Cassiano": "candidate-1", "Carlos": "candidate-2", "Joao": "candidate-3"}

function insertVote(votedCandidate) {
 candidate = $("#candidate").val();
 console.log(candidate);

 contract.methods.insertVote(web3.utils.asciiToHex(candidate)).send({from: account}).then((f) => {
  let div_id = candidates[candidate];
  contract.methods.totalVotesFor(web3.utils.asciiToHex(candidate)).call().then((f) => {
   $("#" + div_id).html(f);
  })
 })
}

$(document).ready(function() {
 candidateNames = Object.keys(candidates);

 for(var i=0; i<candidateNames.length; i++) {
 let name = candidateNames[i];
  
 contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
  $("#" + candidates[name]).html(f);
 })
 }
});