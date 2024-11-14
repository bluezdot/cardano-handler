//    "@emurgo/cardano-serialization-lib-nodejs": "^13.1.0",

import { Address } from '@emurgo/cardano-serialization-lib-nodejs'

console.log(isCardanoTestnetAddress('addr_test1qr3nhq5hu88xjls8kyk790rcz2qt43aee9yuvx2gjn5msgfjwcw036s7adnz3f8ufl85guxkhz3cvv4znrvy7rzmv0qquff93j'));

export function isCardanoTestnetAddress (address: string): boolean {
    try {
        const isMatchFormat = address.startsWith('addr_test1');
        const isCanDecrypted = !!Address.from_bech32(address).to_bech32();

        return isMatchFormat && isCanDecrypted;
    } catch (e) {
        return false;
    }
}