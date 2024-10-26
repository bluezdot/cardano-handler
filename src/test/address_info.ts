import {ACCOUNT_1, ACCOUNT_3} from "../const";
import {getAddressInfo} from "../data-fetching-manager/address-manager";

getAddressInfo(ACCOUNT_1.address_main).then(res => console.log(res));
getAddressInfo(ACCOUNT_1.address_test).then(res => console.log(res));