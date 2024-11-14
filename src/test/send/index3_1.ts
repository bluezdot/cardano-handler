import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import {mnemonicToEntropy} from "@meshsdk/core";
import {getAddressUtxosAsset} from "../../data-fetching-manager/address-manager";

function harden(num: number): number {
    return 0x80000000 + num;
}

// CONFIG
const AMOUNT_SEND = '9690750';
const RECEIVER = 'addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95'

// 1. Keyring
const mnemonic = 'north until topple blame bracket potato hawk repeat pyramid mutual question barely unfair fox office history famous marriage acid undo useful sail play trend';
const entropy = mnemonicToEntropy(mnemonic);
const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, 'hex'),
    Buffer.from(''),
);
const accountKey = rootKey
    .derive(harden(1852)) // purpose
    .derive(harden(1815)) // coin type
    .derive(harden(0)); // account #0

const utxoPubKey = accountKey
    .derive(0) // external
    .derive(0)
    .to_public();

const stakeKey = accountKey
    .derive(2) // chimeric
    .derive(0)
    .to_public();
const baseAddress = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.testnet_preprod().network_id(),
    CardanoWasm.Credential.from_keyhash(utxoPubKey.to_raw_key().hash()),
    CardanoWasm.Credential.from_keyhash(stakeKey.to_raw_key().hash()),
);
const address = baseAddress.to_address().to_bech32();

// 2. Build Tx
const linearFee = CardanoWasm.LinearFee.new(
    CardanoWasm.BigNum.from_str('44'), // get from blockfrost api
    CardanoWasm.BigNum.from_str('155381') // get from blockfrost api
);

const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
    .fee_algo(linearFee)
    .coins_per_utxo_byte(CardanoWasm.BigNum.from_str('4310')) // coins_per_utxo_word/8 ?
    .pool_deposit(CardanoWasm.BigNum.from_str('500000000')) // get from blockfost api
    .key_deposit(CardanoWasm.BigNum.from_str('2000000')) // get from blockfrost api
    .ex_unit_prices(
        CardanoWasm.ExUnitPrices.new(
            CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str('577'), CardanoWasm.BigNum.from_str('10000')), // get from blockfrost api
            CardanoWasm.UnitInterval.new(CardanoWasm.BigNum.from_str('721'), CardanoWasm.BigNum.from_str('10000000')), // get from blockfrost api
        ),
    )
    .max_value_size(5000) // get from blockfrost api
    .max_tx_size(16384) // get from blockfrost api
    .build()
const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig)

// getAddressUtxosAsset(address, 'lovelace').then((u) => console.log(u)) // todo: get utxos by this
const utxos = [
    {
        address: 'addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j',
        tx_hash: '53ceb3b3417dd6d0e1e7e130bbd29414fb1fc96cf2c3c988fc0a345083c5cf98',
        tx_index: 1,
        output_index: 1,
        amount: [ [Object] ],
        block: '3b93fad2e37dff76aa9c71847fd9f3bb357de25419f396656dc6f2f4ed6bf15f',
        data_hash: null,
        inline_datum: null,
        reference_script_hash: null
    }
]

const txInput = CardanoWasm.TransactionInput.new(
    CardanoWasm.TransactionHash.from_hex(utxos[0].tx_hash),
    utxos[0].output_index
)
const inputs = CardanoWasm.TransactionInputs.new();
inputs.add(txInput);

const txOutput = CardanoWasm.TransactionOutput.new(
    CardanoWasm.Address.from_bech32(RECEIVER),
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(AMOUNT_SEND))
)
const txOutputChange = CardanoWasm.TransactionOutput.new(
    baseAddress.to_address(),
    CardanoWasm.Value.new(CardanoWasm.BigNum.from_str((BigInt(100000000) - BigInt(AMOUNT_SEND) - BigInt(linearFee.constant().to_str())).toString()))
)

const outputs = CardanoWasm.TransactionOutputs.new();
outputs.add(txOutput);

const txBody = CardanoWasm.TransactionBody.new_tx_body(
    inputs,
    outputs,
    linearFee.constant())

const signedTx = CardanoWasm.Transaction.new(
    CardanoWasm.TransactionBody.from_bytes(txBody.to_bytes()),
    CardanoWasm.TransactionWitnessSet.from_bytes()
)