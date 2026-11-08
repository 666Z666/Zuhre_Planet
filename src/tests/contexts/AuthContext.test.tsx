import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api/auth';

vi.mock('@/services/api/auth', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

vi.mock('@/services/api/client', () => ({
  removeAuthToken: vi.fn(),
}));

function TestConsumer() {
  const { isLoading, isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="role">{user?.role ?? 'none'}</div>
      <button type="button" onClick={() => login('test@example.com', 'StrongPass123!')}>Giris</button>
      <button type="button" onClick={logout}>Cikis</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('restores session from backend me endpoint', async () => {
    vi.mocked(authService.me).mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      role: 'client',
      verified: true,
      createdAt: new Date().toISOString(),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('role')).toHaveTextContent('customer');
    });
  });

  it('normalizes client role to customer on login', async () => {
    vi.mocked(authService.me).mockRejectedValue(new Error('Unauthorized'));
    vi.mocked(authService.login).mockResolvedValue({
      user: {
        id: '2',
        email: 'client@example.com',
        name: 'Client User',
        role: 'client',
        verified: true,
        createdAt: new Date().toISOString(),
      },
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    fireEvent.click(screen.getByText('Giris'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('role')).toHaveTextContent('customer');
    });
  });
});
