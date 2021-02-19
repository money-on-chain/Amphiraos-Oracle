# Money on Chain - Oracle (Medianizer)

> MoC USD-BTC price provider contract. This is the current implementation of oracle on MoC system, also we are working on a new
> generation 'OMOC Decentralized Oracle' 

This project is based on MakerDao Medianizer and PriceFeed solution. [link](https://github.com/makerdao)

## Feeds price feed oracles

Reference price (BTCUSD) and (RIFUSD) for MoC/RDoC system is provided via an oracle (the medianizer), which collates price data from a number of external price feeds.

## Price Feeds

Independent price feed operators constantly monitor the reference price across a number of external sources and will submit updates to the blockchain.

Price updates are written to the blockchain via price feed contracts which are deployed and owned by feed operators. Price feed contracts which have been whitelisted by the medianizer are able to forward their prices for inclusion in the medianized price.

[take a look to pricefeed app implementation](https://github.com/money-on-chain/price-feeder)

### Permissions:

The adding and removal of whitelisted price feed addresses is controlled via governance, as is the setting of the `min` parameter - the minimum number of valid feeds required in order for the medianized value to be considered valid.


## Oracle - The Medianizer

The medianizer is the smart contract which provides MoC trusted reference price.

It maintains a whitelist of price feed contracts which are allowed to post price updates and a record of recent prices supplied by each address. Every time a new price update is received the median of all feed prices is re-computed and the medianized value is updated.

### Oracle implementations addresses


|  Project |  Network |  Contract  |  Address |
|:---|:---|:---|:---|
|  MoC  |  Mainnet  |  Medianizer  | [0x7b19bb8e6c5188ec483b784d6fb5d807a77b21bf](https://blockscout.com/rsk/mainnet/address/0x7b19bb8e6c5188ec483b784d6fb5d807a77b21bf/contracts) |
|  RDOC  |  Mainnet  |  Medianizer  | [0x504EfCadfB020d6Bbaec8a5C5bb21453719d0e00](https://blockscout.com/rsk/mainnet/address/0x504EfCadfB020d6Bbaec8a5C5bb21453719d0e00/contracts) |

### Usage

#### API 

Take a look to [github api site](https://github.com/money-on-chain/py_Moneyonchain)

**Requirements**

* Python 3.6+ support

**Installation**

```
pip3 install moneyonchain
```

Get the last price from MOC or RDOC contract oracle.

See example in source/example/price_provider.py


```
from moneyonchain.manager import ConnectionManager
from moneyonchain.price_provider import PriceProvider

import logging
import logging.config

# logging module
# Initialize you log configuration using the base class
logging.basicConfig(level=logging.INFO)
# Retrieve the logger instance
log = logging.getLogger()

# Connect to MoC enviroment network
network = 'mocTestnet'
connection_manager = ConnectionManager(network=network)
log.info("Connecting to %s..." % network)
log.info("Connected: {conectado}".format(conectado=connection_manager.is_connected))

price_provider = PriceProvider(connection_manager)

log.info("Last price: {0}".format(price_provider.price()))

```

result:

```
INFO:root:Connecting to mocTestnet...
INFO:root:Connected: True
INFO:root:Last price: 10725.4
```

RDOC Contract:

```
from moneyonchain.manager import ConnectionManager
from moneyonchain.price_provider import PriceProvider

import logging
import logging.config

# logging module
# Initialize you log configuration using the base class
logging.basicConfig(level=logging.INFO)
# Retrieve the logger instance
log = logging.getLogger()

# Connect to MoC enviroment network
network = 'rdocTestnet'
connection_manager = ConnectionManager(network=network)
log.info("Connecting to %s..." % network)
log.info("Connected: {conectado}".format(conectado=connection_manager.is_connected))

price_provider = PriceProvider(connection_manager)

log.info("Last price: {0}".format(price_provider.price()))
```

Result:

```
INFO:root:Connecting to rdocTestnet...
INFO:root:Connected: True
INFO:root:Last price: 0.092123288999999996
```

#### Contract

Consuming oracle from another contract

**IPriceProvider.sol:**

```
pragma solidity 0.6.12;

/**
 * @dev Interface of the old MOC Oracle
 */
interface IPriceProvider {
    function peek() external view returns (bytes32, bool);
}
```

you need to initialize with the Oracle implementations address

```
pragma solidity 0.6.12;

import {IPriceProvider} from IPriceProvider;
import {Initializable} from "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

/// @title This contract provides an interface for feeding prices from oracles, and
///        get the current price.
contract CoinPairPriceFree is Initializable, IPriceProvider {
    IPriceProvider public coinPairPrice;

    function initialize(IPriceProvider _coinPairPrice) public initializer {
        coinPairPrice = _coinPairPrice;
    }

    /// @notice Return the current price, compatible with old MOC Oracle
    function peek() external override view returns (bytes32, bool) {
        return coinPairPrice.peek();
    }
}
```
