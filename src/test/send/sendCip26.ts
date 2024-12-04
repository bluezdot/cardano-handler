import {BlockfrostProvider, MeshTxBuilder, mnemonicToEntropy, resolveSlotNo} from '@meshsdk/core';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";

const SEND_TOKEN = 'lovelace'
const SEND_AMOUNT = '150000000';
const RECEIVER = 'addr_test1qzkjkwkyuvqh4hanewcych985euzqnd24jt2ej4kdyqpphr6hx9nax27yydcv9djgekn4ylvq60f6c830ng77dp5af2qrphdqh';
const SENDER = 'addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j';
const API_KEY = 'preprodcnP5RADcrWMlf2cQe4ZKm4cjRvrBQFXM';

const SEND_TOKEN2 = '3d64987c567150b011edeed959cd1293432b7f2bc228982e2be395f70014df10426c7565646f742043617264616e6f'
const SEND_AMOUNT2 = '4321000000000';

function harden(num: number): number {
    return 0x80000000 + num;
}

// config time to live
function getSlot(minutes: number) {
    const nowDateTime = new Date();
    const dateTimeAdd5Min = new Date(nowDateTime.getTime() + minutes*60000);

    return resolveSlotNo('preprod', dateTimeAdd5Min.getTime())
}

async function main() {
    // 1. Keyring
    const mnemonic = 'north until topple blame bracket potato hawk repeat pyramid mutual question barely unfair fox office history famous marriage acid undo useful sail play trend';
    const entropy = mnemonicToEntropy(mnemonic);
    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, 'hex'),
        Buffer.from(''),
    );
    const accountKey = rootKey
        .derive(harden(1852))
        .derive(harden(1815))
        .derive(harden(0));
    const paymentPrvKey = accountKey
        .derive(0)
        .derive(0).to_raw_key();
    const paymentPubKey = accountKey
        .derive(0)
        .derive(0)
        .to_public();
    const stakeKey = accountKey
        .derive(2) // chimeric
        .derive(0)
        .to_public();
    const baseAddress = CardanoWasm.BaseAddress.new(
        CardanoWasm.NetworkInfo.testnet_preprod().network_id(),
        CardanoWasm.Credential.from_keyhash(paymentPubKey.to_raw_key().hash()),
        CardanoWasm.Credential.from_keyhash(stakeKey.to_raw_key().hash()),
    );
    const address = baseAddress.to_address().to_bech32();

    // 2. Build tx
    const blockchainProvider = new BlockfrostProvider(API_KEY);
    const utxos = await blockchainProvider.fetchAddressUTxOs(SENDER);
    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        evaluator: blockchainProvider
    });
    const unsignedTx = await txBuilder
        .txOut(RECEIVER, [
            {
                unit: SEND_TOKEN2,
                quantity: SEND_AMOUNT2
            }
        ])
        .changeAddress(SENDER)
        .selectUtxosFrom(utxos)
        .invalidHereafter(Number(getSlot(15)))
        .complete();
    console.log('[i] unsignedTx', unsignedTx)
    // const signedMsg = paymentPrvKey.sign(Buffer.from(unsigned)); This method return WitnessesSetHash

    const cslUnsignedTx = CardanoWasm.FixedTransaction.from_hex(unsignedTx);
    cslUnsignedTx.sign_and_add_vkey_signature(CardanoWasm.PrivateKey.from_hex(paymentPrvKey.to_hex()))

    const signedTx = cslUnsignedTx.to_hex();
    console.log('[i] csl', signedTx)

    const txHash = await blockchainProvider.submitTx(signedTx);
    console.log(txHash);
}

main().catch((error) => {console.log('error', error)})
