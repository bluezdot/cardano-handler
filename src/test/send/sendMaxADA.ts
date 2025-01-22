import {BlockfrostProvider, MeshTxBuilder, mnemonicToEntropy} from '@meshsdk/core';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";

const RECEIVER = 'addr_test1qzkjkwkyuvqh4hanewcych985euzqnd24jt2ej4kdyqpphr6hx9nax27yydcv9djgekn4ylvq60f6c830ng77dp5af2qrphdqh';
const SENDER = 'addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j';
const API_KEY = 'preprodcnP5RADcrWMlf2cQe4ZKm4cjRvrBQFXM';

function harden(num: number): number {
    return 0x80000000 + num;
}

async function main() {
    // 1. Keyring
    const mnemonic = 'slogan ridge coffee quiz above front trial differ practice million nuclear grab sister believe deny battle loyal apart tourist sadness soul grief fever reflect';
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

    console.log('utxos', utxos);
    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        evaluator: blockchainProvider
    });
    const unsignedTx = await txBuilder
        .changeAddress(RECEIVER)
        .selectUtxosFrom(utxos)
        .complete();
    console.log('unsignedTx', unsignedTx);

    // const cslFixedTransaction = CardanoWasm.FixedTransaction.from_hex(unsignedTx);
    // cslFixedTransaction.sign_and_add_vkey_signature(CardanoWasm.PrivateKey.from_hex(paymentPrvKey.to_hex()))
    // const signedTx = cslFixedTransaction.to_hex();
    // console.log('signedTx', signedTx)
}

main().catch((error) => {console.log('error', error)})
