import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getSupabaseData, subscribeToSupabaseChanges } from '@/lib/supabaseHelpers';
import { Bus, MapPin, Navigation, Crosshair, ArrowLeft, Star, AlertCircle, Check } from 'lucide-react';
import Compass from '@/components/Compass';
import DocumentViewer from '@/components/DocumentViewer';

interface Assignment {
  studentId: string;
  busUserId: string;
  busId: string;
  assignedAt: string;
  owner?: string;
}

interface BusLoc {
  owner: string;
  busUserId: string;
  busId: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

const ASSIGNMENTS_GLOBAL_KEY = 'royal-academy-bus-assignments-global';
const BUS_LOCATIONS_KEY = 'royal-academy-bus-locations';
const BUS_KEY = 'royal-academy-auth-buses';
const BUS_MESSAGES_GLOBAL_KEY = 'royal-academy-bus-messages-global';

interface BusMsg {
  id: string;
  owner: string;
  busUserId: string;
  busId: string;
  type: 'good' | 'bad';
  text: string;
  image1?: string;
  image2?: string;
  createdAt: string;
  to: 'all' | 'student';
  studentIds?: string[];
}

// Custom icons with SVG paths - using base64 encoding to avoid btoa errors
const busSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="22" fill="#dc2626" stroke="white" stroke-width="3"/><path d="M16 32c0 .88.39 1.67 1 2.22V36c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V22c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S18.67 30 19.5 30s1.5.67 1.5 1.5S20.33 33 19.5 33zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H18v-5h12v5z" fill="white"/></svg>`;

const homeSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="22" fill="#16a34a" stroke="white" stroke-width="3"/><path d="M20 36v-6h8v6h6v-10h4L24 14 10 26h4v10z" fill="white"/></svg>`;

const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(busSvgString),
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

const homeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(homeSvgString),
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

// Component to handle routing
const RoutingControl = ({ busLocation, homeLocation }: { busLocation: { lat: number; lng: number }, homeLocation: { lat: number; lng: number } | null }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !homeLocation) return;

    console.log('Setting up route from bus to home...', { busLocation, homeLocation });

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Create routing control with blue line
    routingControlRef.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(busLocation.lat, busLocation.lng),
        L.latLng(homeLocation.lat, homeLocation.lng)
      ],
      router: (L as any).Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [{ 
          color: '#2563eb', 
          opacity: 0.8, 
          weight: 6 
        }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null // Don't create default markers
    }).addTo(map);

    console.log('✓ Route control added to map');

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, busLocation, homeLocation]);

  return null;
};

