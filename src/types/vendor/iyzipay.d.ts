declare module 'iyzipay' {
  // Resmi tip paketi yok; kullanılan yüzey src/lib/payment/iyzico.ts içinde sarmalanır.
  class Iyzipay {
    static PAYMENT_GROUP: Record<string, string>;
    static BASKET_ITEM_TYPE: Record<string, string>;
    constructor(config?: Record<string, unknown>);
  }
  export default Iyzipay;
}
