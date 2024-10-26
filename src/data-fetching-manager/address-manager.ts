import { getBlockFrostApi, isCardanoTestnetAddress } from "../utils";

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

export async function getAddressExtendedInfo (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesExtended(address);
    } catch (error) {
        console.error(error);
    }
}

export async function getAddressDetailsInfo (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesTotal(address);
    } catch (error) {
        console.error(error);
    }
}

export async function getAddressUtxos (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesUtxos(address);
    } catch (error) {
        console.error(error);
    }
}

export async function getAddressUtxosAsset (address: string, asset: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesUtxosAsset(address, asset);
    } catch (error) {
        console.error(error);
    }
}

export async function getAddressTxs (address: string){
    try {
        const isTestnet = isCardanoTestnetAddress(address);
        const api = getBlockFrostApi(isTestnet);
        return await api.addressesTransactions(address);
    } catch (error) {
        console.error(error);
    }
}
