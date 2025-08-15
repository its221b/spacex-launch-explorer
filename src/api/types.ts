export type LaunchLinks = {
  patch: { small: string | null; large: string | null } | null;
  wikipedia: string | null;
  article: string | null;
  webcast: string | null;
};

export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  details?: string | null;
  success?: boolean | null;
  links: LaunchLinks;
  launchpad: string;
};

export type Launchpad = {
  id: string;
  name: string;
  full_name?: string;
  locality?: string;
  region?: string;
  latitude: number;
  longitude: number;
  details?: string;
  images?: { large?: string[] };
};
