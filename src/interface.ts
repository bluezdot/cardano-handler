export interface AccountInfo {
    mnemonic: string
    address_main: string,
    address_test: string,
    stake_main: string,
    stake_test: string
}

export interface API {
    mainnet: string,
    testnet: string
}