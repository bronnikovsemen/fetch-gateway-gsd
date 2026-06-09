import type { Provider } from '@/lib/providers';

// The path a user takes to START connecting NOW — used by BOTH the self path
// (/connect-method "I'll connect it now") and the invited recipient
// (/recipient "Get Started"), so the two stay identical:
//   • redirect (Gusto)        → the bespoke Gusto OAuth mock (/gusto-login)
//   • credentials / sftp      → the per-type credential card (/credentials?provider=)
// The credential card then continues: Principal → /verify (2FA) → /connecting →
// /success; SFTP → /connecting → /success; Gusto authorize → /connecting → /success.
export function connectNowPath(provider: Provider): string {
  return provider.authMethod === 'redirect'
    ? '/gusto-login'
    : `/credentials?provider=${provider.slug}`;
}
