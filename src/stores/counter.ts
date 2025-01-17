import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router';
import { API_URL } from './config'; // Đường dẫn './config' có thể thay đổi tùy thuộc vào cấu trúc thư mục của bạn

const api_url = API_URL;

interface AuthState {
  user: string | null;
  access_token: string | null;
  refresh_token: string | null;
  isAdminOrEmployee: boolean | null;
  role: string | null;
  returnUrl: string;
}


export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
      user: localStorage.getItem('user') || null,
      access_token: localStorage.getItem('access_token') || null,
      refresh_token: localStorage.getItem('refresh_token') || null,
      isAdminOrEmployee: localStorage.getItem('isAdminOrEmployee') === "true" || false,
      role: localStorage.getItem('role') || null,
      returnUrl: '/home',
  }),
  getters: {
    isAdmin(state): boolean {
      return state.role === 'ROLE_ADMIN';
    },
  },
  actions: {
      async login(username: string, password: string) {
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
          const url = `${api_url}/login`;
          let response = await fetch(url, {
              method: 'POST',
              body: formData,
          });

          if (response.status === 403) {
              // localStorage.setItem('redirectUrl', window.location.href);
              await this.refreshToken();
              response = await fetch(url, {
                  method: 'POST',
                  body: formData,
                  headers: {
                      'Authorization': `Bearer ${this.access_token}`,
                  },
              });
              return false;
          }

          if (response.status === 200) {
              const {access_token, refresh_token, isAdminOrEmployee, role} = await response.json();
              localStorage.setItem('isAdminOrEmployee', isAdminOrEmployee);
              if(isAdminOrEmployee === "false") {
                return false;
              }else {
                localStorage.setItem('user', username);
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('role', role);
                this.user = username;
                this.access_token = access_token;
                this.refresh_token = refresh_token;
                this.isAdminOrEmployee = isAdminOrEmployee;
                this.role = role;
                // Get the stored URL
                const redirectUrl = localStorage.getItem('redirectUrl');
                // Remove the stored URL
                localStorage.removeItem('redirectUrl');
                // Redirect to the stored URL if it exists, otherwise to the default returnUrl
                setTimeout(async () => {
                    // Redirect to the stored URL if it exists, otherwise to the default returnUrl
                    await router.push(redirectUrl || this.returnUrl);
                }, 1500);
                return true;
              }
          }
      },

      async register(username: string, password: string) {
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
          const url = `${api_url}/register`; // replace with your register endpoint

          const response = await fetch(url, {
              method: 'POST',
              body: formData,
          });

          if (response.status === 201) {
              // Sử dụng toast để thông báo
              return true;
          } else {
              // Sử dụng toast để thông báo
              return false;
          }
      },

      async refreshToken() {
          const response = await fetch(`${api_url}/token/refresh`, {
              // replace with your refresh token endpoint
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${this.refresh_token}`,
              },
          });

          if (response.status === 200) {
              const {access_token} = await response.json();

              // adjust if your server returns a different data structure
              localStorage.setItem('access_token', access_token);
              this.access_token = access_token;
          } else {
              // showErrorToast('Failed to refresh token', 'Authentication');
              this.logout();
          }
      },

      logout() {

          this.user = null;
          this.access_token = '';
          this.refresh_token = '';
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.push('/auth/login').then(r => r);
      },
  },
});