import React, { Dispatch, useContext, useEffect, useState } from 'react';

export type AuthProfile = {
  id: string,
  type: string,
  name: string,
  email: string,
  mobile?: string,
  picture: string,
  token: string,
}

export interface AuthProvider {
  readonly type: string;

  login(): Promise<AuthProfile>;
  logout(): void;

  getProfile(): AuthProfile;
}

type LoginPayload = { type: string, token: string };
export type Validation = (payload: LoginPayload, profile: AuthProfile) => Promise<void>;

class AuthManager {
  private providers = new Map<string, AuthProvider>();
  private listeners: Dispatch<AuthProvider>[] = [];

  private initializing = new Set<string>();

  private activeProvider: AuthProvider;
  
  getActive = () => {
    return this.activeProvider || (
      (this.providers.size === 0 || this.initializing.size !== 0) ? undefined : null
    );
  }

  async activate(provider: AuthProvider, validation?: Validation) {
    if (this.activeProvider === provider) return;
    if (validation) {
      const profile = provider.getProfile();
      console.log('Validation', validation);
      await validation({ type: provider.type, token: profile.token }, profile);
    }

    this.activeProvider = provider;
    this.listeners.forEach(l => l(provider));
  }

  subscribe(dispatch: Dispatch<AuthProvider>) {
    this.listeners.push(dispatch);
    return () => {
      const idx = this.listeners.indexOf(dispatch);
      if (idx >= 0) this.listeners.splice(idx);
    }
  }

  
  register(type: string) {
    if (this.initializing.has(type) || this.providers.has(type)) {
      throw new Error(`Auth Provider ${type} is already registered`);
    }

    this.initializing.add(type);

    return {
      setup: (provider: AuthProvider, active: boolean, validation?: Validation) => {
        this.providers.set(type, provider);
        this.initializing.delete(type);
        if (active) {
          this.activate(provider, validation);
        } else if (this.initializing.size === 0 && !this.activeProvider) {
          this.activate(null);
        }
      },
      clear: (err?: string) => {
        if (err) {
          console.error(`Clearing auth with error ${err}`)
        }
        this.initializing.delete(type);
        this.providers.delete(type);
        if (this.initializing.size === 0 && !this.activeProvider) {
          this.activate(null);
        }
      }
    };
  }

  get(type: string) {
    return this.providers.get(type);
  }
}

export const AuthContext = React.createContext(new AuthManager());

export function useAuthLogin(type: string) {
  const authManager = useContext(AuthContext);

  return async () => {
    const authProvider = authManager.get(type);
    if (!authProvider) throw new Error(`No provider found for ${type}`);

    return await authProvider.login();
  }
}

export function useAuthLogout() {
  const authManager = useContext(AuthContext);
  return () => {
    const activeProvider = authManager.getActive();
    if (!activeProvider) throw new Error('No active login found');
    activeProvider.logout();
  }
}

export function useAuthProfile() {
  const authManager = useContext(AuthContext);
  const [provider, setProvider] = useState(authManager.getActive);
  useEffect(() => {
    return authManager.subscribe(setProvider);
  }, []);
  return provider && provider.getProfile();
}
