// const data = require("./zip_codes.json");
// const fs = require("fs");
// const { point } = require("@turf/helpers");
//
// const features = data.features;
// const lastIndex = features.length - 1;
//
// const boundariesWS = fs.createWriteStream("./usa_zip_boundaries.json");
// const centersWS = fs.createWriteStream("./usa_zip_centers.json");
//
// boundariesWS.write(`{`);
// centersWS.write(`{"type":"FeatureCollection","features":[`);
//
// features.forEach((feature, index) => {
//   const {
//     properties: { INTPTLAT10: lat, INTPTLON10: lng, ZCTA5CE10: code },
//     ...figure
//   } = feature;
//
//   boundariesWS.write(
//     `"${code}":${JSON.stringify({ ...figure, properties: { code } })}`
//   );
//   centersWS.write(`${JSON.stringify(point([+lng, +lat], { code }))}`);
//
//   if (lastIndex !== index) {
//     boundariesWS.write(`,`);
//     centersWS.write(`,`);
//   }
// });
//
// boundariesWS.end(`}`);
// centersWS.end(`]}`);

import { convertGeonameData } from "./geoname-convertors.js";

convertGeonameData("./CA_full.txt", "./canada_zip_centers.json", 892800);
convertGeonameData("./US.txt", "./usa_zip_centers.json", 41483);
