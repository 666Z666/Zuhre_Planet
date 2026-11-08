 
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, User as ApiUser, LoginResponse } from "@/services/api/auth";
import { removeAuthToken } from "@/services/api/client";

export type AppUserRole = "customer" | "escort" | "admin";

export function normalizeUserRole(role?: string | null): AppUserRole | null {
  if (!role) return null;
  if (role === "client") return "customer";
  if (role === "customer" || role === "escort" || role === "admin") return role;
  return null;
}

export function getUserDisplayName(user: { name?: string | null; email?: string | null } | null | undefined): string {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email?.trim()) return user.email.trim().split("@")[0];
  return "Misafir";
}

// Types
export interface User extends Omit<ApiUser, 'role'> {
  role: AppUserRole;
  membership?: "standard" | "vip" | "premium" | "platinum";
  hasCustomerAccount?: boolean;
  hasEscortAccount?: boolean;
  isSuperAdmin?: boolean;
  permissions?: AdminPermissions;
  // Profile fields (for escorts)
  age?: number;
  city?: string;
  district?: string;
  bio?: string;
  biography?: string;
  height?: number;
  weight?: number;
  hairColor?: string;
  eyeColor?: string;
  languages?: string[];
  avatarUrl?: string;
}

export interface AdminPermissions {
  canCreateListings: boolean;
  canEditListings: boolean;
  canDeleteListings: boolean;
  canApproveListings: boolean;
  canViewAllUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canBanUsers: boolean;
  canViewAllMessages: boolean;
  canModerateMessages: boolean;
  canManageAds: boolean;
  canEditContent: boolean;
  canManageBanner: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
  canManagePayments: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: {id: string; token: string} | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEscort: boolean;
  viewRole: "guest" | "user" | "premium" | "vip";
  userRole: "customer" | "escort" | "admin" | null;
  permissions: AdminPermissions | null;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  canAccessAnySection: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (data: {
    email: string;
    password: string;
    name?: string;
    role?: AppUserRole;
    phone?: string;
    termsAccepted?: boolean;
    profile?: unknown;
  }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

type RegisterInput = Parameters<AuthContextValue["register"]>[0];

const SUPER_ADMIN_PERMISSIONS: AdminPermissions = {
  canCreateListings: true, canEditListings: true, canDeleteListings: true, canApproveListings: true,
  canViewAllUsers: true, canEditUsers: true, canDeleteUsers: true, canBanUsers: true,
  canViewAllMessages: true, canModerateMessages: true, canManageAds: true, canEditContent: true,
  canManageBanner: true, canViewAnalytics: true, canExportData: true, canManageSettings: true,
  canManagePayments: true,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthContextValue["session"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Storage Keys (Consistent with client.ts)
  const USER_STORAGE_KEY = 'auth_user';

  const logout = useCallback(() => {
    authService.logout().catch(() => undefined);
    setUser(null);
    setSession(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    removeAuthToken();
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      let parsedUser: User | null = null;

      if (savedUser) {
        parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }

      try {
        const freshUser = await authService.me();
        const mappedRole = normalizeUserRole(freshUser.role);

        if (!mappedRole) {
          throw new Error("Unsupported user role received from server");
        }

        const mergedUser: User = {
          ...parsedUser,
          ...freshUser,
          role: mappedRole,
          membership: parsedUser?.membership || "standard",
        };

        setUser(mergedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mergedUser));
      } catch (e: unknown) {
        if (parsedUser) {
          console.warn("Could not refresh profile, cached session is kept.");

          const message = e instanceof Error ? e.message.toLowerCase() : "";
          if (message.includes("yetkisiz") || message.includes("unauthorized") || message.includes("401")) {
            logout();
          }
        }
      }
    } catch (error) {
      console.error("Session restore failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await authService.login(email, password);

      const mappedRole = normalizeUserRole(response.user.role);
      if (!mappedRole) {
        throw new Error("Desteklenmeyen hesap rolü alındı.");
      }

      const authUser: User = {
        ...response.user,
        role: mappedRole,
        membership: "standard",
      };

      setUser(authUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      // Store session info (accessToken from response for in-memory reference)
      setSession({ id: authUser.id, token: response.accessToken });
      return authUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name ?? data.email.split("@")[0],
        role: data.role ?? "customer",
        ...(data.phone ? { phone: data.phone } : {}),
        termsAccepted: data.termsAccepted ?? false,
      });
      const mappedRole = normalizeUserRole(response.user.role);
      if (!mappedRole) {
        throw new Error("Desteklenmeyen hesap rolü alındı.");
      }
      const authUser: User = {
        ...response.user,
        role: mappedRole,
        membership: "standard",
      };
      setUser(authUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedApiUser = await authService.updateProfile(
        data as Parameters<typeof authService.updateProfile>[0]
      );
      if (user) {
        const mappedRole = normalizeUserRole(updatedApiUser.role);
        if (!mappedRole) {
          throw new Error("Desteklenmeyen hesap rolü alındı.");
        }

        const updated = { ...user, ...updatedApiUser, role: mappedRole };
        setUser(updated);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      // Calls /api/auth/refresh which uses the HttpOnly refresh_token cookie
      await authService.refreshToken('');
    } catch (error) {
      console.warn('Token refresh failed, logging out:', error);
      logout();
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.isSuperAdmin === true;
  const isEscort = user?.role === "escort";
  const userRole = user?.role || null;
  const permissions = isSuperAdmin ? SUPER_ADMIN_PERMISSIONS : user?.permissions || null;

  const viewRole: "guest" | "user" | "premium" | "vip" = isAuthenticated
    ? user.membership === "vip" ? "vip" : user.membership === "premium" ? "premium" : "user"
    : "guest";

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (isSuperAdmin) return true;
    return permissions?.[permission] === true;
  };

  const canAccessAnySection =
    isSuperAdmin || Boolean(permissions && Object.values(permissions).some((p) => p === true));

  const value: AuthContextValue = {
    user, session, isAuthenticated, isLoading, isAdmin, isSuperAdmin, isEscort, viewRole, userRole,
    permissions, hasPermission, canAccessAnySection, login, logout, register, updateProfile, refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
