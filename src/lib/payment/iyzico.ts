/**
 * Iyzico Payment Gateway Client
 *
 * Integration with Iyzico payment API for processing payments,
 * managing transactions, and handling 3D Secure payments.
 *
 * @module lib/payment/iyzico
 * @category Library - Payment
 *
 * Features:
 * - Payment initialization
 * - 3D Secure payment support
 * - Payment verification
 * - Refund processing
 * - Installment support
 *
 * Environment Variables:
 * - IYZICO_API_KEY: Iyzico API key
 * - IYZICO_SECRET_KEY: Iyzico secret key
 * - IYZICO_BASE_URL: API base URL (sandbox or production)
 *
 * @example
 * ```typescript
 * import { IyzicoClient } from './iyzico';
 *
 * const client = new IyzicoClient();
 * const payment = await client.initiatePayment({
 *   amount: 50000,
 *   description: 'VIP Package',
 *   userId: 123,
 * });
 * ```
 */

import Iyzipay from 'iyzipay';
import type {
  IyzicoConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentCompletion,
  BuyerInfo,
  AddressInfo,
  CurrencyCode,
} from './types';
import {
  generateConversationId,
  generatePaymentReference,
  convertFromSmallestUnit,
} from './utils';
import { env } from '@/config/env';

interface IyzicoError {
  errorMessage?: string;
  errorCode?: string;
}

interface CheckoutInitializeResult extends IyzicoError {
  status: string;
  token?: string;
  paymentPageUrl?: string;
  conversationId?: string;
}

interface CheckoutRetrieveResult extends IyzicoError {
  status: string;
  paymentStatus?: string;
  paymentId?: string;
  paidPrice: string;
  currency: string;
}

interface RefundResult extends IyzicoError {
  status: string;
  paymentId?: string;
}

interface BuyerPayload {
  id: string;
  name: string;
  surname: string;
  gsmNumber: string;
  email: string;
  identityNumber: string;
  lastLoginDate: string;
  registrationDate: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
}

interface AddressPayload {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode: string;
}

interface IyzicoClientShape {
  checkoutFormInitialize: {
    create: (
      request: unknown,
      callback: (err: IyzicoError | null, result: CheckoutInitializeResult) => void
    ) => void;
  };
  checkoutForm: {
    retrieve: (
      request: unknown,
      callback: (err: IyzicoError | null, result: CheckoutRetrieveResult) => void
    ) => void;
  };
  refund: {
    create: (
      request: unknown,
      callback: (err: IyzicoError | null, result: RefundResult) => void
    ) => void;
  };
}

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

const normalizeCurrency = (currency?: string): CurrencyCode =>
  currency === 'USD' || currency === 'EUR' ? currency : 'TRY';

/**
 * Iyzico Payment Client
 */
export class IyzicoClient {
  private client: IyzicoClientShape;
  private config: IyzicoConfig;

  constructor(config?: Partial<IyzicoConfig>) {
    this.config = {
      apiKey: config?.apiKey || env.iyzico.apiKey,
      secretKey: config?.secretKey || env.iyzico.secretKey,
      baseUrl: config?.baseUrl || env.iyzico.baseUrl,
      locale: config?.locale || 'tr',
    };

    // Initialize Iyzico client
    this.client = new Iyzipay({
      apiKey: this.config.apiKey,
      secretKey: this.config.secretKey,
      uri: this.config.baseUrl,
    }) as unknown as IyzicoClientShape;
  }

  /**
   * Initiate a payment
   *
   * @param request - Payment request data
   * @returns Payment response with checkout URL
   */
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const conversationId = generateConversationId(
        request.userId,
        request.packageId || 'package'
      );

      // Prepare payment request for Iyzico
      const iyzicoRequest = {
        locale: this.config.locale,
        conversationId,
        price: convertFromSmallestUnit(request.amount).toFixed(2),
        paidPrice: convertFromSmallestUnit(request.amount).toFixed(2),
        currency: request.currency || 'TRY',
        basketId: request.packageId || generatePaymentReference(),
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: request.callbackUrl || `${env.appUrl}/payment/callback`,
        enabledInstallments: [1],
        buyer: this.prepareBuyerInfo(request.buyer),
        shippingAddress: this.prepareAddressInfo(request.billingAddress),
        billingAddress: this.prepareAddressInfo(request.billingAddress),
        basketItems: [
          {
            id: request.packageId || 'ITEM-001',
            name: request.description,
            category1: 'Credits',
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
            price: convertFromSmallestUnit(request.amount).toFixed(2),
          },
        ],
      };

