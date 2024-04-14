import { OrderedDataStore } from "#lib/structures/OrderedDataStores/OrderedDataStore";
import { BASE_API_URL } from "#lib/util/constants";

export class OrderedDataStoreEntry {
    /** The id of the datastore entry. */
    public readonly id: string;
    /** The value of the datastore entry. */
    public readonly value: number;

    /** The URL that is used to make requests. */
    private readonly _url: URL;
    /** The original ordered datastore context, to reuse functions. */
    protected readonly _context: OrderedDataStore;

    constructor(details: { id: string, value: string, path: string }, context: OrderedDataStore) {
        this.id = details.id;
        this.value = parseInt(details.value) || 0;
        
        this._url = new URL(details.path, BASE_API_URL);
        this._context = context;
    }

    /** Refetch this specific entry. */
    public async fetch() {
        return this._context.get(this.id);
    }

    /** Removes this specific entry. */
    public async remove() {
        return this._context.delete(this.id);
    }

    /** Updates this specific entry. */
    public async update(value: number, allowMissing: boolean = false) {
        return this._context.update(this.id, value, allowMissing);
    }
}