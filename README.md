# City Pulse

A modern, responsive web application that automatically detects your location and provides real-time information about weather, local news, and iconic landmarks/places in your city.

## Features

- **Automatic Location Detection** — Uses browser geolocation to identify your current city
- **Real-time Weather** — Current temperature, humidity, wind, condition + 5-day forecast with °C/°F toggle
- **Local News** — Latest headlines from Indonesian mainstream sources with masonry grid layout & image overlay
- **Iconic Landmarks & Places** — Recommended famous places, malls, museums, and attractions near you
- Responsive design for mobile & desktop

## Technologies Used

- React
- Vite
- Bootstrap
- APIs:
  - OpenWeatherMap (weather & forecast)
  - NewsData.io (local news)
  - Geoapify Places (landmarks & points of interest)
  - BigDataCloud (reverse geocoding)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/city-pulse.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd city-pulse
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create .env file in root directory and fill in your API keys:**:
   ```bash
   VITE_OPENWEATHER_API_KEY=your_openweather_key_here
   VITE_NEWSDATA_API_KEY=your_newsdata_key_here
   VITE_GEOAPIFY_API_KEY=your_geoapify_key_here
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```