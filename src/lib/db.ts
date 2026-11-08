/**
 * Client-Side Database Proxy
 * 
 * Sunucu tarafına gitmeden önce veri tabanı işlemlerini simüle eden ve
 * API katmanına bağlayan proxy modülü.
 */

import logger from './logger';

export interface DatabaseTransaction {
  userId: string;
  amount: number;
  type: 'credit_add' | 'credit_use';
  metadata?: Record<string, unknown>;
}

/**
 * Create a credit transaction
 * Simulates server-side logic on the client for immediate UI feedback.
 */
export async function createCreditTransaction(data: DatabaseTransaction) {
  try {
    logger.info(`Creating transaction for user ${data.userId}: ${data.amount} credits`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      transactionId: `tx_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Credit transaction failed:', error);
    throw new Error('Kredi işlemi başarısız oldu.');
  }
}

/**
 * Fetch mock data for development
 */
export async function getMockData<T>(key: string): Promise<T | null> {
  const data = localStorage.getItem(`mock_db_${key}`);
  if (!data) return null;
  return JSON.parse(data) as T;
}

/**
 * Save mock data for development
 */
export async function setMockData<T>(key: string, value: T): Promise<void> {
  localStorage.setItem(`mock_db_${key}`, JSON.stringify(value));
}
