import {AppWallet, BlockfrostProvider, MeshTxBuilder, Transaction} from '@meshsdk/core';
import {UTxO} from "@meshsdk/common";

const SEND_AMOUNT = '1500000000';
const RECEIVER = 'addr_test1qzkjkwkyuvqh4hanewcych985euzqnd24jt2ej4kdyqpphr6hx9nax27yydcv9djgekn4ylvq60f6c830ng77dp5af2qrphdqh';
const UTXOS = [{ // todo: create function to fetch lastest utxo and select utxo
    input: {
        txHash: '73b0023a1c84a5c50e21110efa39328e73f57e93981a496ab5d74d23325a9aec',
        outputIndex: 1
    },
    output: {
        address: 'addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j',
        amount: [{
            unit: 'lovelace',
            quantity: "9846492365"
        }]
    }
}] as UTxO[]

async function main() {
    const blockchainProvider = new BlockfrostProvider('preprodcnP5RADcrWMlf2cQe4ZKm4cjRvrBQFXM');
    const wallet = new AppWallet({
        networkId: 0,
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        key: {
            type: 'mnemonic',
            words: 'north until topple blame bracket potato hawk repeat pyramid mutual question barely unfair fox office history famous marriage acid undo useful sail play trend'.split(' ')
        },
    });

    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        evaluator: blockchainProvider,
        verbose: true,
    });

    const unsignedTx = await txBuilder
        .txOut(RECEIVER, [{ unit: 'lovelace', quantity: SEND_AMOUNT }])
        .changeAddress('addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j')
        .selectUtxosFrom(UTXOS)
        .complete();

    const signedTx = wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log('txHash', txHash);
}

main().catch((error) => {console.log('error', error)})