      // Create checkout form initialize request
      return new Promise((resolve, reject) => {
        this.client.checkoutFormInitialize.create(
          iyzicoRequest,
          (err: IyzicoError | null, result: CheckoutInitializeResult) => {
            if (err) {
              reject({
                success: false,
                paymentId: conversationId,
                status: 'failed',
                errorMessage: err.errorMessage || 'Payment initialization failed',
                errorCode: err.errorCode,
              });
              return;
            }

            if (result.status === 'success') {
              resolve({
                success: true,
                paymentId: conversationId,
                token: result.token,
                checkoutUrl: result.paymentPageUrl,
                status: 'pending',
                conversationId: result.conversationId,
              });
            } else {
              reject({
                success: false,
                paymentId: conversationId,
                status: 'failed',
                errorMessage: result.errorMessage,
                errorCode: result.errorCode,
              });
            }
          }
        );
      });
    } catch (error: unknown) {
      return {
        success: false,
        paymentId: generatePaymentReference(),
        status: 'failed',
        errorMessage: getErrorMessage(error, 'Payment initialization failed'),
      };
    }
  }

  /**
   * Verify payment result
   *
   * @param token - Payment token from callback
   * @returns Payment completion data
   */
  async verifyPayment(token: string): Promise<PaymentCompletion> {
    return new Promise((resolve, reject) => {
      this.client.checkoutForm.retrieve(
        {
          locale: this.config.locale,
          token,
        },
        (err: IyzicoError | null, result: CheckoutRetrieveResult) => {
          if (err) {
            reject(new Error(err.errorMessage || 'Payment verification failed'));
            return;
          }

          if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
            resolve({
              paymentId: result.paymentId || token,
              status: 'success',
              paidAmount: Math.round(parseFloat(result.paidPrice) * 100),
              currency: normalizeCurrency(result.currency),
              paymentMethod: 'credit_card',
              transactionTime: new Date(),
              userId: 0, // Will be populated from conversation ID
            });
          } else {
            reject(new Error(result.errorMessage || 'Payment failed'));
          }
        }
      );
    });
  }

  /**
   * Refund a payment
   *
   * @param paymentId - Payment transaction ID
   * @param amount - Amount to refund (in smallest unit)
   * @param reason - Refund reason
   * @returns Refund result
   */
  async refundPayment(
    paymentId: string,
    amount: number,
    _reason?: string
  ): Promise<{ success: boolean; refundId?: string; errorMessage?: string }> {
    return new Promise((resolve, _reject) => {
      this.client.refund.create(
        {
          locale: this.config.locale,
          conversationId: generatePaymentReference(),
          paymentTransactionId: paymentId,
          price: convertFromSmallestUnit(amount).toFixed(2),
          currency: 'TRY',
          ip: '127.0.0.1',
        },
        (err: IyzicoError | null, result: RefundResult) => {
          if (err) {
            resolve({
              success: false,
              errorMessage: err.errorMessage || 'Refund failed',
            });
            return;
          }

          if (result.status === 'success') {
            resolve({
              success: true,
              refundId: result.paymentId,
            });
          } else {
            resolve({
              success: false,
              errorMessage: result.errorMessage,
            });
          }
        }
      );
    });
  }

  /**
   * Prepare buyer information for Iyzico
   */
  private prepareBuyerInfo(buyer?: BuyerInfo): BuyerPayload {
    if (buyer) {
      return {
        id: buyer.id,
        name: buyer.name,
        surname: buyer.surname,
        gsmNumber: '+905350000000',
        email: buyer.email,
        identityNumber: buyer.identityNumber || '11111111111',
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationAddress: buyer.registrationAddress || 'Nidakule Göztepe',
        ip: buyer.ip || '85.34.78.112',
        city: buyer.city || 'Istanbul',
        country: buyer.country || 'Turkey',
      };
    }

    // Default buyer info
    return {
      id: 'BY001',
      name: 'John',
      surname: 'Doe',
      gsmNumber: '+905350000000',
      email: 'customer@example.com',
      identityNumber: '11111111111',
      lastLoginDate: '2024-01-01 12:00:00',
      registrationDate: '2024-01-01 12:00:00',
      registrationAddress: 'Nidakule Göztepe',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
    };
  }

  /**
   * Prepare address information for Iyzico
   */
  private prepareAddressInfo(address?: AddressInfo): AddressPayload {
    if (address) {
      return {
        contactName: address.contactName,
        city: address.city,
        country: address.country,
        address: address.address,
        zipCode: address.zipCode || '34000',
      };
    }

    // Default address
    return {
      contactName: 'John Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah.',
      zipCode: '34000',
    };
  }
}

/**
 * Create default Iyzico client instance
 */
export function createIyzicoClient(config?: Partial<IyzicoConfig>): IyzicoClient {
  return new IyzicoClient(config);
}

/**
 * Mock payment for development (when Iyzico credentials not available)
 */
export async function mockPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const paymentId = generatePaymentReference();

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    paymentId,
    token: `mock-token-${Date.now()}`,
    checkoutUrl: `https://sandbox-checkout.iyzipay.com/auth?token=mock-${paymentId}`,
    status: 'pending',
    conversationId: generateConversationId(request.userId, request.packageId || 'mock'),
  };
}
