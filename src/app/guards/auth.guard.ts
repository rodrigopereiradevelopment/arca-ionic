import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data?.['roles'] as string[] | undefined;

  if (!auth.logado) {
    router.navigate(['/login']);
    return false;
  }

  if (roles && !roles.includes(auth.tipo!)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
