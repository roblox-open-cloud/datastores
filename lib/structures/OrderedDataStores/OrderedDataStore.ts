import type { ListEntriesResponse, ListEntriesResponseItem } from '@roblox-open-cloud/api-types/v1';
import type { DataStoreService } from "#lib/DataStoreService";
import type { OrderedDataStoreListParameters } from "#lib/types/parameters";
import { OrderedDataStoreEntry } from "#lib/structures/OrderedDataStores/OrderedDataStoreEntry";
import { setParams } from "#lib/util/setParams";
import { request } from "#lib/util/request";
import { BASE_API_URL } from "#lib/util/constants";
import path from 'path';

export class OrderedDataStore {
    /** The name of the ordered datastore. */
    public readonly name: string;
    /**
     * The scope of the ordered datastore.
     * @default 'global'
     */
    public readonly scope: string;

    /** An array of ordered datastore entry values. */
    public data: OrderedDataStoreEntry[] | never[];
    /** Whether or not the pagination was finished. */
    public isFinished: boolean;
    /** The token for the next entries page. */
    public nextPageToken: string;

    /** The URL that is used to make requests. */
    private readonly _url: URL;
    /** The datastore service, used for the universeId and apiKey. */
    protected readonly _service: DataStoreService;

    constructor(details: { name: string, scope: string, parameters: OrderedDataStoreListParameters }, service: DataStoreService) {
        this.name = details.name;
        this.scope = details.scope;

        this.data = [];
        this.isFinished = false;
        this.nextPageToken = '';

        // We only need to set the parameters once.
        this._url = new URL(`/ordered-data-stores/v1/universes/${service._universeId}/orderedDataStores/${this.name}/scopes/${this.scope}/entries`, BASE_API_URL);
        setParams(this._url, details.parameters);

        this._service = service;
    }

    /** Fetch the next page of the ordered datastore. */
    public async fetchNextPage() {
        if (this.isFinished) return this;

        this._url.searchParams.set('page_token', this.nextPageToken);

        const response = await request(this._url, {
            method: 'GET',
            headers: {
                'x-api-key': this._service._apiKey
            }
        });

        const data: {} | ListEntriesResponse = await response.json();

        if (!('entries' in data)) {
            this.isFinished = true;
            return this;
        }

        this.data = data.entries.map((entry: ListEntriesResponseItem) => new OrderedDataStoreEntry({
            id: entry.id,
            value: entry.value,
            path: entry.path
        }, this)) || [];
        this.nextPageToken = data.nextPageToken;
        this.isFinished = !data.nextPageToken.length;

        return this;
    }

    public async create(id: string, value: number) {
        const url = new URL(this._url.pathname, BASE_API_URL);
        url.searchParams.set('id', id);

        const response = await request(url, {
            method: 'POST',
            headers: {
                'x-api-key': this._service._apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ value: value })
        });

        const data: ListEntriesResponseItem = await response.json();

        return new OrderedDataStoreEntry(data, this);
    }

    public async get(id: string) {
        const url = new URL(`${this._url.pathname}/${id}`, BASE_API_URL);

        const response = await request(url, {
            method: 'GET',
            headers: {
                'x-api-key': this._service._apiKey
            }
        });

        const data: ListEntriesResponseItem = await response.json();
        return new OrderedDataStoreEntry(data, this);
    }

    public async delete(id: string) {
        const url = new URL(`${this._url.pathname}/${id}`, BASE_API_URL);

        const response = await request(url, {
            method: 'DELETE',
            headers: {
                'x-api-key': this._service._apiKey,
                'content-type': 'application/json'
            }
        }).catch(() => null);

        if (!response) return false;

        return true;
    }

    public async update(id: string, value: number, allowMissing: boolean = false) {
        // Entries can only support up to Int64.
        if (value > BigInt(9223372036854775807n)) {
            throw new Error(`Number is bigger than Int64`);
        }

        const url = new URL(`${this._url.pathname}/${id}`, BASE_API_URL);
        if (allowMissing) url.searchParams.set('allow_missing', 'true');

        const response = await request(url, {
            method: 'PATCH',
            headers: {
                'x-api-key': this._service._apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ value })
        });

        const data: ListEntriesResponseItem = await response.json();
        return new OrderedDataStoreEntry(data, this);
    }
}