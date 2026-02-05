import { HttpEvent, HttpInterceptorFn, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys().map(key => `${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }
  const cacheKey = generateCacheKey(req.url, req.params);

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
        console.log(`cache invalidated for key: ${key}`);
      }
    }
  }

  if (req.method == 'POST' && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }

  if (req.method == 'POST' && req.url.includes('/messages')) {
    invalidateCache('/messages');
  }
  
  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);//req.urlWithParams
    if (cachedResponse) {
      console.log(req.url);
      return of(cachedResponse);
    }
  }
  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      if (response instanceof HttpResponse && req.method === 'GET') {
        console.log('cache set'); console.log(response);
         cache.set(cacheKey, response)
      }
    }),
    finalize(() => {
      busyService.idle();

    }));
};
