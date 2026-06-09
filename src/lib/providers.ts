// Provider catalog — single source of truth for the systems the Fetch Gateway
// demo can connect. Exactly three, each with a different auth method that drives
// a different credential flow on /connect-method.
//
// Every screen that references a provider (the `/select-provider` MUI Select,
// the `/connecting` query-param guard, the `/connect-method` flow branch)
// imports from this file. DO NOT redeclare provider slugs, names, or auth
// methods anywhere else — that's the drift this catalog exists to prevent.
//
// Slugs are typed as a string-literal union (not generic `string`) so the
// `/connecting` and `/connect-method` parsers can use the union as a precise
// discriminator: `providers.find(p => p.slug === slugFromQuery)` narrows
// correctly without a runtime cast.
//
// authMethod drives the self-path credential flow (/connect-method):
//   • 'redirect'    → no modal; straight to /connecting (no 2FA)          e.g. Gusto
//   • 'credentials' → /credentials card → /verify (2FA) → /connecting  e.g. Principal
//   • 'sftp'        → host + username + password modal; /connecting (no 2FA)

export type Provider = {
  slug: 'gusto' | 'principal' | 'sftp';
  name: string;
  authMethod: 'redirect' | 'credentials' | 'sftp';
};

// `as const` preserves the literal slug types at the call site, and the array
// is `readonly` so consumers can iterate but not mutate the catalog.
const providers = [
  { slug: 'gusto', name: 'Gusto', authMethod: 'redirect' },
  { slug: 'principal', name: 'Principal', authMethod: 'credentials' },
  { slug: 'sftp', name: 'SFTP', authMethod: 'sftp' },
] as const satisfies readonly Provider[];

export default providers;
