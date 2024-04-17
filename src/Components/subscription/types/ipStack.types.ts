export interface Languages {
  code: string;
  name: string;
  native: string;
}

export interface Location {
  geoname_id: number;
  capital: string;
  languages: Languages[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

export interface IpStackType {
  ip: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: null;
  latitude: number;
  longitude: number;
  location: Location;
}
