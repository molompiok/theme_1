import { api } from ".";
import { Category, MetaPagination } from "../pages/type";

export const get_categories = async ({ category_id, search, slug, store_id ,  order_by, page , limit  }: {
    product_id?: string, store_id?: string, search?: string, slug?: string, 
    order_by?: 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc',
    category_id?: string, page?: number, limit?: number
}) => {
    const searchParams = new URLSearchParams()
    if (store_id) searchParams.set('store_id', store_id)
    if (slug) searchParams.set('slug', slug)
    if (search) searchParams.set('search', search)
    if (order_by) searchParams.set('order_by', order_by)
    if (category_id) searchParams.set('category_id', category_id)
    if (page) searchParams.set('page', page.toString())
    if (limit) searchParams.set('limit', limit.toString())


    try {
        const { data: categories } = await api.get<{ list: Category[], meta: MetaPagination }>('/get_categories?' + searchParams.toString());

        // function minimize(product: Category): Category {
        //     const { } = product;
        //     return { barred_price, description, name, id, price, currency, default_feature_id , slug };
        // }
        
        return categories
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :" + error);
        return {
            list  : [],
            meta : {}
        };
    }
};