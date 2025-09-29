
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, RefreshCw, Home, Sun, Moon } from 'lucide-react';
import {AboutDialog} from "@/components/AboutDialog.tsx";
import {useTheme} from "@/components/theme/useTheme.ts";
import {MagicalText} from 'react-halloween';

const colors = ['#9084FF','#E40078']

// Color space conversion utilities
const RGBtoHSL = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h, s, l];
};

const HSLtoRGB = (h: number, s: number, l: number): [number, number, number] => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const getBucket = (r: number, g: number, b: number, isHighVariety: boolean): string => {
  const bucketSize = isHighVariety ? 64 : 32;
  const rBucket = Math.floor(r / bucketSize) * bucketSize;
  const gBucket = Math.floor(g / bucketSize) * bucketSize;
  const bBucket = Math.floor(b / bucketSize) * bucketSize;
  return `${rBucket.toString(16).padStart(2, '0')}${gBucket.toString(16).padStart(2, '0')}${bBucket.toString(16).padStart(2, '0')}`;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

interface ColorData {
  r: number;
  g: number;
  b: number;
  hex: string;
}

interface BucketData {
  count: number;
  r: number;
  g: number;
  b: number;
}

const ColorPaletteGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [buckets, setBuckets] = useState<[string, BucketData][]>([]);
  const [normalPalette, setNormalPalette] = useState<ColorData[]>([]);
  const [complementaryPalette, setComplementaryPalette] = useState<ColorData[]>([]);
  const [hueOffset, setHueOffset] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [, setIsProcessing] = useState(false);// TODO: use processing variable?
  const [isMuller, setIsMuller] = useState(false);
  const [isHighVariety, setIsHighVariety] = useState(false);
  const [numColors, setNumColors] = useState(10);
  const { theme, setTheme } = useTheme();

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const darkMode = theme === 'dark' || theme === 'system' && mediaQuery.matches;
  const setDarkMode = useCallback((value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  }, [setTheme]);

  const goHome = () => {
    window.location.href = "https://patorjk.com/";
  }

  const analyzeImage = useCallback((imgElement: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    let width = imgElement.width;
    let height = imgElement.height;
    const maxDim = 600;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = (height / width) * maxDim;
        width = maxDim;
      } else {
        width = (width / height) * maxDim;
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const bucketMap: { [key: string]: BucketData } = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const bucket = getBucket(r, g, b, isHighVariety);

      if (!bucketMap[bucket]) {
        bucketMap[bucket] = { count: 0, r: 0, g: 0, b: 0 };
      }

      bucketMap[bucket].count++;
      bucketMap[bucket].r += r;
      bucketMap[bucket].g += g;
      bucketMap[bucket].b += b;
    }

    const sortedBuckets = Object.entries(bucketMap)
      .sort((a, b) => b[1].count - a[1].count);

    setBuckets(sortedBuckets);
    generatePalettes(sortedBuckets, numColors, isMuller, hueOffset);
  },[hueOffset, isHighVariety, isMuller, numColors, setBuckets]);

  const generatePalettes = (
    bucketData: [string, BucketData][],
    count: number,
    muller: boolean,
    hOffset: number
  ) => {
    const limitedBuckets = bucketData.slice(0, Math.min(count, bucketData.length));

    const createPalette = (hOffsetValue: number, isMullerAlg: boolean = false): ColorData[] => {
      const mullerL = [0.65, 0.75, 0.9, 0.75, 0.65, 0.5, 0.35, 0.2, 0.35, 0.5];
      const mullerH = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return limitedBuckets.map(([_, bucket]) => {
        let r = bucket.r / bucket.count;
        let g = bucket.g / bucket.count;
        let b = bucket.b / bucket.count;

        // eslint-disable-next-line prefer-const
        let [h, s, l] = RGBtoHSL(r, g, b);
        h = (h + hOffsetValue + hOffset) % 1;
        if (h < 0) h += 1;

        if (isMullerAlg) {
          const mullerStep = 0.075;
          let smallestDiff = 10;
          let closestIndex = 2;
          let matchingIndex = -1;

          for (let j = 0; j < 10; j++) {
            const tempDiff = Math.abs(mullerL[j] - l);
            if (tempDiff < smallestDiff) {
              smallestDiff = tempDiff;
              closestIndex = j;
              matchingIndex = -1;
            } else if (tempDiff === smallestDiff) {
              matchingIndex = j;
            }
          }

          let hueIndex = closestIndex;
          if (matchingIndex !== -1) {
            let diff1 = Math.abs(h - mullerH[closestIndex]);
            if (diff1 >= 0.5) diff1 -= 0.5;
            let diff2 = Math.abs(h - mullerH[matchingIndex]);
            if (diff2 >= 0.5) diff2 -= 0.5;
            if (diff2 < diff1) {
              hueIndex = matchingIndex;
            }
          }

          const diff = mullerH[hueIndex] - h;
          if (Math.abs(diff) < mullerStep) {
            h = mullerH[hueIndex];
          } else {
            if (diff < 0) {
              h = (h + mullerStep) % 1;
            } else {
              h = (h - mullerStep + 1) % 1;
            }
          }
        }

        [r, g, b] = HSLtoRGB(h, s, l);
        return { r, g, b, hex: rgbToHex(r, g, b) };
      });
    };

    setNormalPalette(createPalette(0, muller));
    setComplementaryPalette(createPalette(0.5, muller));
  };

  useEffect(() => {
    if (buckets.length > 0) {
      generatePalettes(buckets, numColors, isMuller, hueOffset);
    }
  }, [numColors, isMuller, hueOffset,isHighVariety, buckets]);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [analyzeImage]);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        analyzeImage(img);
        setIsProcessing(false);
      };
      img.src = image;
    }
  }, [image, isHighVariety]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';
  const cardClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`min-h-screen ${bgClass} p-8 transition-colors duration-300 w-full`}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold ${darkMode ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} bg-clip-text text-transparent mb-3`}>
            <MagicalText text={"Color Palette Generator"} colors={colors} showAdornments={false} animationTime={20}/>
          </h1>
          <p className={`${textSecondaryClass} text-lg`}>
            Upload an image to extract its dominant colors
          </p>
        </div>

        {!image ? (
          <div
            className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all ${cardClass} ${
              dragActive ? 'border-indigo-500 bg-opacity-50' : borderClass
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${textSecondaryClass}`} />
            <h3 className={`text-xl font-semibold ${textClass} mb-2`}>
              Drop your image here
            </h3>
            <p className={`${textSecondaryClass} mb-6`}>or click to browse</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
            >
              Choose File
            </label>
          </div>
        ) : (
          <div>
            <div className={`flex justify-center relative mb-8 rounded-2xl overflow-hidden shadow-2xl ${cardClass} p-4`}>
              <button
                onClick={() => {
                  setImage(null);
                  setNormalPalette([]);
                  setComplementaryPalette([]);
                  setBuckets([]);
                  setHueOffset(0);
                }}
                className={`absolute top-6 right-6 z-10 p-2 ${cardClass} rounded-full shadow-lg hover:opacity-80 transition-opacity`}
              >
                <X className={`w-5 h-5 ${textSecondaryClass}`} />
              </button>
              <img src={image} alt="Uploaded" className="w-auto h-auto align-self justify-self rounded-lg"/>
            </div>

            {normalPalette.length > 0 && (
              <div className="space-y-8">
                <div className={`${cardClass} rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${textClass}`}>Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className={`${textClass} font-medium`}>Number of colors:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={numColors}
                        onChange={(e) => setNumColors(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                        className={`px-3 py-2 rounded-lg border ${borderClass} ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 ${textClass} font-medium cursor-pointer`}>
                        <input
                          type="checkbox"
                          checked={isMuller}
                          onChange={(e) => setIsMuller(e.target.checked)}
                          className="w-5 h-5 rounded"
                        />
                        Use Muller Colors algorithm
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 ${textClass} font-medium cursor-pointer`}>
                        <input
                          type="checkbox"
                          checked={isHighVariety}
                          onChange={(e) => setIsHighVariety(e.target.checked)}
                          className="w-5 h-5 rounded"
                        />
                        Use higher variety algorithm
                      </label>
                    </div>
                  </div>
                </div>

                <div className={`${cardClass} rounded-2xl p-6 shadow-lg`}>
                  <h3 className={`text-xl font-semibold ${textClass} mb-4`}>Normal Palette</h3>
                  <div className="grid grid-cols-5 max-sm:grid-cols-3 gap-4">
                    {normalPalette.map((color, idx) => (
                      <div key={idx} className="text-center">
                        <div
                          className="w-full h-20 rounded-lg shadow-md mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className={`text-sm font-mono ${textSecondaryClass}`}>{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${cardClass} rounded-2xl p-6 shadow-lg`}>
                  <h3 className={`text-xl font-semibold ${textClass} mb-4`}>Complementary Palette</h3>
                  <div className="grid grid-cols-5 max-sm:grid-cols-3 gap-4">
                    {complementaryPalette.map((color, idx) => (
                      <div key={idx} className="text-center">
                        <div
                          className="w-full h-20 rounded-lg shadow-md mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className={`text-sm font-mono ${textSecondaryClass}`}>{color.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${cardClass} rounded-2xl p-6 shadow-lg`}>
                  <h3 className={`text-xl font-semibold ${textClass} mb-4 flex items-center gap-2`}>
                    <RefreshCw className="w-5 h-5" />
                    Adjust Hue
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hueOffset * 100}
                    onChange={(e) => setHueOffset(parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center flex flex-cols align-center justify-center space-x-4">

          <AboutDialog cardClass={cardClass} textClass={textClass} />

          <button
            onClick={() => goHome()}
            className={`inline-flex items-center gap-2 px-6 py-3 ${cardClass} rounded-lg shadow-lg hover:opacity-80 transition-opacity`}
          >
            <Home className={`w-5 h-5 ${textClass}`} />
            <span className={textClass}>Home</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-6 py-3 rounded-lg ${cardClass} shadow-lg hover:opacity-80 transition-opacity flex flex-cols items-center gap-2 justify-center`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />} Theme
          </button>
        </div>

      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
