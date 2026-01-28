import { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);

  const [cityPlaceId, setCityPlaceId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const NEWSDATA_API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

  const getLocationFromCoords = async (lat, lon) => {
    try {
      const lang = locationDetails?.country_code === 'id' ? 'id' : 'en';
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}&language=${lang}&pretty=1`
      );
      if (!response.ok) {
        throw new Error(`OpenCage error: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const formatted = data.results[0].formatted || 'Lokasi Tidak Diketahui';
        const kelurahan = components.suburb || components.village || 'Tidak Diketahui';
        const kecamatan = components.municipality || 'Tidak Diketahui';
        const kotaKab = components.city || components.town || components.county || 'Tidak Diketahui';
        const provinsi = components.state || components.region || 'Tidak Diketahui';
        const country_code = components.country_code || 'Tidak Diketahui';

        return {
          kelurahan,
          kecamatan,
          kotaKab,
          provinsi,
          country_code,
          fullAddress: formatted,
          confidence: data.results[0].confidence || 0,
        };
      }
      return {
        kelurahan: 'Tidak Diketahui',
        kecamatan: 'Tidak Diketahui',
        kotaKab: 'Tidak Diketahui',
        provinsi: 'Tidak Diketahui',
        country_code: 'Tidak Diketahui',
        fullAddress: 'Lokasi Tidak Diketahui',
      };
    } catch (err) {
      console.error('Error fetching OpenCage:', err);
      throw new Error('Gagal ambil detail lokasi');
    }
  };

  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`
      );
      if (!response.ok) throw new Error('Gagal ambil data cuaca');
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchNews = async (kotaKab) => {
    setNewsLoading(true);
    try {
      if (!kotaKab || kotaKab === 'Tidak Diketahui') return;
      let query = `"${kotaKab}" OR "kota ${kotaKab}" OR "di ${kotaKab}"`;
      const encodedQuery = encodeURIComponent(query);
      const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&q=${encodedQuery}&country=id&language=id&size=9`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal ambil berita');
      const data = await response.json();
      let results = data.results || [];
      results = results.filter(article => {
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        return text.includes(kotaKab.toLowerCase());
      });
      setNews(results);
    } catch (err) {
      setNewsError(err.message);
    } finally {
      setNewsLoading(false);
    }
  };

  const getCityPlaceId = async (kotaKab) => {
    if (!kotaKab || kotaKab === 'Tidak Diketahui') return null;
    try {
      const query = kotaKab;
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&type=city&lang=id&limit=1&apiKey=${GEOAPIFY_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.features?.length > 0) {
        return data.features[0].properties.place_id;
      }
      return null;
    } catch (err) {
      console.error('Gagal geocode kota:', err);
      return null;
    }
  };

  const fetchPlaces = async (lat, lon, placeId = null) => {
    setPlacesLoading(true);
    try {
      const categoryList = [
        'tourism.sights',
        'entertainment.museum',
        'leisure.park',
        'entertainment.zoo',
        'beach',
      ];
      const perCategoryLimit = 4;
      const promises = categoryList.map(async (category) => {
        let filterParam = placeId ? `place:${placeId}` : `circle:${lon},${lat},20000`;
        const langParam = locationDetails?.country_code === 'id' ? '&lang=id' : '&lang=en';
        const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=${filterParam}&limit=${perCategoryLimit}${langParam}&apiKey=${GEOAPIFY_API_KEY}`; 
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Gagal ambil ${category}: ${response.status}`);
          return [];
        }
        const data = await response.json();
        return data.features.map((feature) => ({
          name: feature.properties.name || 'Tempat Tidak Bernama',
          type: feature.properties.categories[0]?.split('.').pop() || 'Tempat',
          category: category,
          address: feature.properties.address_line2 || feature.properties.formatted,
          lat: feature.properties.lat,
          lon: feature.properties.lon,
        }));
      });
      const resultsArray = await Promise.all(promises);
      const placesList = resultsArray.flat();
      setPlaces(placesList);
    } catch (err) {
      setPlacesError(err.message);
    } finally {
      setPlacesLoading(false);
    }
  };

  useEffect(() => {
    const detectLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation tidak didukung browser kamu');
        setLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });
          try {
            const locData = await getLocationFromCoords(lat, lon);
            setLocationDetails(locData);
            setCity(locData.kotaKab || 'Lokasi Tidak Diketahui');
            const placeId = await getCityPlaceId(locData.kotaKab);
            setCityPlaceId(placeId);
            await fetchWeather(lat, lon);
            await fetchNews(locData.kotaKab);
            await fetchPlaces(lat, lon, placeId);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Izin lokasi ditolak atau gagal. Coba izinkan lokasi di browser.');
          setLoading(false);
        }
      );
    };
    detectLocation();
  }, []);

  return (
    <CityContext.Provider
      value={{
        city,
        locationDetails,
        coordinates,
        loading,
        error,
        weather,
        weatherLoading,
        weatherError,
        news,
        newsLoading,
        newsError,
        places,
        placesLoading,
        placesError,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};