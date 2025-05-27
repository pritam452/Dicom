import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Box } from 'lucide-react';

interface ThreeDViewerProps {
  modelUrl: string;
  metadata?: {
    patientName: string;
    patientId: string;
    studyDate: string;
    modality: string;
  };
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  modelUrl,
  metadata
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // For demo purposes, create a basic 3D object
    createDemoObject(scene);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const createDemoObject = (scene: THREE.Scene) => {
    setIsLoading(true);
    
    try {
      let geometry;
      let material;
      
      if (modelUrl.includes('head-and-neck')) {
        geometry = new THREE.SphereGeometry(2, 32, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xf2f2f2,
          flatShading: true,
          transparent: true,
          opacity: 0.9
        });
      } else if (modelUrl.includes('cardiac')) {
        geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 64, 16);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xe74c3c,
          shininess: 100
        });
      } else if (modelUrl.includes('brain')) {
        geometry = new THREE.IcosahedronGeometry(2, 2);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xf39c12,
          wireframe: false
        });
      } else {
        geometry = new THREE.BoxGeometry(2, 2, 2);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x3498db,
          wireframe: false
        });
      }
      
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
      };
      
      animate();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating 3D object:', err);
      setError('Failed to load 3D model');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      const zoomScale = 0.9; // Zoom in by reducing distance
      const currentPosition = cameraRef.current.position.clone();
      cameraRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 1 - zoomScale);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      const zoomScale = 1.1; // Zoom out by increasing distance
      const currentPosition = cameraRef.current.position.clone();
      cameraRef.current.position.multiplyScalar(zoomScale);
      controlsRef.current.update();
    }
  };

  const handleRotate = () => {
    if (sceneRef.current && sceneRef.current.children.length > 2) {
      // The first 2 children are lights, the 3rd is our model
      const model = sceneRef.current.children[2];
      model.rotation.y += Math.PI / 2;
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
      <div ref={containerRef} className="h-full w-full" />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg p-2 flex flex-col space-y-2">
        <button
          className="p-2 text-white hover:text-blue-400 transition-colors"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="p-2 text-white hover:text-blue-400 transition-colors"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          className="p-2 text-white hover:text-blue-400 transition-colors"
          onClick={handleRotate}
          title="Rotate"
        >
          <RotateCw size={20} />
        </button>
        <button
          className="p-2 text-white hover:text-blue-400 transition-colors"
          onClick={handleReset}
          title="Reset View"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      {/* Patient info overlay */}
      {metadata && (
        <div className="absolute top-2 left-2 text-white p-2 rounded bg-black bg-opacity-50">
          <div className="text-sm font-semibold">{metadata.patientName}</div>
          <div className="text-xs">ID: {metadata.patientId}</div>
          <div className="text-xs">Date: {metadata.studyDate}</div>
          <div className="text-xs">Type: 3D {metadata.modality}</div>
        </div>
      )}
      
      {/* 3D model indicator */}
      <div className="absolute bottom-4 left-4 bg-purple-600 text-white rounded-lg py-1 px-3 flex items-center">
        <Box size={16} className="mr-1" />
        <span className="text-sm font-medium">3D Model</span>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-2"></div>
            <div className="text-white text-lg">Loading 3D model...</div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-red-900 text-white p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-2">Error</h3>
            <p>{error}</p>
            <button 
              className="mt-4 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};