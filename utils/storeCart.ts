const GUEST_CART_ID_KEY = 'guest_cart_id';

export const getGuestCartId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(GUEST_CART_ID_KEY);
  }
  return null;
};

export const setGuestCartId = (cartId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_CART_ID_KEY, cartId);
  }
};

export const removeGuestCartId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_CART_ID_KEY);
  }
};