import { Address } from "@emurgo/cardano-serialization-lib-nodejs";
import {API_KEY} from "./const";
import {BlockFrostAPI} from "@blockfrost/blockfrost-js";

export function isCardanoAddress (address: string): boolean {
    try {
        return isCardanoMainnetAddress(address) || isCardanoTestnetAddress(address);
    } catch (e) {
        return false;
    }
}

export function isCardanoMainnetAddress (address: string): boolean {
    try {
        const isMatchFormat = address.startsWith('addr1');
        const isCanDecrypted = !!Address.from_bech32(address).to_bech32();

        return isMatchFormat && isCanDecrypted;
    } catch (e) {
        return false;
    }
}

export function isCardanoTestnetAddress (address: string): boolean {
    try {
        const isMatchFormat = address.startsWith('addr_test1');
        const isCanDecrypted = !!Address.from_bech32(address).to_bech32();

        return isMatchFormat && isCanDecrypted;
    } catch (e) {
        return false;
    }
}

export function getUrlByNetwork (isTestnet: boolean) {

}

export function getBlockFrostApi (isTestnet = true) {
    const projectId = isTestnet ? API_KEY.testnet : API_KEY.mainnet;

    return new BlockFrostAPI({
        projectId
    });
}
