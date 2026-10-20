/* Additional fictional presentation workload. City points are approximate display hubs, not vehicle positions. */
const presentationCities={
  "shanghai": {
    "lat": 31.23,
    "lon": 121.47,
    "code": "SHA",
    "name": "Shanghai"
  },
  "los angeles": {
    "lat": 34.05,
    "lon": -118.24,
    "code": "LAX",
    "name": "Los Angeles"
  },
  "busan": {
    "lat": 35.18,
    "lon": 129.08,
    "code": "PUS",
    "name": "Busan"
  },
  "long beach": {
    "lat": 33.77,
    "lon": -118.19,
    "code": "LGB",
    "name": "Long Beach"
  },
  "ningbo": {
    "lat": 29.87,
    "lon": 121.55,
    "code": "NGB",
    "name": "Ningbo"
  },
  "houston": {
    "lat": 29.76,
    "lon": -95.37,
    "code": "HOU",
    "name": "Houston"
  },
  "rotterdam": {
    "lat": 51.92,
    "lon": 4.48,
    "code": "RTM",
    "name": "Rotterdam"
  },
  "veracruz": {
    "lat": 19.17,
    "lon": -96.13,
    "code": "VER",
    "name": "Veracruz"
  },
  "hamburg": {
    "lat": 53.55,
    "lon": 9.99,
    "code": "HAM",
    "name": "Hamburg"
  },
  "new york": {
    "lat": 40.71,
    "lon": -74.01,
    "code": "NYC",
    "name": "New York"
  },
  "singapore": {
    "lat": 1.35,
    "lon": 103.82,
    "code": "SIN",
    "name": "Singapore"
  },
  "manzanillo": {
    "lat": 19.05,
    "lon": -104.32,
    "code": "ZLO",
    "name": "Manzanillo"
  },
  "kaohsiung": {
    "lat": 22.63,
    "lon": 120.3,
    "code": "KHH",
    "name": "Kaohsiung"
  },
  "lazaro cardenas": {
    "lat": 17.96,
    "lon": -102.2,
    "code": "LZC",
    "name": "Lázaro Cárdenas"
  },
  "yokohama": {
    "lat": 35.44,
    "lon": 139.64,
    "code": "YOK",
    "name": "Yokohama"
  },
  "dallas": {
    "lat": 32.78,
    "lon": -96.8,
    "code": "DAL",
    "name": "Dallas"
  },
  "queretaro": {
    "lat": 20.59,
    "lon": -100.39,
    "code": "QRO",
    "name": "Querétaro"
  },
  "guadalajara": {
    "lat": 20.67,
    "lon": -103.35,
    "code": "GDL",
    "name": "Guadalajara"
  },
  "puebla": {
    "lat": 19.04,
    "lon": -98.21,
    "code": "PBC",
    "name": "Puebla"
  },
  "frankfurt": {
    "lat": 50.11,
    "lon": 8.68,
    "code": "FRA",
    "name": "Frankfurt"
  },
  "seoul": {
    "lat": 37.57,
    "lon": 126.98,
    "code": "SEL",
    "name": "Seoul"
  },
  "tokyo": {
    "lat": 35.68,
    "lon": 139.69,
    "code": "TYO",
    "name": "Tokyo"
  },
  "sao paulo": {
    "lat": -23.55,
    "lon": -46.63,
    "code": "SAO",
    "name": "São Paulo"
  },
  "amsterdam": {
    "lat": 52.37,
    "lon": 4.9,
    "code": "AMS",
    "name": "Amsterdam"
  }
};
const presentationShipments=[
  [
    "Northstar Components",
    "Ocean · FCL",
    "Shanghai, CN",
    "Los Angeles, CA",
    "water",
    "2026-10-27T11:00",
    "Sensor assemblies",
    18,
    14600,
    "2026-10-10"
  ],
  [
    "Pacific Microdevices",
    "Ocean · LCL",
    "Busan, KR",
    "Long Beach, CA",
    "water",
    "2026-10-25T09:00",
    "Semiconductor components",
    8,
    4200,
    "2026-10-09"
  ],
  [
    "Meridian Industrial",
    "Ocean · FCL",
    "Ningbo, CN",
    "Houston, TX",
    "water",
    "2026-11-02T14:00",
    "Industrial motors",
    22,
    21400,
    "2026-10-08"
  ],
  [
    "Bajío Manufacturing",
    "Ocean · FCL",
    "Rotterdam, NL",
    "Veracruz, MX",
    "water",
    "2026-11-01T10:00",
    "Production tooling",
    16,
    15800,
    "2026-10-11"
  ],
  [
    "Atlas Medical Devices",
    "Ocean · LCL",
    "Hamburg, DE",
    "New York, NY",
    "water",
    "2026-10-25T12:00",
    "Diagnostic equipment",
    10,
    5600,
    "2026-10-12"
  ],
  [
    "Pacific Microdevices",
    "Ocean · FCL",
    "Singapore, SG",
    "Manzanillo, MX",
    "water",
    "2026-11-03T08:00",
    "Power modules",
    20,
    18200,
    "2026-10-09"
  ],
  [
    "Northstar Components",
    "Ocean · FCL",
    "Kaohsiung, TW",
    "Lázaro Cárdenas, MX",
    "water",
    "2026-10-29T13:00",
    "Automotive connectors",
    24,
    16700,
    "2026-10-07"
  ],
  [
    "Meridian Industrial",
    "Ocean · FCL",
    "Yokohama, JP",
    "Los Angeles, CA",
    "port",
    "2026-10-19T14:00",
    "Machine spares",
    12,
    11800,
    "2026-10-03"
  ],
  [
    "Northstar Components",
    "Ground · FTL",
    "Los Angeles, CA",
    "El Paso, TX",
    "transit",
    "2026-10-20T16:00",
    "Sensor assemblies",
    18,
    14600,
    "2026-10-18"
  ],
  [
    "Pacific Microdevices",
    "Ground · FTL",
    "Long Beach, CA",
    "Laredo, TX",
    "transit",
    "2026-10-21T11:00",
    "Electronic subassemblies",
    14,
    9800,
    "2026-10-18"
  ],
  [
    "Meridian Industrial",
    "Ground · FTL",
    "Houston, TX",
    "Monterrey, MX",
    "transit",
    "2026-10-20T10:00",
    "Production-line parts",
    16,
    12700,
    "2026-10-18"
  ],
  [
    "Atlas Medical Devices",
    "Ground · FTL",
    "Dallas, TX",
    "Mexico City, MX",
    "transit",
    "2026-10-21T15:00",
    "Medical device housings",
    10,
    6400,
    "2026-10-18"
  ],
  [
    "Bajío Manufacturing",
    "Ground · FTL",
    "Laredo, TX",
    "Querétaro, MX",
    "transit",
    "2026-10-20T17:00",
    "Automotive tooling",
    20,
    17400,
    "2026-10-18"
  ],
  [
    "Northstar Components",
    "Ground · FTL",
    "Guadalajara, MX",
    "El Paso, TX",
    "delivery",
    "2026-10-19T15:00",
    "Control panels",
    12,
    8600,
    "2026-10-17"
  ],
  [
    "Bajío Manufacturing",
    "Ground · FTL",
    "Veracruz, MX",
    "Puebla, MX",
    "pickup",
    "2026-10-20T14:00",
    "Packaging machinery",
    8,
    11400,
    "2026-10-19"
  ],
  [
    "Atlas Medical Devices",
    "Air · Express",
    "Frankfurt, DE",
    "Mexico City, MX",
    "transit",
    "2026-10-20T08:00",
    "Urgent diagnostic parts",
    4,
    680,
    "2026-10-18"
  ],
  [
    "Pacific Microdevices",
    "Air · Express",
    "Seoul, KR",
    "Dallas, TX",
    "transit",
    "2026-10-19T18:00",
    "Priority microcontrollers",
    5,
    520,
    "2026-10-18"
  ],
  [
    "Northstar Components",
    "Air · Express",
    "Tokyo, JP",
    "Chicago, IL",
    "transit",
    "2026-10-20T12:00",
    "Precision sensors",
    3,
    390,
    "2026-10-18"
  ],
  [
    "Meridian Industrial",
    "Air · Express",
    "São Paulo, BR",
    "Houston, TX",
    "transit",
    "2026-10-20T07:00",
    "Aircraft maintenance parts",
    6,
    1180,
    "2026-10-18"
  ],
  [
    "Atlas Medical Devices",
    "Air · Express",
    "Amsterdam, NL",
    "Guadalajara, MX",
    "pickup",
    "2026-10-22T09:00",
    "Calibration equipment",
    4,
    740,
    "2026-10-19"
  ]
].map(([customer,mode,origin,destination,status,eta,cargo,units,weight,etd],index)=>{
 const number=3101+index,id=`RDS-26-${String(number).padStart(5,'0')}`;
 const ocean=mode.startsWith('Ocean'),air=mode.startsWith('Air');
 const owner=[['Sofía Martínez','SM'],['Daniel Reyes','DR'],['Alex Rivera','AR']][index%3];
 const delayed=[2,5,10,14,18].includes(index),updated=delayed?'2026-10-18T17:20':`2026-10-19T08:${String(10+index*2).padStart(2,'0')}`;
 return{id,customer,mode,origin,destination,status,eta,cargo,units,weight,etd,owner:owner[0],initials:owner[1],updated,
  container:ocean?`DEMO-CN-${number}`:air?`AWB · DEMO-${number}`:`53ft VAN · DEMO-${number}`,
  carrier:ocean?'Royal Ocean Partner · Demo':air?'Royal Air Partner · Demo':'Crossborder Transport · Demo',
  shipper:`${customer} · ${origin.split(',')[0]} · Demo`,consignee:`${customer} · ${destination.split(',')[0]} · Demo`,
  address:`Demo destination facility · ${destination}`,reference:`DEMO-BOOK-${number}`,pieces:air?'Crates':'Pallets',
  packageType:air?'Crates':'Pallets',freightTerms:'Prepaid',presentationSample:true,
  events:[{en:'Presentation sample loaded · Illustrative route and status.',es:'Muestra de presentación · Ruta y estado ilustrativos.',time:updated.replace('T',' · ')}]};
});
function applyPresentationWorkload(current){
 if(current.presentationWorkloadVersion>=1)return current;
 const known=new Set(current.shipments.map(s=>s.id));
 current.shipments.push(...structuredClone(presentationShipments.filter(s=>!known.has(s.id))));
 current.presentationWorkloadVersion=1;
 return current;
}
