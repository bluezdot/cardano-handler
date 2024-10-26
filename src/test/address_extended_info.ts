import {getAddressExtendedInfo} from "../data-fetching-manager/address-manager";
import {ACCOUNT_1} from "../const";

getAddressExtendedInfo(ACCOUNT_1.address_main).then(res => console.log(res));