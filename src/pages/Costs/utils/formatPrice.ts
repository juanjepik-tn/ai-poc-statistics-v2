/**
 * Formatea el precio según el país de la tienda
 * @param storeCountry - Código del país de la tienda
 * @param currency - Símbolo de la moneda
 * @param costPerChat - Costo por chat
 * @returns string - Precio formateado
 */
export function formatPrice(storeCountry: string, currency: string, costPerChat: string | number): string {
    return storeCountry === 'BR'
        ? `${currency}$ ${costPerChat}`
        : `$${costPerChat} ${currency}`;
} 