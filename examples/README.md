# Examples

Below are a series of JSON RPC calls that can be manually entered at chat.fullstack.cash to interact with the JSON RPC of this IPFS Service Provider. You can generate your own commands with these example scripts:

- [burn-tokens.js](./burn-tokens.js) shows how to burn an SLP token to generate a TXID to serve as proof-of-burn.
- [burn-and-write.js](./burn-and-write.js) will burn a token and write data to the P2WDB using the REST API.
- [burn-and-rpc.js](./burn-and-rpc.js) will burn a token and generate the RPC command you can upload to the P2WDB using [chat.fullstack.cash](https://chat.fullstack.cash)

## JSON RPC examples

- `{"jsonrpc":"2.0","id":"555","method":"p2wdb","params":{"endpoint": "write", "txid": "9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967", "message": "test", "signature": "H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=", "data": "This is the data that will go into the database."}}`

- `{"jsonrpc":"2.0","id":"123","method":"p2wdb","params":{"endpoint":"write","txid":"c3f75c312b175a88dfc4696b33ca34d073908a1a7b03a28b523e7df96933e9cb","message":"test","signature":"H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=","data":"{\"title\":\"Ivermectin obliterates 97 percent of Delhi cases\",\"sourceUrl\":\"https://www.thedesertreview.com/news/national/ivermectin-obliterates-97-percent-of-delhi-cases/article_6a3be6b2-c31f-11eb-836d-2722d2325a08.html\",\"ipfsUrl\":\"https://hub.textile.io/ipfs/bafkreidsemzda6fhrkczx3q4xpeb7db5fcgfsk7yzyjtp6qffnemhutfzq\"}"}}`

## REST API Examples

Below are a series of REST API calls that use the same info below to write data to the P2WDB:

- `curl -H "Content-Type: application/json" -X POST -d '{ "txid": "9ac06c53c158430ea32a587fb4e2bc9e947b1d8c6ff1e4cc02afa40d522d7967", "message": "test", "signature": "H+TgPR/6Fxlo2uDb9UyQpWENBW1xtQvM2+etWlSmc+1kIeZtyw7HCsYMnf8X+EdP0E+CUJwP37HcpVLyKly2XKg=", "data": "This is the data that will go into the database." }' localhost:5001/p2wdb`
