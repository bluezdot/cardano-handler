import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';

async function sendADA(senderPrivateKey: CardanoWasm.PrivateKey, recipientAddress: string, adaAmount: string, unspentOutputs: string[], changeAddress: string): Promise<string> {
    // Set up the TransactionBuilder configuration
    const linearFee = CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str('44'),
        CardanoWasm.BigNum.from_str('155381')
    );
    const txBuilderConfig = CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo(linearFee)
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'))
        .key_deposit(CardanoWasm.BigNum.from_str('2000000'))
        .max_value_size(4000)
        .max_tx_size(8000)
        .coins_per_utxo_byte(CardanoWasm.BigNum.from_str('34482'))
        .build();

    const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderConfig);

    // Add ADA output
    const outputAddress = CardanoWasm.Address.from_bech32(recipientAddress);
    const output = CardanoWasm.TransactionOutputBuilder.new()
        .with_address(outputAddress)
        .next()
        .with_value(CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(adaAmount)))
        .build();
    txBuilder.add_output(output);

    // Add inputs from unspent outputs
    const unspentOutputsArray = unspentOutputs.map(Buffer.from);
    const utxos = CardanoWasm.TransactionUnspentOutputs.new();
    unspentOutputsArray.forEach(utxo => {
        const txHash = CardanoWasm.TransactionHash.from_bytes(Buffer.from(utxo.slice(0, 64), 'hex'));
        const index = parseInt(utxo.slice(64), 16);
        const value = CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(utxo.slice(66)));
        utxos.add(CardanoWasm.TransactionUnspentOutput.new(txHash, index, value));
    });
    txBuilder.add_inputs_from_and_change(utxos);

    // Calculate change if needed
    txBuilder.add_change_if_needed(changeAddress);

    // Build and finalize the transaction
    const txBody = txBuilder.build();
    const txHash = CardanoWasm.hash_transaction(txBody);
    const witnesses = CardanoWasm.TransactionWitnessSet.new();
    const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
    const vkeyWitness = CardanoWasm.make_vkey_witness(txHash, senderPrivateKey);
    vkeyWitnesses.add(vkeyWitness);
    witnesses.set_vkeys(vkeyWitnesses);

    const transaction = CardanoWasm.Transaction.new(
        txBody,
        witnesses,
        undefined // No metadata in this example
    );

    return Buffer.from(transaction.to_bytes()).toString('hex');
}

// Usage example
const senderPrivateKey = CardanoWasm.PrivateKey.from_bech32('your_sender_private_key');
const recipientAddress = 'addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95';
const adaAmount = '100000'; // 1 ADA in lovelace
const unspentOutputs = ['your_first_utxo', 'your_second_utxo'];
const changeAddress = 'addr_test1qqzf7fhgm0gf370ngxgpskg5c3kgp2g0u4ltxlrmsvumaztv3ck06k550q64lgwkqavljd63yda0x2va074fguprujfs43mc83'];

sendADA(senderPrivateKey, recipientAddress, adaAmount, unspentOutputs, changeAddress)
    .then(txHex => console.log('Transaction hash:', txHex))
    .catch(error => console.error('Error:', error));