const API_PREFIX = '/api';

function getToken() {
  return localStorage.getItem('ecomm_token');
}

export async function api(path, { auth = true, token, body, ...rest } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(rest.headers || {}),
  };
  const t = auth ? (token !== undefined ? token : getToken()) : undefined;
  if (t) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...rest,
    headers,
    body:
      body !== undefined && body !== null && typeof body === 'object' && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function fetchProducts(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.category) q.set('category', params.category);
  if (params.featured) q.set('featured', 'true');
  const qs = q.toString();
  return api(`/products${qs ? `?${qs}` : ''}`);
}

export function fetchProduct(id) {
  return api(`/products/${id}`);
}

export function createProduct(body) {
  return api('/products', { method: 'POST', body });
}

export function updateProduct(id, body) {
  return api(`/products/${id}`, { method: 'PUT', body });
}

export function deleteProduct(id) {
  return api(`/products/${id}`, { method: 'DELETE' });
}

export function loginRequest(body) {
  return api('/auth/login', { method: 'POST', body, auth: false });
}

export function registerRequest(body) {
  return api('/auth/register', { method: 'POST', body, auth: false });
}

export function meRequest() {
  return api('/auth/me');
}
