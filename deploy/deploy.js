const { getConfig, saveConfig, getChainName } = require("../migrations/helper");
const { toContract } = require("../utils/numberHelper");
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const version = 'vPolygon';

module.exports = async (hardhat) => {
    const {getNamedAccounts,deployments,getChainId,ethers} = hardhat;
    const { BigNumber } = ethers;
    const {deploy} = deployments;
    let{deployer} = await getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);
    
    const chainId = parseInt(await getChainId(),10);
    const chainName = getChainName(chainId);
    const configPath = `${__dirname}/../migrations/configs/${chainName}.json`;
    const config  = getConfig(chainName,configPath);

    console.log(`\n ~~~ Deploying ORACLES to ${chainName} ~~~`);

    console.log("~~~ Deploying MoCMedianizer ... ");
    const moCMedianizerResult = await deploy("MoCMedianizer",{
        args:[],
        contract: "MoCMedianizer",
        from: deployer,
        log:true,
        skipIfAlreadyDeployed: true
    });
    console.log("~~~ Deploying PriceFeedFactory ...");
    const priceFactoryResult = await deploy('PriceFactory',{
        args:[],
        contract:"FeedFactory",
        from: deployer,
        log:true,
        skipIfAlreadyDeployed: true
    });

    const mocMedianizerAddr = moCMedianizerResult.address;
    const priceFactoryAddr = priceFactoryResult.address;
    
    const MoCMedianizer = new ethers.Contract(
        mocMedianizerAddr,
        moCMedianizerResult.abi,
        signer
    );

    const PriceFactory = new ethers.Contract(
        priceFactoryAddr,
        priceFactoryResult.abi,
        signer
    );

    // Save deployed address to config file
    config.MoCMedianizer = mocMedianizerAddr;
    config.PriceFactory = priceFactoryAddr;
    saveConfig(config,configPath);
    
    console.log("~~~ SETING MIN VALUE TO MEDIANIZER ...");
    await MoCMedianizer.setMin(config.minValues);
    console.log("~~~ SET MIN VALUE TO MEDIANIZER ...");
    
    console.log("~~~ CREATING PRICE FEED ...");
    let createFeedRcpt, feedAddress;
    if(!process.env.FEED_ADDRESS){
        createFeedRcpt = await PriceFactory.create().then(tx => tx.wait());
        feedAddress = creationRcpt.events[1].args.feed;
    }else{
        feedAddress = process.env.FEED_ADDRESS;
    }

    // Add first PriceFeed to Medianizer
    await MoCMedianizer.setPriceFeeder(feedAddress);
    config.PriceFeed = feedAddress;
    saveConfig(config, configPath);
    console.log("~~~ SET PRICE FEED TO MEDIANIZER ...");

    const priceFeedAbi = (await deployments.getArtifact('PriceFeed')).abi;

    const PriceFeed = new ethers.Contract(
        feedAddress,
        priceFeedAbi,
        signer
    );

    console.log("~~~ SETTING GOVERNANCE ...");
    let governor = config.governor;

    if(chainName == 'development'){
        const mockGovernorResult = await deploy('MoCGovernorMock',{
            args:[],
            contract:"MoCGovernorMock",
            from: deployer,
            log:true,
            skipIfAlreadyDeployed: true
        });
        governor = mockGovernorResult.address;
    }

    const authorityResult = await deploy("MoCGovernedAuthority",{
        args:[governor],
        contract: "MoCGovernedAuthority",
        from:deployer,
        log:true,
        skipIfAlreadyDeployed: true
    });

    const authorityAddr = authorityResult.address;

    console.log("~~~ SET AUTHORITY TO MEDIANIZER...");
    // Setting Governance Authority to Medianizer
    await MoCMedianizer.setAuthority(authorityAddr);
    // Removing owner. Now the only Authority is the Governor contract
    await MoCMedianizer.setOwner(NULL_ADDRESS);

    console.log("~~~ POST PRICE ....");

    const block = await ethers.provider.getBlock('latest');
    const timestamp = block.timestamp;

    await PriceFeed.post(
        toContract(config.initialPrice * 10 **18),
        toContract(timestamp+config.expirationTime),
        mocMedianizerAddr
    );

    console.log("ALL DONE");
}

module.exports.tags=[version];

