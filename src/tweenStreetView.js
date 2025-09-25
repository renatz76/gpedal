// src/tweenStreetView.js

function shortestDeltaAngle(from, to) {
  // Normalize to the shortest path in [-180, 180)
  let d = ((to - from + 540) % 360) - 180;
  return d;
}

export async function tweenStreetView(pano, from, to, duration = 500) {
  const start = performance.now();

  const lat0 = from.lat, lng0 = from.lng;
  const h0 = from.heading, p0 = from.pitch, z0 = from.zoom ?? 1;

  const dLat = to.lat - lat0;
  const dLng = to.lng - lng0;
  const dHead = shortestDeltaAngle(h0, to.heading);
  const dPitch = to.pitch - p0;
  const dZoom = (to.zoom ?? 1) - z0;

  return new Promise(resolve => {
    function frame(t) {
      const k = Math.min(1, (t - start) / duration);
      const e = k < 0.5 ? 2*k*k : -1 + (4 - 2*k)*k; // ease-in-out

      pano.setPosition({ lat: lat0 + dLat*e, lng: lng0 + dLng*e });
      pano.setPov({ heading: h0 + dHead*e, pitch: p0 + dPitch*e, zoom: z0 + dZoom*e });

      if (k < 1) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
}
