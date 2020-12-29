web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})

abi = JSON.parse('[ { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "insertVote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32[]", "name": "names", "type": "bytes32[]" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "candidates", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "isValid", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "name": "totalVotes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "candidate", "type": "bytes32" } ], "name": "totalVotesFor", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }],"stateMutability": "view","type": "function"}]')

contract = new web3.eth.Contract(abi);
contract.options.address = "0x18038eDa566FFed4fEBD744588DAC4D7F4643177";
// update this contract address with your contract address

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