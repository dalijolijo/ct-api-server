# CryptoTerminal API Server

[![Build Status](https://travis-ci.org/samotari/ct-api-server.svg?branch=master)](https://travis-ci.org/samotari/ct-api-server) [![Status of Dependencies](https://david-dm.org/samotari/ct-api-server.svg)](https://david-dm.org/samotari/ct-api-server)

API server for the CryptoTerminal mobile application.

* Public API Documentation:
	* [HTTP API Reference](https://github.com/samotari/ct-api-server/blob/master/docs/http-api-reference.md)
	* [Using the Websocket API](https://github.com/samotari/ct-api-server/blob/master/docs/using-the-websocket-api.md)


## Running Your Own Instance

The ct-api-server is a Node.js application that can be run locally (for testing) or on your own publicly accessible server.

### Requirements

The requirements differ based on the cryptocurrencies that you wish to support.

* [nodejs](https://nodejs.org/) - For Linux and Mac install node via [nvm](https://github.com/creationix/nvm).
* For Bitcoin:
	* [electrum](https://electrum.org/) - Used for the following:
		* Getting unspent transaction outputs
		* Getting the current network fee rate estimate
		* Broadcasting raw transactions
	* [bitcoind](https://bitcoin.org/en/download) - Used for receiving real-time transactions.
* For Bitcore:
	* [electrum-btx](https://github.com/LIMXTEC/electrum-btx) - Used for the following:
		* Getting unspent transaction outputs
		* Getting the current network fee rate estimate
		* Broadcasting raw transactions
	* [bitcored](https://github.com/LIMXTEC/BitCore/releases) - Used for receiving real-time transactions.
* For Litecoin:
	* [electrum-ltc](https://electrum-ltc.org/) - Used for the following:
		* Getting unspent transaction outputs
		* Getting the current network fee rate estimate
		* Broadcasting raw transactions
	* [litecoind](https://github.com/litecoin-project/litecoin) - Used for receiving real-time transactions.


### Get the Code

Download the project files via git:
```bash
git clone https://github.com/samotari/ct-api-server.git
```

Install the project's dependencies:
```bash
cd ct-api-server
npm install
```


### Electrum Daemon

The electrum RPC interface is used to get unspent transaction outputs, fee rate, and broadcast raw transactions. If you have not already done so, download and install [electrum](https://electrum.org/#download). Once you've got that, you will need to configure your RPC settings:
```bash
electrum --testnet setconfig rpcuser "user"
electrum --testnet setconfig rpcport 7777
electrum --testnet setconfig rpcpassword "replace with something better"
```
Then start the electrum daemon:
```bash
electrum --testnet daemon start
```
You can use the same steps above to configure and start an electrum daemon for Bitcoin mainnet as well as use electrum-btx to query the Bitcore network or electrum-ltc to query the Litecoin network.

#### Example: Bitcore - Setup electrum-btx
```sh
cd electrum-btx/electrum
./electrum --testnet setconfig rpcuser "btx"
./electrum --testnet setconfig rpcport 8888
./electrum --testnet setconfig rpcpassword "btx_pwd"

./electrum --testnet daemon start
```

### Environment Variables

Below are example environment variables for an instance of the ct-api-server:
```bash
CT_API_SERVER_ELECTRUM='{"bitcoinTestnet":{"uri":"http://localhost:7777","username":"user","password":"replace with something better"}}';
CT_API_SERVER_ZEROMQ='{"bitcoinTestnet":[{"dataUrl":"tcp://127.0.0.1:7000"}]}';
```

#### Example: Bitcore - Setup ct-api-server
```sh
CT_API_SERVER_ELECTRUM='{"bitcoreTestnet":{"uri":"http://localhost:8888","username":"btx","password":"btx_pwd"}}';
CT_API_SERVER_ZEROMQ='{"bitcoreTestnet":[{"dataUrl":"tcp://127.0.0.1:7000"}]}';
```


### Setup bitcoind with ZeroMQ

Bitcoin core (bitcoind) is used to stream transactions in real-time to the ct-api-server. Use the following guide to install and configure bitcoind:
* [Streaming Transactions from bitcoind via zeroMQ](https://degreesofzero.com/article/streaming-transactions-from-bitcoind-via-zeromq.html). For more details on how ZeroMQ is implemented and configured in bitcoind, see [bitcoin/zmq.md](https://github.com/bitcoin/bitcoin/blob/master/doc/zmq.md).

The above guide can also be used with bitcored and litecoind.

Modify the bitcoin.conf like this example:
```sh
# Use the regtest network, because we can generate blocks as needed.
regtest=1

# In this example, we will keep bitcoind running in one terminal window.
# So we don't need it to run as a daemon.
daemon=0

# RPC is required for bitcoin-cli.
server=1
rpcuser=test
rpcpassword=test

# In this example we are only interested in receiving raw transactions.
# The address here is the URL where bitcoind will listen for new ZeroMQ connection requests.
zmqpubrawtx=tcp://127.0.0.1:3000
```

#### Example: Bitcore - Setup bitcored with ZeroMQ
```sh
cp bitcored usr/local/bin/
cp bitcore-cli /usr/local/bin/

mkdir -p /root/.bitcore
```

Create /root/.bitcore/bitcore.conf:
```sh
# Use the regtest network, because we can generate blocks as needed.
regtest=1

# In this example, we will keep bitcored running in one terminal window.
# So we don't need it to run as a daemon.
daemon=0

# RPC is required for bitcore-cli.
server=1
rpcuser=btx
rpcpassword=btx_pwd

# In this example we are only interested in receiving raw transactions.
# The address here is the URL where bitcored will listen for new ZeroMQ connection requests.
zmqpubrawtx=tcp://127.0.0.1:3000
```

##### Test bitcored in regtest
Use bitcoin-cli to generate new blocks:
```sh
bitcore-cli -datadir=/root/.bitcore generate 101
This will give your local wallet some regtest bitcoin to play with.
```

Get a new address:
```sh
bitcore-cli -datadir=/root/.bitcore getnewaddress
=> BTX_ADDRESS
```

Send some bitcoin to the new address:
```sh
bitcore-cli -datadir=/root/.bitcore sendtoaddress BTX_ADDRESS 1.000
```

Debugging:
```sh
tail -f /root/.bitcore/regtest/debug.log
```

### Tests

To run the tests, you will need to install the following:
* [mocha](https://mochajs.org/) - `npm install -g mocha`
* [eslint](https://eslint.org/) - `npm install -g eslint`

To run all tests:
```
npm test
```


## License

This project is licensed under the [GNU Affero General Public License v3 (AGPL-3.0)](https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)).
=======
Documentation:
* [HTTP API Reference](https://github.com/dalijolijo/ct-api-server/blob/master/docs/http-api-reference.md)
* [Using the Websocket API](https://github.com/dalijolijo/ct-api-server/blob/master/docs/using-the-websocket-api.md)
