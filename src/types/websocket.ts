/**
 * WebSocket Types
 * 
 * WebSocket mesajlaşma ve event tipleri.
 */

export type WebSocketEventType = 
  | 'presence' 
  | 'message' 
  | 'notification' 
  | 'ping' 
  | 'pong' 
  | 'error'
  | 'subscription_update'
  | 'credit_update';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType;
  data: T;
  timestamp?: string;
}

export interface PresenceData {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: string;
}

export interface CreditUpdateData {
  userId: string;
  newBalance: number;
  transactionId?: string;
}

export interface SubscriptionUpdateData {
  userId: string;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  expiresAt: string | null;
}

/** Error payload for socket communication */
export interface WebSocketErrorData {
  code: string;
  message: string;
  details?: unknown;
}

/** Event listener callback type */
export type WebSocketCallback<T = unknown> = (data: T) => void;

/** Internal handler structure */
export interface WebSocketHandler {
  type: WebSocketEventType;
  callback: WebSocketCallback<unknown>;
}

/** 
 * WebSocket manager configuration
 */
export interface WebSocketConfig {
  url: string;
  token?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}
