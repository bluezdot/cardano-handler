import {BlockfrostProvider, MeshTxBuilder, MeshWallet, UtxoSelection} from '@meshsdk/core';
import {csl} from "@meshsdk/core-csl";

const SEND_AMOUNT = '150000000';
const RECEIVER = 'addr_test1qzkjkwkyuvqh4hanewcych985euzqnd24jt2ej4kdyqpphr6hx9nax27yydcv9djgekn4ylvq60f6c830ng77dp5af2qrphdqh';
const SENDER = 'addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j';
const MNEMONIC = 'north until topple blame bracket potato hawk repeat pyramid mutual question barely unfair fox office history famous marriage acid undo useful sail play trend';
const API_KEY = 'preprodcnP5RADcrWMlf2cQe4ZKm4cjRvrBQFXM';

async function main() {
    const blockchainProvider = new BlockfrostProvider(API_KEY);
    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        key: {
            type: 'mnemonic',
            words: MNEMONIC.split(' ')
        },
    });

    // 1. Use MeshJS
    // const utxos = await wallet.getUtxos('payment');
    // 2. Get manually
    const utxos = await blockchainProvider.fetchAddressUTxOs(SENDER);

    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        evaluator: blockchainProvider,
        verbose: false,
    });

    const unsignedTx = await txBuilder
        .txOut(RECEIVER, [
            {
                unit: 'lovelace',
                quantity: SEND_AMOUNT
            }
        ])
        .changeAddress(SENDER)
        .selectUtxosFrom(utxos)
        .complete();

    const params = await blockchainProvider.fetchProtocolParameters();
    const coefficientFee = params.minFeeA;
    const constantFee = params.minFeeB;

    const txFee = csl.Transaction.from_hex(unsignedTx).body().fee().to_str();

    const signedTx = wallet.signTx(unsignedTx); // cbor
    const txHash = await wallet.submitTx(signedTx);
    console.log('txHash', txHash);
}

main().catch((error) => {console.log('error', error)})

// interface CardanoTxConfig {
//     provider: string,
//     isTestnet: boolean,
//     policyId: string,
//     amount: string,
//     receiver: string,
//     sender: string
// }