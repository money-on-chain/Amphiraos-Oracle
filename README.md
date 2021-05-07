# Money on Chain - Oracle (Medianizer)

> MoC USD-BTC price provider contract. This is the current implementation of oracle on MoC system, also we are working on a new
> generation 'OMOC Decentralized Oracle' 

This project is based on MakerDao Medianizer and PriceFeed solution. (link)[https://github.com/makerdao]

## Feeds price feed oracles

Reference price (BTCUSD) and (RIFUSD) for MoC/RDoC system is provided via an oracle (the medianizer), which collates price data from a number of external price feeds.

## Price Feeds

Independent price feed operators constantly monitor the reference price across a number of external sources and will submit updates to the blockchain.

Price updates are written to the blockchain via price feed contracts which are deployed and owned by feed operators. Price feed contracts which have been whitelisted by the medianizer are able to forward their prices for inclusion in the medianized price.

(take a look to pricefeed app implementation)[https://github.com/money-on-chain/price-feeder]

### Permissions:

The adding and removal of whitelisted price feed addresses is controlled via governance, as is the setting of the `min` parameter - the minimum number of valid feeds required in order for the medianized value to be considered valid.


## Oracle - The Medianizer

The medianizer is the smart contract which provides MoC trusted reference price.

It maintains a whitelist of price feed contracts which are allowed to post price updates and a record of recent prices supplied by each address. Every time a new price update is received the median of all feed prices is re-computed and the medianized value is updated.

### Medianizer implementations addresses


|  Price   |  Project |  Network |  Contract  |  Address |
|:---------|:---------|:---|:---|:---|
|  BTC/USD |  MOC     |  Testnet  |  Medianizer  | [0x26a00aF444928d689DDEC7b4D17c0E4a8c9D407d](https://explorer.testnet.rsk.co/address/0x26a00aF444928d689DDEC7b4D17c0E4a8c9D407d) |
|  RIF/USD |  RDOC    |  Testnet  |  Medianizer  | [0x987ccC60c378a61d167B6DD1EEF7613c6f63938f](https://explorer.testnet.rsk.co/address/0x987ccC60c378a61d167B6DD1EEF7613c6f63938f) |
|  ETH/USD |  ETH     |  Testnet  |  Medianizer  | [0x4d4254d3744e1e4beb090ab5d8eb48096Ff4AE27](https://explorer.testnet.rsk.co/address/0x4d4254d3744e1e4beb090ab5d8eb48096ff4ae27?__ctab=Code) |
|  BTC/USD |  MOC     |  Mainnet  |  Medianizer  | [0x7B19bb8e6c5188eC483b784d6fB5d807a77b21bF](https://explorer.rsk.co/address/0x7B19bb8e6c5188eC483b784d6fB5d807a77b21bF) |
|  RIF/USD |  RDOC    |  Mainnet  |  Medianizer  | [0x504EfCadFB020d6bBaeC8a5c5BB21453719d0E00](https://explorer.rsk.co/address/0x504EfCadFB020d6bBaeC8a5c5BB21453719d0E00) |
|  ETH/USD |  ETH     |  Mainnet  |  Medianizer  | [NA](https://blockscout.com/rsk/mainnet/address/0x504EfCadfB020d6Bbaec8a5C5bb21453719d0e00/contracts) |

### Usage

#### Contract

Consuming oracle from another contract

Take a look to Oracle Interface **IMoCBaseOracle**. It return tuple, the price in wei and boolean if is valid result.
Note: If its not valid consider not used or raise an error because the price is out of time limit.

```
pragma solidity 0.5.8;

/**
 * @dev Interface of MoCs Oracles
 */
interface IMoCBaseOracle {
  function peek() external view returns (bytes32, bool);
}
```


#### API 

Take a look to (github api site)[https://github.com/money-on-chain/py_Moneyonchain]

### Contract deployment

Install packages

```
npm install
```

compile source contracts

```
npm run truffle-compile
```

private key

```
export MNEMONIC=(Private key)
```

run deployment

```
npm run deploy-eth-testnet
```