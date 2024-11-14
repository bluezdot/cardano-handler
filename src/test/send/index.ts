import {TxBuilder} from "@harmoniclabs/plu-ts";
import {BlockFrostAPI} from "@blockfrost/blockfrost-js";

// const blockfrost = new BlockFrostAPI({
//     projectId: 'mainnet6uE9JH3zGYquaxRKA7IMhEuzRUB58uGK'
// })

// const utxos = ...getUtxo

interface CardanoUtxo {
    address: string,
    tx_hash: string,
    tx_index: number,
    output_index: number,
    amount: CardanoBalanceItem[],
    block: string,
    data_hash: string, // todo: recheck
    inline_datum: string, // todo: recheck
    reference_script_hash: string // todo: recheck
}

interface CardanoBalanceItem {
    unit: string,
    quantity: string
}

const txBuilder = new TxBuilder()
const tx = txBuilder.buildSync({
    inputs: [
        { utxo: "0x123456", value: "0x123456" },
    ],
    changeAddress: address, // sender
    outputs: [
        {
            address: "0x123456",
            value: "0x123456",
        }
    ]
})