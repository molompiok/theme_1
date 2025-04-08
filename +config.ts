import vike from 'vike/plugin';
import type { Config } from 'vike/types'

export default {
    //@ts-ignore
  passToClient: ['dehydratedState'], // Ajoutez dehydratedState ici
} satisfies Config