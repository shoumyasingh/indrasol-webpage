
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Basic coordinates for Indrasol's locations
const OFFICE_COORDS = [
  { lng: -121.9589, lat: 37.7799, label: "San Ramon, USA" },
  { lng: 103.8499736, lat: 1.2899175, label: "Singapore" },
  { lng: 78.3927, lat: 17.4893, label: "Hyderabad, India" },
  { lng: -99.1617, lat: 19.4270, label: "Mexico City" }
];

const demoToken = ""; // We don't ship a default token.

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(demoToken);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Only initialize if we have a token and no map
    if (!token || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      zoom: 1.6,
      center: [30, 15],
      pitch: 45,
      antialias: true
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    // Add globe atmosphere
    map.current.on("style.load", () => {
      map.current?.setFog({
        color: "rgb(255,255,255)",
        "high-color": "rgb(200,200,225)",
        "horizon-blend": 0.15
      });
    });

    // Add beautiful markers for the offices
    OFFICE_COORDS.forEach((loc) => {
      const el = document.createElement("div");
      el.className =
        "w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-orange-400 border-4 border-white shadow-lg animate-pulse";
      el.title = loc.label;
      new mapboxgl.Marker(el).setLngLat([loc.lng, loc.lat]).addTo(map.current!);
    });

    // Spin globe animation
    const secondsPerRevolution = 180;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.current.on("mousedown", () => (userInteracting = true));
    map.current.on("dragstart", () => (userInteracting = true));
    map.current.on("mouseup", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.current.on("touchend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.current.on("moveend", spinGlobe);

    spinGlobe();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [token]);

  // Token prompt and map container
  return (
    <div className="relative w-full h-96 md:h-[28rem] rounded-xl overflow-hidden shadow-2xl animate-fade-in bg-gradient-to-br from-blue-50 via-orange-50 to-white border border-gray-200">
      {showPrompt && !token && (
        <div className="absolute inset-0 z-50 bg-white/80 flex flex-col items-center justify-center text-center px-10">
          <h3 className="text-xl font-bold mb-2 text-indrasol-blue">Enter your Mapbox Public Token</h3>
          <p className="text-gray-600 mb-4">
            To view the interactive globe, please enter your Mapbox public token.<br />
            <span className="block text-xs text-gray-500 mt-2">
              Get your public token at <a href="https://mapbox.com/" target="_blank" className="text-blue-600 underline">mapbox.com</a>
            </span>
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              setShowPrompt(false);
            }}
            className="w-full max-w-sm"
          >
            <input
              type="text"
              placeholder="Mapbox public token"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-3 focus:outline-none focus:border-indigo-400"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-indrasol-blue text-white rounded-lg px-4 py-2 w-full font-medium hover:bg-blue-700 transition-colors"
            >
              Start Map
            </button>
          </form>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      {token && (
        <div className="absolute z-10 top-3 right-4 bg-white/70 text-xs rounded-lg px-3 py-1 shadow font-medium backdrop-blur-md">
          Powered by Mapbox | Indrasol Offices
        </div>
      )}
    </div>
  );
};

export default Map;
