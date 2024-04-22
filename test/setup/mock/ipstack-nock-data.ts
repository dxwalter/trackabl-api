export const IpStackFailedRequest = {
  data: {
    success: false,
    error: {
      code: 101,
      type: "invalid_access_key",
      info: "You have not supplied a valid API Access Key. [Technical Support: support@apilayer.com]",
    },
  },
  responseCode: 200,
};

export const IpStackSuccessfulRequestForNigeria = {
  status: "success",
  message: "Transaction fetched successfully",
  data: {
    ip: "104.28.251.97",
    type: "ipv4",
    continent_code: "AF",
    continent_name: "Africa",
    country_code: "NG",
    country_name: "Nigeria",
    region_code: "LA",
    region_name: "Lagos",
    city: "Obalende",
    zip: null,
    latitude: 6.4351301193237305,
    longitude: 3.416059970855713,
    location: {
      geoname_id: 2566633,
      capital: "Abuja",
      languages: [
        {
          code: "en",
          name: "English",
          native: "English",
        },
      ],
      country_flag: "https://assets.ipstack.com/flags/ng.svg",
      country_flag_emoji: "🇳🇬",
      country_flag_emoji_unicode: "U+1F1F3 U+1F1EC",
      calling_code: "234",
      is_eu: false,
    },
  },
  responseCode: 200,
};

export const IpStackSuccessfulRequestForUnitedStates = {
  status: "success",
  message: "Transaction fetched successfully",
  data: {
    ip: "104.28.204.175",
    zip: "10020",
    city: "Manhattan",
    type: "ipv4",
    latitude: 40.7589111328125,
    location: {
      is_eu: false,
      capital: "Washington D.C.",
      languages: [
        {
          code: "en",
          name: "English",
          native: "English",
        },
      ],
      geoname_id: 5125771,
      calling_code: "1",
      country_flag: "https://assets.ipstack.com/flags/us.svg",
      country_flag_emoji: "🇺🇸",
      country_flag_emoji_unicode: "U+1F1FA U+1F1F8",
    },
    longitude: -73.97901916503906,
    region_code: "NY",
    region_name: "New York",
    country_code: "US",
    country_name: "United States",
    continent_code: "NA",
    continent_name: "North America",
  },
  responseCode: 200,
};
