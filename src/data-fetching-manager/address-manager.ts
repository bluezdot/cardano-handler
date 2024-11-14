import { getBlockFrostApi, isCardanoTestnetAddress } from "../utils";

// Balance
export async function getAddressInfo (address: string) {
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addresses(address);
    } catch (error) {
        console.error(error);
    }
}

// noted:
// Không check được balance của Address derived?

// Balance và extra info
export async function getAddressExtendedInfo (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesExtended(address);
    } catch (error) {
        console.error(error);
    }
}

// Balance tổng nhận và gửi
export async function getAddressDetailsInfo (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesTotal(address);
    } catch (error) {
        console.error(error);
    }
}

// List Utxos
export async function getAddressUtxos (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesUtxos(address);
    } catch (error) {
        console.error(error);
    }
}

// List Utxos của asset
export async function getAddressUtxosAsset (address: string, asset: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesUtxosAsset(address, asset);
    } catch (error) {
        console.error(error);
    }
}

// List transactions
export async function getAddressTxs (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesTransactions(address);
    } catch (error) {
        console.error(error);
    }
}
