export interface OrderedDataStoreListParameters {
    max_page_size?: number;
    page_token?: string;
    order_by?: 'desc';
    filter?: string;
}