import { OrderedDataStore } from "#lib/structures/OrderedDataStores/OrderedDataStore";
import { OrderedDataStoreListParameters } from "#lib/types/parameters";
import { setParams } from "#lib/util/setParams";

export class DataStoreService {
    public readonly _apiKey: string;
    public readonly _universeId: number;

    /**
     * @param key The API key for using Roblox OpenCloud.
     * @param universe The univese id that you want to publish messages to.
     */
    constructor(key: string, id: number) {
        this._apiKey = key;
        this._universeId = id;
    }

    public getOrderedDataStore(name: string, params: OrderedDataStoreListParameters = {}, scope: string = 'global') {
        const urlParams = new URLSearchParams();
        setParams(urlParams, params);
        
        return new OrderedDataStore({
            name: name,
            scope: scope,
            parameters: params
        }, this);
    }
}