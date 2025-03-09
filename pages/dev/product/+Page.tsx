import React, { useState } from "react";
import { BASE_URL } from "../../../api";

export default function Page() {


    const [categories, setCategories] = useState()
    const [products, setProducts] = useState()

    async function formActionCreatecategorie(formData: FormData) {
        const headers = new Headers()
        headers.set('type', 'application/json');
        headers.set('accept', '*');
        const res = await fetch(BASE_URL + 'create_category', {
            body: formData,
            method: 'POST',
            headers
        })
        const data = await res.json()
    }

    /*************
     * lors de la creation plusieur field sont envoyer dan le formdata pour chaque column d'une table 
     * Exemple : product.views 
     * FOrmData.append('views_0', file_B)
     * FOrmData.append('views_1', file_A)
     * .......... etc
     * nb: l'index du field de formdata doit etre incrementale 0,1,2, etc
     */

    /***
     * update permet d'ajouter supprimer  deplacer les fichiers  dans une ccolumn d'une table en modifiant la tableau de fichier venu
     * du serveur:;
     * pour la suppression => il faut retire du  tableau le lien vers le fichier 
     * pour ajouter => il faut ajouter dans le tableau le nom du field qui contient le fichier dans le formdata , nom du field : column_n
     *      column ex: views , n ex : 1, 2, 3
     * pour deplacer => il suffit juste de deplacer dans le tableau les liens vers les fichiers et et les noms des field des nouveau fichier
     */
    async function formActionCreateProduct(formData: FormData) {
        formData.getAll('views').forEach((v, i) => {
            formData.append('views_' + i, v)
        })
        formData.delete('views')

        const headers = new Headers()
        headers.set('type', 'application/json');
        headers.set('accept', '*');
        const res = await fetch(BASE_URL + 'create_product', {
            body: formData,
            method: 'POST',
            headers
        })
        const data = await res.json()
    }
    return (
        <div className="bg-gray-200 px-3 font-primary">
            <div className="relative flex flex-col gap-12 w-full min-h-dvh pt-10 max-w-[1200px] mx-auto ">

                <form className="min-w-6xl border flex items-stretch flex-col" action={formActionCreatecategorie}>
                    <h1>Creation categorie</h1>
                    <div className="flex flex-col gap-y-3 min-w-[90%] mx-auto p-4">

                        <input type="text" name="parent_id" placeholder="parent id categorie" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                        <input type="text" name="name" placeholder="nom de la categorie" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />

                        <textarea name="description" placeholder="description du produit" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />

                    </div>
                    <button className="bg-gray-400 mx-auto w-[90%] m-2 text-white p-4" type="submit">create categoy</button>
                </form>

                <div>
                    <button className="bg-gray-400 mx-auto w-[90%] m-2 text-white p-4" onClick={async () => {
                        // const res = await fetch(HostName + 'get_categories', {
                        //     method: 'GET',
                        // })
                        // const data = await res.json()
                        // setCategories(data.list)
                    }}>gets categoy</button>
                    <div>
                        {JSON.stringify(categories)}
                    </div>
                </div>

                <form className="min-w-6xl border flex items-stretch flex-col" action={formActionCreateProduct}>
                    <h1>Creation product</h1>
                    <div className="flex flex-col gap-y-3 min-w-[90%] mx-auto p-4">

                        <input type="text" name="category_id" placeholder="categorie id" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                        <input type="text" name="name" placeholder="nom du produit" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                        <div className="flex gap-7">
                            <input type="number" name="price" placeholder="prix du produit" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                            <input type="number" name="barred_price" placeholder="prix barre du produit " className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                        </div>
                        <input type="number" name="stock" placeholder="stock du produit" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />
                        <textarea name="description" placeholder="description du produit" className="px-2 py-3 w-full text-clamp-sm bg-gray-300 rounded-xl" />

                        <input type="file" name="views" id="" multiple max={3} />
                    </div>
                    <button className="bg-gray-400 mx-auto w-[90%] m-2 text-white p-4" type="submit">create product</button>

                </form>


                <div>
                    <button className="bg-gray-400 mx-auto w-[90%] m-2 text-white p-4" onClick={async () => {
                        // const res = await fetch(HostName + 'get_products', {
                        //     method: 'GET',
                        // })
                        // const data = await res.json()
                         
                        // setProducts(data.list)
                    }}>gets products</button>
                    <div>
                        {JSON.stringify(products)}
                    </div>
                </div>

            </div>
        </div>
    );
}