// Component to update map view
const MapUpdater = ({ busLocation, homeLocation }: { busLocation: { lat: number; lng: number }, homeLocation: { lat: number; lng: number } | null }) => {
  const map = useMap();
  const boundsSet = useRef(false);

  useEffect(() => {
    // Check if map is properly initialized
    if (!map || !map.getSize().x || !map.getSize().y) return;
    
    if (!boundsSet.current) {
      // First time: fit bounds or set view
      if (homeLocation) {
        const bounds = L.latLngBounds([
          [busLocation.lat, busLocation.lng],
          [homeLocation.lat, homeLocation.lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else {
        map.setView([busLocation.lat, busLocation.lng], 15);
      }
      boundsSet.current = true;
    } else {
      // After first time: only pan, don't change zoom
      const center = homeLocation 
        ? L.latLngBounds([
            [busLocation.lat, busLocation.lng],
            [homeLocation.lat, homeLocation.lng]
          ]).getCenter()
        : L.latLng(busLocation.lat, busLocation.lng);
      
      // Only pan if the map is ready
      if (map && map.getSize().x && map.getSize().y) {
        map.panTo(center, { animate: true });
      }
    }
  }, [map, busLocation, homeLocation]);

  return null;
};

const StudentTrackBus: React.FC = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string>('');
  const [studentInfo, setStudentInfo] = useState<{ id?: string; studentId?: string; email?: string; name?: string; class?: string; section?: string; rollNumber?: string | number } | null>(null);
  const [myAssignment, setMyAssignment] = useState<Assignment | null>(null);
  const [busLoc, setBusLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [previousBusLoc, setPreviousBusLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [myLatLng, setMyLatLng] = useState<{lat: number; lng: number} | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [messages, setMessages] = useState<BusMsg[]>([]);
  const [busInfo, setBusInfo] = useState<any>(null);
  const [autoTracking, setAutoTracking] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationType, setLocationType] = useState<'gps' | 'wifi' | 'unknown'>('unknown');
  const [locationSet, setLocationSet] = useState(false);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    const cs = localStorage.getItem('currentStudent');
    const sid = localStorage.getItem('studentId') || '';
    const email = localStorage.getItem('studentEmail') || '';
    let base: any = null;
    try { base = cs ? JSON.parse(cs) : null; } catch {}

    const authStudents = JSON.parse(localStorage.getItem('royal-academy-auth-students') || '[]');
    const regStudents = JSON.parse(localStorage.getItem('royal-academy-students') || '[]');

    let matched = base || null;
    if (!matched && email) {
      matched = authStudents.find((s: any) => s.email === email) || regStudents.find((s: any) => s.email === email) || null;
    }

    const id = matched?.studentId || matched?.id || sid || '';
    setStudentId(id);
    setStudentInfo({
      id: matched?.id,
      studentId: matched?.studentId,
      email: matched?.email || email || undefined,
      name: matched?.username || matched?.name || matched?.fullName,
      class: matched?.class ? String(matched.class) : undefined,
      section: matched?.section ? String(matched.section).toUpperCase() : undefined,
      rollNumber: matched?.rollNumber
    });
  }, []);

  useEffect(() => {
    if (!studentId && !studentInfo) return;
    const init = async () => {
      const all = await getSupabaseData<any[]>(ASSIGNMENTS_GLOBAL_KEY, []);
      const candidates = new Set<string>();
      if (studentId) candidates.add(String(studentId));
      if (studentInfo?.id) candidates.add(String(studentInfo.id));
      if (studentInfo?.studentId) candidates.add(String(studentInfo.studentId));

      const normClass = (v: any) => {
        if (!v) return '';
        const s = String(v);
        const digits = s.match(/\d+/);
        return digits ? digits[0] : s.trim();
      };
      const matchFrom = (arr: any[]) => {
        let mine = (arr || []).filter(a => candidates.has(String(a.studentId)));
        if (mine.length === 0 && studentInfo) {
          const wantClass = normClass(studentInfo.class);
          const wantSection = String(studentInfo.section || '').toUpperCase();
          const wantRoll = studentInfo.rollNumber != null ? String(studentInfo.rollNumber) : '';
          mine = (arr || []).filter(a => {
            const aClass = normClass(a.class);
            const aSection = String(a.section || '').toUpperCase();
            const aRoll = a.rollNumber != null ? String(a.rollNumber) : '';
            const classOk = !wantClass || aClass === wantClass;
            const sectionOk = !wantSection || aSection === wantSection;
            const rollOk = !wantRoll || aRoll === wantRoll;
            return classOk && sectionOk && rollOk;
          });
        }
        return mine.sort((a: any,b: any) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())[0] || null;
      };

      let picked: Assignment | null = matchFrom(all);

      if (!picked) {
        const buses = await getSupabaseData<any[]>(BUS_KEY, []);
        const ownerSet = new Set<string>();
        (buses || []).forEach((b: any) => ownerSet.add(String((b.owner || '').toLowerCase())));
        const principalEmail = (localStorage.getItem('principalEmail') || 'principal.1025@gmail.com').toLowerCase();
        ownerSet.add(principalEmail);
        ownerSet.add('');
        const owners: string[] = Array.from(ownerSet);
        for (const owner of owners) {
          const ownerAssignments = await getSupabaseData<any[]>(`royal-academy-bus-assignments:${owner}`, []);
          const found = matchFrom(ownerAssignments);
          if (found) { picked = found; break; }
        }
      }

      setMyAssignment(picked);

      if (picked) {
        const buses = await getSupabaseData<any[]>(BUS_KEY, []);
        const myBus = buses.find(b => b.busId === picked.busId);
        setBusInfo(myBus);
      }

      const locs = await getSupabaseData<BusLoc[]>(BUS_LOCATIONS_KEY, []);
      if (picked) {
        if ((picked as any).trackingStatus === 'reached_home') {
          setStatus('You have been marked as reached home. Tracking stopped.');
          setBusLoc(null);
        } else if ((picked as any).trackingStatus === 'absent') {
          setStatus('You have been marked as absent today.');
          setBusLoc(null);
        } else {
          const current = (locs || []).find(l => l.busUserId === (picked as any).busUserId) || null;
          setBusLoc(current);
          setStatus(current ? '' : 'Assigned bus found. Waiting for the driver to start tracking...');
        }

        const allMsgs = await getSupabaseData<BusMsg[]>(BUS_MESSAGES_GLOBAL_KEY, []);
        const mineMsgs = (allMsgs || []).filter(m => m.busUserId === (picked as any).busUserId)
          .filter(m => m.to === 'all' || (m.to === 'student' && m.studentIds?.includes(studentId)) )
          .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(mineMsgs);
      } else {
        setStatus('No bus assignment found for your account');
      }
    };
    init();
  }, [studentId, studentInfo]);

  useEffect(() => {
    const unsub = subscribeToSupabaseChanges<BusLoc[]>(BUS_LOCATIONS_KEY, (val) => {
      if (!myAssignment) return;
      const current = (Array.isArray(val) ? val : []).find(l => l.busUserId === myAssignment.busUserId) || null;
      setBusLoc(current);
      if (!current) setStatus('Waiting for the bus to start tracking...'); else setStatus('');
    });
    return () => { try { unsub(); } catch {} };
  }, [myAssignment]);

  useEffect(() => {
    const unsub = subscribeToSupabaseChanges<any[]>(ASSIGNMENTS_GLOBAL_KEY, (val) => {
      if (!val) return;
      const all = Array.isArray(val) ? val : [];
      const candidates = new Set<string>();
      if (studentId) candidates.add(String(studentId));
      if (studentInfo?.id) candidates.add(String(studentInfo.id));
      if (studentInfo?.studentId) candidates.add(String(studentInfo.studentId));
      let mine = all.filter((a: any) => candidates.has(String(a.studentId)));
      if (mine.length === 0 && studentInfo) {
        mine = all.filter((a: any) =>
          (!studentInfo.class || String(a.class) === String(studentInfo.class)) &&
          (!studentInfo.section || String(a.section).toUpperCase() === String(studentInfo.section).toUpperCase()) &&
          (!studentInfo.rollNumber || String(a.rollNumber) === String(studentInfo.rollNumber)) &&
          (!studentInfo.name || String(a.studentName || '').toLowerCase() === String(studentInfo.name || '').toLowerCase())
        );
      }
      const picked: any = mine.sort((a: any,b: any) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())[0] || null;
      if (picked) setMyAssignment(picked);
    });
    return () => { try { unsub(); } catch {} };
  }, [studentId, studentInfo]);

  const haversineKm = (a: {lat:number; lng:number}, b: {lat:number; lng:number}) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const sinDLat = Math.sin(dLat/2);
    const sinDLng = Math.sin(dLng/2);
    const c = 2 * Math.asin(Math.sqrt(sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLng*sinDLng));
    return R * c;
  };

  const estimateETA = (km: number): string => {
    const avgSpeedKmh = 30;
    const hours = km / avgSpeedKmh;
    const minutes = Math.round(hours * 60);
    if (minutes < 1) return 'Less than 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  };

  const useCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported by your browser');
      return;
    }
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition((pos) => {
      const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyLatLng(here);
      
      const accuracy = pos.coords.accuracy;
      setLocationAccuracy(accuracy);
      
      if (accuracy <= 20) {
        setLocationType('gps');
      } else if (accuracy > 20 && accuracy <= 500) {
        setLocationType('wifi');
      } else {
        setLocationType('unknown');
      }
      
      setLocationSet(true);
      console.log('✓ Current Location Set:', here);
      console.log('✓ Accuracy:', accuracy, 'meters');
      
      if (busLoc) {
        const km = haversineKm(here, { lat: busLoc.lat, lng: busLoc.lng });
        console.log('✓ Calculated Distance:', km, 'km');
        setDistanceKm(Math.round(km * 1000) / 1000);
      }
    }, (err) => {
      console.error('Geolocation error:', err);
      setGeoError(err.message || 'Location error. Please enable high accuracy GPS.');
    }, { 
      enableHighAccuracy: true, 
      maximumAge: 0,
      timeout: 30000
    });
  };

  const traceDistance = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported by your browser');
      return;
    }
    setGeoError(null);
    setAutoTracking(true);
    
    navigator.geolocation.getCurrentPosition((pos) => {
      const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyLatLng(here);
      
      // Capture accuracy
      const accuracy = pos.coords.accuracy;
      setLocationAccuracy(accuracy);
      
      // Determine location type based on accuracy
      if (accuracy <= 20) {
        setLocationType('gps'); // High accuracy = GPS
      } else if (accuracy > 20 && accuracy <= 500) {
        setLocationType('wifi'); // Medium accuracy = WiFi/Network
      } else {
        setLocationType('unknown'); // Low accuracy
      }
      
      console.log('✓ My Location:', here);
      console.log('✓ Accuracy:', accuracy, 'meters');
      console.log('✓ Location Type:', accuracy <= 20 ? 'GPS' : 'WiFi/Network');
      console.log('✓ Bus Location:', busLoc);
      
      if (busLoc) {
        const km = haversineKm(here, { lat: busLoc.lat, lng: busLoc.lng });
        console.log('✓ Calculated Distance:', km, 'km');
        setDistanceKm(Math.round(km * 1000) / 1000);
      }
    }, (err) => {
      console.error('Geolocation error:', err);
      setGeoError(err.message || 'Location error. Please enable high accuracy GPS.');
      setAutoTracking(false);
    }, { 
      enableHighAccuracy: true, 
      maximumAge: 0,
      timeout: 30000
    });
  };

  const formatDistance = (km: number): string => {
    const meters = Math.round(km * 1000);
    console.log('Formatting distance - km:', km, 'meters:', meters);
    
    if (meters < 2) {
      return `${meters} m (Right here!)`;
    } else if (meters < 10) {
      return `${meters} m (Very close)`;
    } else if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${km.toFixed(2)} km`;
    }
  };

  useEffect(() => {
    if (!autoTracking || !busLoc) return;
    
    const updateLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMyLatLng(here);
          
          // Update accuracy
          const accuracy = pos.coords.accuracy;
          setLocationAccuracy(accuracy);
          
          // Update location type
          if (accuracy <= 20) {
            setLocationType('gps');
          } else if (accuracy > 20 && accuracy <= 500) {
            setLocationType('wifi');
          } else {
            setLocationType('unknown');
          }
          
          if (busLoc) {
            const km = haversineKm(here, { lat: busLoc.lat, lng: busLoc.lng });
            setDistanceKm(Math.round(km * 1000) / 1000);
          }
        }, (err) => {
          console.error('Auto-tracking error:', err);
        }, { 
          enableHighAccuracy: true, 
          maximumAge: 0, 
          timeout: 30000 
        });
      }
    };
    
    const interval = setInterval(updateLocation, 50);
    return () => clearInterval(interval);
  }, [autoTracking, busLoc]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!myAssignment?.busId) return;
      
      try {
        const list = await getSupabaseData<any[]>(BUS_LOCATIONS_KEY, []);
        const loc = (list || []).find((l: any) => l.busId === myAssignment.busId);
        
        if (loc) {
          // Update previous location before updating current
          if (busLoc) {
            setPreviousBusLoc({ ...busLoc });
          }
          
          setBusLoc({ lat: loc.lat, lng: loc.lng });
          setIsTrackingActive(true);
        } else {
          setBusLoc(null);
          setIsTrackingActive(false);
        }
      } catch (e) {
        console.error('Failed to fetch bus location:', e);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [myAssignment?.busId, busLoc]);

  const openDocumentViewer = (imageUrl: string, title: string) => {
    setCurrentImage(imageUrl);
    setCurrentTitle(title);
    setDocumentViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {busLoc && isTrackingActive && (myAssignment as any)?.trackingStatus !== 'reached_home' && (myAssignment as any)?.trackingStatus !== 'absent' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg"
        >
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Bus is on the way</div>
                {distanceKm != null && (
                  <div className="text-xs opacity-90">
                    {formatDistance(distanceKm)} away {distanceKm >= 0.1 && `• ETA: ${estimateETA(distanceKm)}`}
                  </div>
                )}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/student-dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto max-w-5xl p-4">
        {(!busLoc || !isTrackingActive) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-royal to-gold flex items-center justify-center">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Track My Bus</h1>
                <p className="text-muted-foreground text-sm">Live location of your assigned bus</p>
              </div>
            </div>
            <Button onClick={() => navigate('/student-dashboard')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </motion.div>
        )}

        {status && (
          <Card className="mb-4">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{status}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Accuracy Warning Notice */}
        <Card className="mb-4 bg-yellow-50 border-yellow-200">
          <CardContent className="py-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Warning: Location Accuracy Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  <strong>Use mobile/phone for better accuracy.</strong> If you use a computer or laptop, you may get false accuracy, meaning a false location. That's why use a mobile phone for a better experience. Mobile phones have built-in GPS, but computers/laptops do not have built-in GPS.
                </p>
                <p className="text-sm text-yellow-700 mt-2 font-medium">
                  चेतावनी: स्थान सटीकता सूचना - बेहतर सटीकता के लिए मोबाइल/फोन का उपयोग करें। यदि आप कंप्यूटर या लैपटॉप का उपयोग करते हैं, तो आपको गलत सटीकता मिल सकती है, जिसका अर्थ है गलत स्थान। इसीलिए बेहतर अनुभव के लिए मोबाइल फोन का उपयोग करें। मोबाइल फोन में अंतर्निहित जीपीएस होता है, लेकिन कंप्यूटर/लैपटॉप में अंतर्निहित जीपीएस नहीं होता है।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {busLoc && isTrackingActive && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-4">
              <CardContent className="p-0">
                <div style={{ height: '500px', width: '100%' }}>
                  <MapContainer
                    center={[busLoc.lat, busLoc.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Bus Marker */}
                    <Marker position={[busLoc.lat, busLoc.lng]} icon={busIcon}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">Bus Location</p>
                          <p className="text-xs text-muted-foreground">Driver: {busInfo?.driverName || 'Unknown'}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Home Marker */}
                    {myLatLng && (
                      <Marker position={[myLatLng.lat, myLatLng.lng]} icon={homeIcon}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-semibold">Your Location</p>
                            {distanceKm && <p className="text-xs">{formatDistance(distanceKm)} from bus</p>}
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Routing */}
                    {myLatLng && (
                      <RoutingControl busLocation={busLoc} homeLocation={myLatLng} />
                    )}

                    {/* Update map view */}
                    <MapUpdater busLocation={busLoc} homeLocation={myLatLng} />
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crosshair className="h-5 w-5" />
                    Track Distance
                  </CardTitle>
                  <CardDescription>Find distance from bus to your location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!locationSet && (
                    <Button 
                      onClick={useCurrentLocation}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use Current Location
                    </Button>
                  )}
                  <Button 
                    onClick={traceDistance}
                    className="w-full"
                    disabled={autoTracking || !locationSet}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {autoTracking ? 'Auto-Tracking Active' : locationSet ? 'Trace My Distance' : 'Set Location First'}
                  </Button>
                  {locationSet && !autoTracking && (
                    <div className="text-sm text-green-600 bg-green-500/10 p-2 rounded text-center">
                      ✓ Location set successfully
                    </div>
                  )}
                  
                  {geoError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                      {geoError}
                    </div>
                  )}
                  
                  {distanceKm != null && !geoError && (
                    <div className="bg-muted p-4 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Distance:</span>
                        <span className="font-semibold">{formatDistance(distanceKm)}</span>
                      </div>
                      {distanceKm >= 0.1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">ETA:</span>
                          <span className="font-semibold">{estimateETA(distanceKm)}</span>
                        </div>
                      )}
                      {locationAccuracy != null && (
                        <div className="pt-2 border-t border-border/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Location Type:</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              locationType === 'gps' 
                                ? 'bg-green-500/20 text-green-600' 
                                : locationType === 'wifi'
                                ? 'bg-yellow-500/20 text-yellow-600'
                                : 'bg-red-500/20 text-red-600'
                            }`}>
                              {locationType === 'gps' ? '📡 GPS' : locationType === 'wifi' ? '📶 WiFi/Network' : '❓ Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Accuracy:</span>
                            <span className="text-xs font-medium">±{Math.round(locationAccuracy)}m</span>
                          </div>
                          {locationType === 'wifi' && (
                            <div className="mt-2 text-xs text-yellow-600 bg-yellow-500/10 p-2 rounded">
                              ⚠️ Using WiFi location. For better accuracy, use a device with GPS enabled.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Bus Direction
                  </CardTitle>
                  <CardDescription>Current heading of your bus</CardDescription>
                </CardHeader>
                <CardContent>
                  <Compass busLocation={busLoc} previousLocation={previousBusLoc} />
                </CardContent>
              </Card>
            </div>

            {messages.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Messages from Driver</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-3 rounded border-l-4 ${
                        msg.type === 'good' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === 'good' ? (
                          <Star className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{msg.text}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                          {/* Images */}
                          {(msg.image1 || msg.image2) && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {msg.image1 && (
                                <div 
                                  className="cursor-pointer"
                                  onClick={() => openDocumentViewer(msg.image1!, 'Message Image 1')}
                                >
                                  <img 
                                    src={msg.image1} 
                                    alt="Message attachment 1" 
                                    className="h-16 w-16 object-cover rounded border hover:opacity-80 transition-opacity" 
                                  />
                                </div>
                              )}
                              {msg.image2 && (
                                <div 
                                  className="cursor-pointer"
                                  onClick={() => openDocumentViewer(msg.image2!, 'Message Image 2')}
                                >
                                  <img 
                                    src={msg.image2} 
                                    alt="Message attachment 2" 
                                    className="h-16 w-16 object-cover rounded border hover:opacity-80 transition-opacity" 
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Document Viewer - Moved outside of the main content to ensure it covers everything */}
      {documentViewerOpen && (
        <DocumentViewer 
          documentUrl={currentImage}
          documentName={currentTitle}
          onClose={() => setDocumentViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentTrackBus;
