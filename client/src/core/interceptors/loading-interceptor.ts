import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap} from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if(req.method ==='GET'){
    const cachedResponse = cache.get(req.urlWithParams);
    if(cachedResponse){
      console.log(req.url);
      return of( cachedResponse);
    }
  }
  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response =>{
      if(response instanceof HttpResponse && req.method ==='GET'){
        console.log('cache set'); console.log(response);
        cache.set(req.urlWithParams, response)
      }
    }),
    finalize(()=>{
      busyService.idle();

    }));
};
