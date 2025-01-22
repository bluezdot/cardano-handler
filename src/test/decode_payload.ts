import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';

async function main() {
    const unsignedTxHex = '84a300d9010281825820ad591b6fde8c849504039a12f2c3a0b3d6e070c3de73d4cfec754ca52bf7a8cf00018182583900ad2b3ac4e3017adfb3cbb04c5ca7a678204daaac96accab6690010dc7ab98b3e995e211b8615b2466d3a93ec069e9d60f17cd1ef3434ea541a00b494af021a00028651a0f5f6';
    const signedTxHex = '84a300d90102818258202a27ceb978865b5cd2739b0df0c9c0ca3b9a5bfcd3254c5636244c6e270ee56701018282583900ad2b3ac4e3017adfb3cbb04c5ca7a678204daaac96accab6690010dc7ab98b3e995e211b8615b2466d3a93ec069e9d60f17cd1ef3434ea541a08f0d18082583900e33b8297e1ce697e07b12de2bc781280bac7b9c949c6194894e9b82132761cf8ea1eeb6628a4fc4fcf4470d6b8a38632a298d84f0c5b63c01ad0879002021a0002917da100d901028182582071b142f3a8f17b70cbc5ffa7aa6a4fb56ed7d5dd7319ce3b44bc9b158ce0c4e9584077dab03abf5a93f6e2a977e18509e0064a40bc77bb647bc2cd521d1a319350e28391a172d434c0f0c35ee06b60d905c1391928fc4464d3de6f4065bcf7199300f5f6';
    const unsignedCip26TxHex = '84a400d90102828258207a8dce45aad6e4fdf73bf7dc9152b14319c56c9d86c86bcc45188c62729cf4f100825820e5a76ca7ac949345ab5d437d98c7b194100fa25770d65deb4f1bb1a24c5a749d000182825839001e8d3ca1a458c62692e811144ae0bb5620fd2160012eb7b88c2b760c82218abf33dba0647a1b0eb63d732003cbf4543c3d8fbc612506e894821a0012dfeaa1581c3d64987c567150b011edeed959cd1293432b7f2bc228982e2be395f7a1530014df10426c7565646f742043617264616e6f1b00000010ff239a0082583900ad2b3ac4e3017adfb3cbb04c5ca7a678204daaac96accab6690010dc7ab98b3e995e211b8615b2466d3a93ec069e9d60f17cd1ef3434ea54821a596580fba1581c3d64987c567150b011edeed959cd1293432b7f2bc228982e2be395f7a1530014df10426c7565646f742043617264616e6f1b000000407e7c9200021a0002ae05031a04cd53dda0f5f6';

    const unsignedTx = CardanoWasm.Transaction.from_hex(unsignedTxHex).to_json();
    const signedTx = CardanoWasm.Transaction.from_hex(signedTxHex).to_json();
    const unsignedCip26Tx = CardanoWasm.Transaction.from_hex(unsignedCip26TxHex).to_json();

    console.log('[unsignedTx],', unsignedTx);
    console.log('[signedTx],', signedTx);
    console.log('[unsignedCip26Tx],', unsignedCip26Tx);
}

main()
