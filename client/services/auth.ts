import { AxiosError } from 'axios';
import api from './axios';

export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends TokenInfo {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export class AuthService {
  private static instance: AuthService;
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private tokenExpiryKey = 'tokenExpiry';

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    
    if (!token || !expiry) {
      return false;
    }

    return Date.now() < parseInt(expiry);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
  }

  private setTokens(authResponse: TokenInfo): void {
    localStorage.setItem(this.tokenKey, authResponse.token);
    localStorage.setItem(this.refreshTokenKey, authResponse.refreshToken);
    
    const expiryTime = Date.now() + authResponse.expiresIn * 1000;
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
  }

  private handleError(error: AxiosError): Error {
    if (error.response?.status === 401) {
      this.clearTokens();
    }
    return error as Error;
  }
}
