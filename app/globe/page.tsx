"use client";
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

// Dynamically import the Globe component with ssr disabled
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  )
});

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [locations, setLocations] = useState<TransformedLocation[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {    
    // Define initial location inside the effect
    const initialLocation = {
      lat: 10.2926115, // Cebu City latitude
      lng: 123.9021934,
      altitude: 1.5 
    };

    // Wait for both the globe to be mounted and locations to be loaded
    const initGlobe = () => {
      if (globeRef.current && locations.length > 0) {     
        console.log("Initializing Globe controls");
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.3;
        globeRef.current.pointOfView(initialLocation, 0);
      }
    };

    // Check when Globe becomes available
    if (!globeRef.current) {
      console.log("Waiting for Globe to be mounted...");
    } else if (locations.length === 0) {
      console.log("Waiting for locations to be loaded...");
    }

    // Add a small delay to ensure the globe is fully rendered
    const timeoutId = setTimeout(initGlobe, 100);
    
    return () => clearTimeout(timeoutId);
  }, [locations]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold">
            Tour Locations
          </h1>

          <div className="grid gap-8 items-start">
            <div className="bg-white ronded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="h-[700px] w-full relative">
                  <Globe
                    ref={globeRef}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="rgba(0,0,0,0)"
                    pointColor={() => "#FF5733"}
                    pointLabel="name"
                    pointsData={locations}
                    pointRadius={0.5}
                    pointAltitude={0.1}
                    pointsMerge={true}
                    width={700}
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
