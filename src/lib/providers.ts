// Provider catalog — single source of truth for the four payroll providers
// supported by the Fetch Gateway demo flow.
//
// Source of truth: Main_Fetch_Gateway.md "Routes — `/select-provider`" section
// pins the slug / name / brandColor for every provider. Every screen that
// references a provider (the `/select-provider` MUI Select, the `/connecting`
// query-param guard, every brand-color swatch) imports from this file.
//
// DO NOT redeclare provider slugs, names, or brand colors anywhere else in the
// codebase — that's the drift this catalog exists to prevent (T-01-02-01).
//
// Slugs are typed as a string-literal union (not generic `string`) so that
// Phase 3's `/connecting` query-param parser can use the union as a precise
// discriminator: `providers.find(p => p.slug === slugFromQuery)` narrows
// correctly without a runtime cast.

export type Provider = {
  slug: 'gusto' | 'adp' | 'paycom' | 'rippling';
  name: string;
  brandColor: string;
};

// `as const` preserves the literal slug types at the call site, and the array
// is `readonly` so consumers can iterate but not mutate the catalog.
const providers = [
  { slug: 'gusto', name: 'Gusto', brandColor: '#F45D48' },
  { slug: 'adp', name: 'ADP', brandColor: '#D90429' },
  { slug: 'paycom', name: 'Paycom', brandColor: '#003DA5' },
  { slug: 'rippling', name: 'Rippling', brandColor: '#F5A623' },
] as const satisfies readonly Provider[];

export default providers;
