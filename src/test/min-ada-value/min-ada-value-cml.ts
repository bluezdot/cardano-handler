import * as cml from "@dcspark/cardano-multiplatform-lib-nodejs";

async function main() {
    function adaMin () {
        const receiver = cml.Address.from_bech32('addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95');
        const txOut = cml.TransactionOutput.new(receiver, cml.Value.new(BigInt('159826921'), cml.MultiAsset.new()));
        const minAdaRequired = cml.min_ada_required(txOut, BigInt('4310'))
        console.log('minAdaRequired', minAdaRequired);
    }

    function cnaMin () {
        const receiver = cml.Address.from_bech32('addr_test1qpcv6j0wl3mlypw4udf2z74v4k8reklslx8020q0qzqc0wxmmnlwawkxjzctt94jmpcqysmt8xy35dm4hgyk3yua2uqsh49j95');
        const txOut = cml.TransactionOutput.new(receiver, cml.Value.new(BigInt('159826921'), cml.MultiAsset.new().insert_assets(cml.ScriptHash.from_bech32('3d64987c567150b011edeed959cd1293432b7f2bc228982e2be395f70014df10426c7565646f742043617264616e6f'), cml.MapAssetNameToCoin.new().insert(cml.AssetName.from_str('Bluedot'), BigInt('1233123')))));
        const minAdaRequired = cml.min_ada_required(txOut, BigInt('4310'))
        console.log('minAdaRequired', minAdaRequired);
    }

    adaMin();
}

main()