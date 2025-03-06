import axios from "axios";
import { FeatureType, GroupFeatureType, MetaPagination, ProductFavorite, ProductType } from "../pages/type";

export const api = axios.create({ baseURL: "http://localhost:3333", timeout: 5000 });

export const get_products = async ({ product_id, store_id, name, order_by, category_id, page = 1, limit = 10 }: {
    product_id?: string, store_id?: string, name?: string,
    order_by?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc',
    category_id?: string, page?: number, limit?: number
}) => {
    const searchParams = new URLSearchParams()
    if (product_id) searchParams.set('product_id', product_id)
    if (store_id) searchParams.set('store_id', store_id)
    if (name) searchParams.set('name', name)
    if (order_by) searchParams.set('order_by', order_by)
    if (category_id) searchParams.set('category_id', category_id)
    if (page) searchParams.set('page', page.toString())
    if (limit) searchParams.set('limit', limit.toString())

    console.log({ searchParams: searchParams.toString() });

    try {
        const { data: products } = await api.get<{ list: ProductType[], meta: MetaPagination }>('/get_products?' + searchParams.toString());

        console.log({ products: products });

        type ProductClient = 'barred_price' | 'description' | 'name' | 'id' | 'price' | 'currency' | 'default_feature_id';

        function minimize(product: ProductType): Pick<ProductType, ProductClient> {
            const { barred_price, description, name, id, price, currency, default_feature_id } = product;
            return { barred_price, description, name, id, price, currency, default_feature_id };
        }

        return products.list.map(minimize);
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :" + error);
        return [];
    }
};


export const get_features_with_values = async ({ product_id, feature_id }: { product_id?: string, feature_id?: string }) => {
    const searchParams = new URLSearchParams()
    if (product_id) searchParams.set('product_id', product_id)
    if (feature_id) searchParams.set('feature_id', feature_id)
    try {
        const { data: features } = await api.get<{ list: FeatureType[], meta: MetaPagination }>('/get_features_with_values?' + searchParams.toString());
        return features.list
    } catch (error) {
        console.error("Erreur lors de la récupération des features :", error);
        return [];
    }
}


export const get_group_features = async ({ product_id, group_feature_id }: { group_feature_id?: string, product_id?: string }) => {
    const searchParams = new URLSearchParams()
    if (product_id) searchParams.set('product_id', product_id)
    if (group_feature_id) searchParams.set('feature_id', group_feature_id)
    try {
        const { data: features } = await api.get<{ list: GroupFeatureType[], meta: MetaPagination }>('/get_group_features?' + searchParams.toString());
        return features.list
    } catch (error) {
        console.error("Erreur lors de la récupération des features :", error);
        return [];
    }
}
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**********favoris */
export const create_favorite = async (data: { product_id: string, user_id?: string }) => {
    data.user_id = "51fe76c5-0ab8-48c2-b579-a163b82ef86c"
    const formData = new FormData();
    formData.append('user_id', data.user_id)
    formData.append('product_id', data.product_id)
    try {
        const { data: favorite } = await api.post<{ id: string }>('/create_favorite', formData);
       await delay(1000)
        return !!favorite.id
    } catch (error) {
        console.error("Erreur lors de l'ajout de favoris :", error);
        return [];
    }
}

export const delete_favorite = async (id: string) => {
    // data.user_id = "85565855-91d0-4c20-ae01-7b2b7ab0e175"
    // const formData = new FormData();
    // formData.append('user',data.user_id)
    // formData.append('product_id',data.product_id)
    try {
        const { data: favorite } = await api.delete<{ isDeleted: boolean }>('/delete_favorite/' + id);
        await delay(1000)
        return favorite.isDeleted
    } catch (error) {
        console.error("Erreur lors du retrait du favoris :", error);
        return [];
    }
}

export const get_favorites = async ({ user_id, label, product_id, order_by, page = 1, limit = 10 }: {
    user_id?: string, label?: string, product_id?: string,
    order_by?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc',
    page?: number, limit?: number
}) => {
    const searchParams = new URLSearchParams()
    if (user_id) searchParams.set('user_id', user_id)
    if (product_id) searchParams.set('product_id', product_id)
    if (label) searchParams.set('label', label)
    if (order_by) searchParams.set('order_by', order_by)
    if (page) searchParams.set('page', page.toString())
    if (limit) searchParams.set('limit', limit.toString())
    try {
        const { data: favorites } = await api.get<{ list: ProductFavorite[] }>('/get_favorites?' + searchParams.toString());
        await  delay(3000)
        return favorites.list
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        return [];
    }
}
