#!/usr/bin/env bash
echo "Starting to flatten our contracts"
node_modules/.bin/truffle-flattener contracts/MocMedianizer.sol > scripts/contract_flatten/MocMedianizer_flat.sol
node_modules/.bin/truffle-flattener contracts/price-feed/feed-factory.sol > scripts/contract_flatten/feed-factory_flat.sol
node_modules/.bin/truffle-flattener contracts/price-feed/price-feed.sol > scripts/contract_flatten/price-feed_flat.sol
node_modules/.bin/truffle-flattener contracts/authority/MoCGovernedAuthority.sol > scripts/contract_flatten/MoCGovernedAuthority_flat.sol
echo "Finish successfully! Take a look in folder scripts/contract_flatten/..."