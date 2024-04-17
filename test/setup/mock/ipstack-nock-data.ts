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

export const IpStackSuccessfulRequest = {
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
};
