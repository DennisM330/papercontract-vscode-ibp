/*
* Use this file for functional testing of your smart contract. 
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here 
* to generate tests, including those functions that would 
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building 
* further functional tests to run as part of a continuous 
* integration pipeline, or for debugging locally deployed smart 
* contracts by invoking/submitting individual transactions. 
*/
/*
* Generating this test file will also trigger an npm install 
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are 
* required for this test file to be run locally. 
*/

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const yaml = require('js-yaml');
const fs = require('fs-extra');

describe('org.papernet.commercialpaper-papercontract@0.0.1' , () => {

    const gateway = new fabricNetwork.Gateway();
    let connectionProfile;
    const wallet = new fabricNetwork.InMemoryWallet();
    const identityName = 'papercontract@0.0.2';
    
    before(async () => {
        const connectionProfilePath = '/Users/drmiller/.fabric-vscode/local_fabric/connection.json';
        const certificatePath = '/Users/drmiller/.fabric-vscode/local_fabric/certificate';
        const privateKeyPath = '/Users/drmiller/.fabric-vscode/local_fabric/privateKey';

        const connectionProfileContents = await fs.readFile(connectionProfilePath, 'utf8');
        if (connectionProfilePath.endsWith('.json')) {
            connectionProfile = JSON.parse(connectionProfileContents);
        } else if (connectionProfilePath.endsWith('.yaml') || connectionProfilePath.endsWith('.yml')) {
            connectionProfile = yaml.safeLoad(connectionProfileContents);
        };
        const certificate = await fs.readFile(certificatePath, 'utf8');
        const privateKey = await fs.readFile(privateKeyPath, 'utf8');

        const clientOrganization = connectionProfile.client.organization;
        const mspid = connectionProfile.organizations[clientOrganization].mspid;
        await wallet.import(identityName, fabricNetwork.X509WalletMixin.createIdentity(mspid, certificate, privateKey));

    });

    beforeEach(async () => {
        await gateway.connect(connectionProfile, {
            wallet: wallet,
            identity: identityName,
            discovery: {
                asLocalhost: true
            }
        });
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    it('createContext', async () => {
        // TODO: Update with parameters of transaction
        const args = [''];

        const response = await submitTransaction('createContext', args); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('instantiate', async () => {
        // TODO: Update with parameters of transaction
        const args = [''];

        const response = await submitTransaction('instantiate', args); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('issue', async () => {
        // TODO: Update with parameters of transaction
        const args = ['MillerCorp5', '00007', '2020-05-31', '2020-11-30', '5000000'];

        const response = await submitTransaction('issue', args); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
        console.log('Process issue transaction response.');
        const CommercialPaper = require('../lib/paper.js');
        let paper = CommercialPaper.fromBuffer(response);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

    }).timeout(50000);

    it('buy', async () => {
        // TODO: Update with parameters of transaction
        const args = ['MillerCorp5', '00007', 'MillerCorp5', 'DigiBank', '4900000', '2020-05-31'];

        const response = await submitTransaction('buy', args); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
        console.log('Process buy transaction response.');
        const CommercialPaper = require('../lib/paper.js');
        let paper = CommercialPaper.fromBuffer(response);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
        console.log('Transaction complete.');

    }).timeout(50000);

    it('redeem', async () => {
        // TODO: Update with parameters of transaction
        const args = ['MillerCorp5', '00007', 'DigiBank', '2020-11-30'];

        const response = await submitTransaction('redeem', args); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
        console.log('Process redeem transaction response.');
        const CommercialPaper = require('../lib/paper.js');
        let paper = CommercialPaper.fromBuffer(response);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully redeemed with ${paper.owner}`);
        console.log('Transaction complete.');
    

    }).timeout(50000);

    async function submitTransaction(functionName, args) {
        // Submit transaction
        const network = await gateway.getNetwork('mychannel');
        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');
        const responseBuffer = await contract.submitTransaction(functionName, ...args);
        return responseBuffer;
    }

});