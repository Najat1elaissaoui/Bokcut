import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X, Navigation, Expand } from "lucide-react";

// Utilitaire pour parser l'adresse
function parseAddress(addressObj: any) {
  if (!addressObj) return { rue: "", ville: "", codePostal: "", pays: "" };
  return {
    rue: addressObj.road || addressObj.house_number || "",
    ville: addressObj.city || addressObj.town || addressObj.village || "",
    codePostal: addressObj.postcode || "",
    pays: addressObj.country || "",
  };
}

export default function MapSearchCard({
  address,
  latitude,
  longitude,
  onAddressChange,
  onRequestDetect,
  loadingGPS,
}: {
  address: string;
  latitude: number | null;
  longitude: number | null;
  onAddressChange: (address: string, lat: number, lng: number, addressDetails?: any) => void;
  onRequestDetect: () => void;
  loadingGPS?: boolean;
}) {
  const [search, setSearch] = useState(address || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lng: number; title: string; details?: any } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude, title: address } : null
  );
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: latitude ?? 31.6295,
    lng: longitude ?? -7.9811,
  });
  const [zoom, setZoom] = useState(13);
  const [modalOpen, setModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions API
  const searchAddress = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  // Sur changement de search dans l'input
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (search.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      searchAddress(search);
      setShowSuggestions(true);
    }, 350);
  }, [search]);

  // Sélection suggestion
  const selectSuggestion = (s: any) => {
    setSearch(s.display_name);
    setShowSuggestions(false);
    setMarker({ lat: Number(s.lat), lng: Number(s.lon), title: s.display_name, details: s.address });
    setCenter({ lat: Number(s.lat), lng: Number(s.lon) });
    setZoom(16);
    onAddressChange(s.display_name, Number(s.lat), Number(s.lon), s.address);
  };

  // Click sur la carte
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>, full = false) => {
    // Coordonnées relatives (simple approx pour mini-carte ou modal)
    const ref = full ? modalRef : mapRef;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const latDelta = full ? 0.08 : 0.015;
    const lngDelta = full ? 0.15 : 0.025;
    const relLat = center.lat + latDelta * (1 - 2 * (y / rect.height));
    const relLng = center.lng + lngDelta * (2 * (x / rect.width) - 1);
    setMarker({ lat: relLat, lng: relLng, title: "Chargement..." });
    setCenter({ lat: relLat, lng: relLng });
    // Reverse geocode
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${relLat}&lon=${relLng}&addressdetails=1`
      );
      const data = await res.json();
      setSearch(data.display_name);
      setMarker({ lat: relLat, lng: relLng, title: data.display_name, details: data.address });
      onAddressChange(data.display_name, relLat, relLng, data.address);
    } catch {
      setMarker({ lat: relLat, lng: relLng, title: "Adresse inconnue" });
      onAddressChange("Adresse inconnue", relLat, relLng);
    }
  };

  // Détection GPS
  const handleDetect = async () => {
    if (loadingGPS) return;
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
        setMarker({ lat: latitude, lng: longitude, title: "Chargement..." });
        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          setSearch(data.display_name);
          setMarker({ lat: latitude, lng: longitude, title: data.display_name, details: data.address });
          onAddressChange(data.display_name, latitude, longitude, data.address);
        } catch {
          setMarker({ lat: latitude, lng: longitude, title: "Adresse inconnue" });
          onAddressChange("Adresse inconnue", latitude, longitude);
        }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      }
    );
  };

  // Suppression adresse
  const handleClear = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setMarker(null);
    onAddressChange("", null, null);
  };

  // Mini-carte/Modal refs
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Affichage compact adresse
  const details = marker?.details ? parseAddress(marker.details) : { rue: "", ville: "", codePostal: "", pays: "" };

  // ---- UI ----
  return (
    <>
      <div className="bg-neutral-900/80 border border-orange-500/50 rounded-lg shadow-lg p-3 mt-4 mb-2">
        <label className="block text-xs font-medium text-neutral-300 mb-1 tracking-wider">Adresse du salon</label>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-8 py-2 rounded bg-neutral-950 border border-neutral-700 text-white font-mono placeholder-neutral-500 text-sm"
              placeholder="Rue, ville, code postal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              autoComplete="off"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={15} />
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-500"
              onClick={handleClear}
              tabIndex={-1}
              type="button"
              aria-label="Effacer"
              style={{ display: search ? "inline" : "none" }}
            >
              <X size={16} />
            </button>
            {isLoading && <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 animate-spin text-orange-400" size={16} />}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-neutral-900 border border-orange-500/30 rounded-lg shadow-xl mt-1 max-h-44 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-orange-500/30 cursor-pointer flex items-center gap-2"
                  onClick={() => selectSuggestion(s)}
                >
                  <MapPin className="text-orange-500" size={15} />
                  <span className="truncate text-sm">{s.display_name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="flex items-center gap-2 bg-neutral-800 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded transition text-xs"
              onClick={handleDetect}
              disabled={isLoading || loadingGPS}
            >
              <Navigation size={14} /> GPS
            </button>
            <span className="text-xs text-neutral-500">ou cliquez sur la carte</span>
          </div>
          {/* Mini-carte */}
          <div className="w-full h-32 rounded-md border border-orange-500/20 bg-black relative overflow-hidden mt-2" ref={mapRef} style={{ minHeight: 90, cursor: "crosshair" }}>
            {/* Simple tile */}
            <img
              src={`https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`}
              alt="carte"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {/* Marker */}
            {marker && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none"
                style={{ transform: "translate(-50%, -100%)" }}
              >
                <MapPin size={22} className="text-red-500 drop-shadow-lg" />
              </div>
            )}
            {/* Plein écran */}
            <button
              className="absolute bottom-2 right-2 bg-neutral-800/80 text-orange-400 rounded-full p-1 hover:bg-orange-500/40 transition z-20"
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Agrandir la carte"
            >
              <Expand size={16} />
            </button>
            {/* Click sur la mini-carte */}
            <div
              className="absolute inset-0 cursor-crosshair z-10"
              onClick={(e) => handleMapClick(e, false)}
              title="Sélectionner un lieu sur la carte"
            />
          </div>
          {/* Adresse compacte (rue, ville, cp, pays) */}
          {marker?.details && (
            <div className="text-xs mt-2 flex flex-wrap gap-2 text-neutral-300">
              {details.rue && <span>🏠 {details.rue}</span>}
              {details.ville && <span>🏙️ {details.ville}</span>}
              {details.codePostal && <span>📮 {details.codePostal}</span>}
              {details.pays && <span>🌍 {details.pays}</span>}
            </div>
          )}
        </div>
      </div>
      {/* ---- MODAL FULL SCREEN MAP ---- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-900 rounded-lg shadow-2xl p-4 relative w-full max-w-2xl h-[65vh] flex flex-col">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-red-400" onClick={() => setModalOpen(false)} aria-label="Fermer">
              <X size={22} />
            </button>
            <div className="font-bold text-orange-400 mb-2 text-sm">Sélectionnez un point sur la carte</div>
            <div className="flex-1 w-full h-full relative" ref={modalRef} style={{ minHeight: 300 }}>
              <img
                src={`https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`}
                alt="carte"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              {marker && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none"
                  style={{ transform: "translate(-50%, -100%)" }}
                >
                  <MapPin size={34} className="text-red-500 drop-shadow-lg" />
                </div>
              )}
              <div
                className="absolute inset-0 cursor-crosshair z-10"
                onClick={(e) => handleMapClick(e, true)}
                title="Sélectionner un lieu"
              />
            </div>
            <div className="mt-3 text-xs text-neutral-300">
              {marker?.details
                ? (
                  <>
                    {details.rue && <span>🏠 {details.rue} </span>}
                    {details.ville && <span>🏙️ {details.ville} </span>}
                    {details.codePostal && <span>📮 {details.codePostal} </span>}
                    {details.pays && <span>🌍 {details.pays}</span>}
                  </>
                )
                : "Cliquez sur la carte pour définir l'adresse."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}