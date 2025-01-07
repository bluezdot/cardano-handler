import {BlockfrostProvider, MeshTxBuilder, mnemonicToEntropy} from '@meshsdk/core';
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";

const SEND_TOKEN = 'lovelace'
const SEND_AMOUNT = '1700000';
const RECEIVER = 'addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95';
const SENDER = 'addr_test1qz8rpssupfuyhrr2pp4uuaevs64n0tsfdh57y7ve6fwv2l04px9nwhersygs3dwmvdele4gh305q08pjs42p6j66s5hscxxrsz';
const API_KEY = 'preprodcnP5RADcrWMlf2cQe4ZKm4cjRvrBQFXM';

function harden(num: number): number {
    return 0x80000000 + num;
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
        .derive(harden(1))
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
                unit: SEND_TOKEN,
                quantity: SEND_AMOUNT
            }
        ])
        .changeAddress(SENDER)
        .selectUtxosFrom(utxos, 'experimental', '1000000')
        .complete();

    const cslUnsignedTx = CardanoWasm.FixedTransaction.from_hex(unsignedTx);
    cslUnsignedTx.sign_and_add_vkey_signature(CardanoWasm.PrivateKey.from_hex(paymentPrvKey.to_hex()))

    const signedTx = cslUnsignedTx.to_hex();

    console.log('signedTx', signedTx);
}

main().catch((error) => {console.log('error', error)})
