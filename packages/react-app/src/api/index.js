import axios from 'axios';
import { ZAPPER_BASE_URL, ZAPPER_KEY, ZAPPER_PRICE_API, ZK_SWAP_BASE_URL } from '../constants';

// https://api.zapper.fi/api/static/index.html
// https://docs.zapper.fi/zapper-api/api-guides/supported-tokens-and-prices
export const getZapperTokenPrices = () => axios.get(`${ZAPPER_PRICE_API}?api_key=${ZAPPER_KEY}`)

export const getZapperGasPrices = (network) => axios.get(`${ZAPPER_BASE_URL}/v1/gas-price?api_key=${ZAPPER_KEY}&network=${network}`)


// https://en.wiki.zks.org/interact-with-zkswap/restful-api#get-token-list
export const getZksTokens = (network) => axios.get(`${ZK_SWAP_BASE_URL}/${network || 3}/tokens`)