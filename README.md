# Money on Chain - Oracle

> MoC USD-BTC price provider

This project is based on MakerDao Medianizer and PriceFeed solution. (link)[https://github.com/makerdao]

# Feeds price feed oracles

Reference price (BTCUSD) for MoC system is provided via an oracle (the medianizer), which collates price data from a number of external price feeds.

## Price Feeds

Independent price feed operators constantly monitor the reference price across a number of external sources and will submit updates to the blockchain.

Price updates are written to the blockchain via price feed contracts which are deployed and owned by feed operators. Price feed contracts which have been whitelisted by the medianizer are able to forward their prices for inclusion in the medianized price.

## The Medianizer

The medianizer is the smart contract which provides MoC trusted reference price.

It maintains a whitelist of price feed contracts which are allowed to post price updates and a record of recent prices supplied by each address. Every time a new price update is received the median of all feed prices is re-computed and the medianized value is updated.

## Permissions:

The adding and removal of whitelisted price feed addresses is controlled via governance, as is the setting of the `min` parameter - the minimum number of valid feeds required in order for the medianized value to be considered valid.
