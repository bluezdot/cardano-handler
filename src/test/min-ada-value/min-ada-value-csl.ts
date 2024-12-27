import * as csl from "@emurgo/cardano-serialization-lib-nodejs";

async function main() {
    function adaMin() {
        const receiver = csl.Address.from_bech32('addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95');
        const txOut = csl.TransactionOutput.new(receiver, csl.Value.new(csl.BigNum.from_str('159826921')));
        const dataCost = csl.DataCost.new_coins_per_byte(csl.BigNum.from_str("4310"))
        const minAdaForOutput = csl.min_ada_for_output(txOut, dataCost)
        console.log('minAdaForOutput', minAdaForOutput.to_str());
    }

    function cnaMin() {
        const receiver = csl.Address.from_bech32('addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95');
        const assets = csl.Assets.new();
        assets.insert(
            csl.AssetName.new(Buffer.from("0014df10426c7565646f742043617264616e6f", "hex")),
            csl.BigNum.from_str('159826921')
        )
        const multiAsset = csl.MultiAsset.new();
        multiAsset.insert(
            csl.ScriptHash.from_hex('3d64987c567150b011edeed959cd1293432b7f2bc228982e2be395f7'),
            assets
        )
        const value = csl.Value.new_from_assets(multiAsset)
        const txOut = csl.TransactionOutput.new(receiver, value);
        const dataCost = csl.DataCost.new_coins_per_byte(csl.BigNum.from_str("4310"))
        const minAdaForOutput = csl.min_ada_for_output(txOut, dataCost)
        console.log('minAdaForOutput', minAdaForOutput.to_str());
    }

    adaMin();
    cnaMin();
}

main()

// Notification service
// Ton, Cardano blockchain
// Improve middleware service: Block action, patch chainlist
// Avail Bridge
// Validate recipient address
// Debug: XCM, Unified account, Earning