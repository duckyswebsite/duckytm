// ============================================================
//  tracker.js  –  Absolute maximum browser data collector
//  Line 11: replace with your webhook URL
//  Add to every page before </body>:
//    <script src="tracker.js"></script>
// ============================================================

(async () => {

  const WEBHOOK_URL = "https://discord.com/api/webhooks/1500519072344051973/kAqZ73qFLdjWkA3z-fdQ2fTO1dxbI7_6qRon2r5XnffiGfPuUeuHI93hYBli0QMrH6kg";

  if (localStorage.getItem("visitor_consent") !== "granted") return;
  const sessionKey = "tracked_" + window.location.pathname;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "1");
  if (/bot|crawl|spider|slurp|mediapartners/i.test(navigator.userAgent)) return;

  const safe = async (fn) => { try { return await fn(); } catch { return null; } };
  const safeSync = (fn) => { try { return fn(); } catch { return null; } };

  // ── Page & Navigation ─────────────────────────────────────
  const page         = document.title || "(no title)";
  const pageURL      = window.location.href;
  const referrer     = document.referrer || "Direct / None";
  const pageHistory  = history.length;
  const pageProtocol = window.location.protocol;
  const pageHost     = window.location.hostname;
  const pageHash     = window.location.hash || "none";
  const pageSearch   = window.location.search || "none";
  const docCharset   = document.characterSet || "unknown";
  const docReadyState= document.readyState;
  const domLoadTime  = safeSync(() => {
    const t = performance.timing;
    return t ? (t.domContentLoadedEventEnd - t.navigationStart) + "ms" : "unknown";
  }) || "unknown";
  const pageLoadTime = safeSync(() => {
    const t = performance.timing;
    return t ? (t.loadEventEnd - t.navigationStart) + "ms" : "unknown";
  }) || "unknown";
  const navType      = safeSync(() => {
    const types = ["navigate","reload","back_forward","prerender"];
    return types[performance.navigation?.type] || "unknown";
  }) || "unknown";
  const connectionTime = safeSync(() => {
    const t = performance.timing;
    return t ? (t.connectEnd - t.connectStart) + "ms" : "unknown";
  }) || "unknown";
  const dnsTime      = safeSync(() => {
    const t = performance.timing;
    return t ? (t.domainLookupEnd - t.domainLookupStart) + "ms" : "unknown";
  }) || "unknown";

  // ── User Agent & Browser ──────────────────────────────────
  const ua = navigator.userAgent;
  let browserName = "unknown", browserVersion = "unknown", osName = "unknown", osVersion = "unknown";
  if (/Firefox\/([\d.]+)/.test(ua))        { browserName = "Firefox";  browserVersion = RegExp.$1; }
  else if (/Edg\/([\d.]+)/.test(ua))       { browserName = "Edge";     browserVersion = RegExp.$1; }
  else if (/Chrome\/([\d.]+)/.test(ua))    { browserName = "Chrome";   browserVersion = RegExp.$1; }
  else if (/Safari\/([\d.]+)/.test(ua))    { browserName = "Safari";   browserVersion = RegExp.$1; }
  else if (/OPR\/([\d.]+)/.test(ua))       { browserName = "Opera";    browserVersion = RegExp.$1; }
  const winMatch = ua.match(/Windows NT ([\d.]+)/);
  if (winMatch) {
    const winVer = { "10.0":"10/11","6.3":"8.1","6.2":"8","6.1":"7","6.0":"Vista","5.1":"XP" };
    osName = "Windows"; osVersion = winVer[winMatch[1]] || winMatch[1];
  } else if (/Mac OS X ([\d_]+)/.test(ua)) { osName = "macOS"; osVersion = RegExp.$1.replace(/_/g,"."); }
  else if (/Android ([\d.]+)/.test(ua))    { osName = "Android"; osVersion = RegExp.$1; }
  else if (/iPhone OS ([\d_]+)/.test(ua))  { osName = "iOS"; osVersion = RegExp.$1.replace(/_/g,"."); }
  else if (/Linux/.test(ua))               { osName = "Linux"; osVersion = "unknown"; }

  const isMobile   = /Mobi|Android/i.test(ua);
  const isTablet   = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";
  const vendor     = navigator.vendor || "unknown";
  const appName    = navigator.appName || "unknown";
  const appVersion = navigator.appVersion?.substring(0, 100) || "unknown";
  const product    = navigator.product || "unknown";
  const buildID    = navigator.buildID || "unknown"; // Firefox only

  // ── Screen & Display ──────────────────────────────────────
  const screenRes      = `${screen.width}x${screen.height}`;
  const availRes       = `${screen.availWidth}x${screen.availHeight}`;
  const colorDepth     = `${screen.colorDepth}-bit`;
  const pixelDepth     = `${screen.pixelDepth}-bit`;
  const viewport       = `${window.innerWidth}x${window.innerHeight}`;
  const pixelRatio     = window.devicePixelRatio || 1;
  const screenOrient   = screen.orientation?.type || "unknown";
  const screenAngle    = screen.orientation?.angle ?? "unknown";
  const outerSize      = `${window.outerWidth}x${window.outerHeight}`;
  const scrollX        = window.scrollX;
  const scrollY        = window.scrollY;
  const colorGamut     = window.matchMedia("(color-gamut: p3)").matches ? "P3" :
                         window.matchMedia("(color-gamut: srgb)").matches ? "sRGB" : "unknown";
  const hdrSupport     = window.matchMedia("(dynamic-range: high)").matches ? "Yes" : "No";
  const prefColorScheme= window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
  const prefMotion     = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "Reduced" : "Normal";
  const prefContrast   = window.matchMedia("(prefers-contrast: more)").matches ? "More" : "Normal";
  const forcedColors   = window.matchMedia("(forced-colors: active)").matches ? "Yes" : "No";
  const inverted       = window.matchMedia("(inverted-colors: inverted)").matches ? "Yes" : "No";
  const pointer        = window.matchMedia("(pointer: fine)").matches ? "Fine (mouse)" :
                         window.matchMedia("(pointer: coarse)").matches ? "Coarse (touch)" : "None";
  const hover          = window.matchMedia("(hover: hover)").matches ? "Yes" : "No";

  // ── Hardware ──────────────────────────────────────────────
  const hardConc    = navigator.hardwareConcurrency ?? "unknown";
  const memGB       = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "unknown";
  const touchPoints = navigator.maxTouchPoints ?? "unknown";
  const platform    = navigator.platform || "unknown";

  // ── Network ───────────────────────────────────────────────
  const conn         = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  const connType     = conn.effectiveType || conn.type || "unknown";
  const connDownlink = conn.downlink ? conn.downlink + " Mbps" : "unknown";
  const connUplink   = conn.uplinkMax ? conn.uplinkMax + " Mbps" : "unknown";
  const connRTT      = conn.rtt != null ? conn.rtt + " ms" : "unknown";
  const saveData     = conn.saveData ? "Yes" : "No";

  // ── Battery ───────────────────────────────────────────────
  let battLevel = "unknown", battCharging = "unknown", battTimeLeft = "unknown", battChargingTime = "unknown";
  await safe(async () => {
    const b = await navigator.getBattery();
    battLevel       = Math.round(b.level * 100) + "%";
    battCharging    = b.charging ? "Yes" : "No";
    battTimeLeft    = b.dischargingTime !== Infinity ? Math.round(b.dischargingTime / 60) + " min" : "N/A";
    battChargingTime= b.chargingTime !== Infinity ? Math.round(b.chargingTime / 60) + " min" : "N/A";
  });

  // ── GPU & WebGL ───────────────────────────────────────────
  let gpuVendor = "unknown", gpuRenderer = "unknown", glVersion = "unknown",
      glslVersion = "unknown", maxTexSize = "unknown", maxViewport = "unknown",
      maxAniso = "unknown", antiAlias = "unknown";
  await safe(async () => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        gpuVendor   = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   || "unknown";
        gpuRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "unknown";
      }
      glVersion    = gl.getParameter(gl.VERSION)                   || "unknown";
      glslVersion  = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)  || "unknown";
      maxTexSize   = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const vp     = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      maxViewport  = vp ? `${vp[0]}x${vp[1]}` : "unknown";
      antiAlias    = gl.getContextAttributes()?.antialias ? "Yes" : "No";
      const aniExt = gl.getExtension("EXT_texture_filter_anisotropic") ||
                     gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
      if (aniExt) maxAniso = gl.getParameter(aniExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    }
  });
  const webgl2 = !!document.createElement("canvas").getContext("webgl2") ? "Yes" : "No";

  // ── Audio fingerprint ─────────────────────────────────────
  let audioFP = "unknown", sampleRate = "unknown", channelCount = "unknown", audioState = "unknown";
  await safe(async () => {
    const ctx    = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
    sampleRate   = ctx.sampleRate;
    channelCount = ctx.destination.channelCount;
    audioState   = ctx.state;
    const osc    = ctx.createOscillator();
    const anal   = ctx.createAnalyser();
    const gain   = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(anal); anal.connect(gain); gain.connect(ctx.destination);
    osc.start(0);
    await new Promise(r => setTimeout(r, 100));
    const buf = new Float32Array(anal.frequencyBinCount);
    anal.getFloatFrequencyData(buf);
    osc.stop(); ctx.close();
    let hash = 0;
    for (let i = 0; i < buf.length; i++) hash = (Math.imul(31, hash) + (buf[i] * 1000 | 0)) | 0;
    audioFP = (hash >>> 0).toString(16).toUpperCase();
  });

  // ── Canvas fingerprint ────────────────────────────────────
  let canvasFP = "unknown";
  await safe(async () => {
    const c = document.createElement("canvas");
    c.width = 280; c.height = 60;
    const ctx = c.getContext("2d");
    ctx.textBaseline = "top"; ctx.font = "16px Arial";
    ctx.fillStyle = "#f60"; ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069"; ctx.fillText("fp🔒",2,15);
    ctx.fillStyle = "rgba(102,204,0,0.8)"; ctx.fillText("fp🔒",4,17);
    ctx.strokeStyle = "#FF6B6B"; ctx.beginPath(); ctx.arc(50,35,15,0,Math.PI*2); ctx.stroke();
    const raw = c.toDataURL();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
    canvasFP = (hash >>> 0).toString(16).toUpperCase();
  });

  // ── WebRTC local IP leak ───────────────────────────────────
  let localIPs = [];
  await safe(() => new Promise(resolve => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel("");
    pc.createOffer().then(o => pc.setLocalDescription(o));
    const timer = setTimeout(() => { pc.close(); resolve(); }, 3000);
    pc.onicecandidate = e => {
      if (!e.candidate) { clearTimeout(timer); pc.close(); resolve(); return; }
      const match = e.candidate.candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
      if (match && !localIPs.includes(match[0])) localIPs.push(match[0]);
    };
  }));

  // ── Font detection ────────────────────────────────────────
  let detectedFonts = [];
  await safe(async () => {
    const testFonts = ["Arial","Verdana","Times New Roman","Courier New","Georgia","Trebuchet MS",
      "Comic Sans MS","Impact","Tahoma","Palatino","Garamond","Bookman","Arial Black","Helvetica",
      "Geneva","Monaco","Lucida Console","Segoe UI","Calibri","Cambria","Consolas","Gill Sans",
      "Century Gothic","Futura","Optima","Roboto","Open Sans","Lato","Montserrat","Ubuntu",
      "Noto Sans","Source Code Pro","Fira Code","JetBrains Mono"];
    const canvas = document.createElement("canvas");
    const ctx    = canvas.getContext("2d");
    ctx.font     = "72px monospace";
    const base   = ctx.measureText("mmmmmmmmmmlli").width;
    for (const font of testFonts) {
      ctx.font = `72px '${font}', monospace`;
      if (ctx.measureText("mmmmmmmmmmlli").width !== base) detectedFonts.push(font);
    }
  });

  // ── Installed plugins ─────────────────────────────────────
  const plugins = Array.from(navigator.plugins || []).map(p => p.name).filter(Boolean);

  // ── MIME types ────────────────────────────────────────────
  const mimeTypes = Array.from(navigator.mimeTypes || []).map(m => m.type).filter(Boolean);

  // ── Storage & APIs ────────────────────────────────────────
  const hasLocalStorage   = safeSync(() => { localStorage.setItem("_t","1"); localStorage.removeItem("_t"); return "Yes"; }) || "No";
  const hasSessionStorage = safeSync(() => { sessionStorage.setItem("_t","1"); sessionStorage.removeItem("_t"); return "Yes"; }) || "No";
  const hasIndexedDB      = !!window.indexedDB ? "Yes" : "No";
  const hasServiceWorker  = "serviceWorker" in navigator ? "Yes" : "No";
  const hasWebRTC         = !!window.RTCPeerConnection ? "Yes" : "No";
  const hasWebAssembly    = typeof WebAssembly === "object" ? "Yes" : "No";
  const hasWebGL          = !!document.createElement("canvas").getContext("webgl") ? "Yes" : "No";
  const hasWebP           = safeSync(() => document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp") ? "Yes" : "No") || "No";
  const hasWebSockets     = !!window.WebSocket ? "Yes" : "No";
  const hasWorkers        = !!window.Worker ? "Yes" : "No";
  const hasSharedWorkers  = !!window.SharedWorker ? "Yes" : "No";
  const hasNotification   = !!window.Notification ? "Yes" : "No";
  const hasPush           = "PushManager" in window ? "Yes" : "No";
  const hasVibration      = "vibrate" in navigator ? "Yes" : "No";
  const hasWakeLock       = "wakeLock" in navigator ? "Yes" : "No";
  const hasBluetooth      = "bluetooth" in navigator ? "Yes" : "No";
  const hasUSB            = "usb" in navigator ? "Yes" : "No";
  const hasNFC            = "nfc" in navigator ? "Yes" : "No";
  const hasGamepad        = "getGamepads" in navigator ? "Yes" : "No";
  const hasXR             = "xr" in navigator ? "Yes" : "No";  // VR/AR
  const hasEyeDropper     = "EyeDropper" in window ? "Yes" : "No";
  const hasCredentials    = "credentials" in navigator ? "Yes" : "No";
  const hasContacts       = "contacts" in navigator ? "Yes" : "No";
  const hasMediaSession   = "mediaSession" in navigator ? "Yes" : "No";
  const hasSpeechRecog    = !!(window.SpeechRecognition || window.webkitSpeechRecognition) ? "Yes" : "No";
  const hasSpeechSynth    = !!window.speechSynthesis ? "Yes" : "No";
  const hasCryptoAPI      = !!(window.crypto?.subtle) ? "Yes" : "No";

  // ── Speech synthesis voices ───────────────────────────────
  let voices = [];
  await safe(async () => {
    await new Promise(r => {
      if (speechSynthesis.getVoices().length) { voices = speechSynthesis.getVoices(); r(); }
      else { speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); r(); }; setTimeout(r, 1000); }
    });
  });
  const voiceList = voices.slice(0, 10).map(v => `${v.name} (${v.lang})`).join(", ") || "None";
  const voiceCount = voices.length;

  // ── Media devices (count only, no stream) ─────────────────
  let cameraCount = 0, micCount = 0, speakerCount = 0;
  await safe(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameraCount  = devices.filter(d => d.kind === "videoinput").length;
    micCount     = devices.filter(d => d.kind === "audioinput").length;
    speakerCount = devices.filter(d => d.kind === "audiooutput").length;
  });

  // ── Gamepads ──────────────────────────────────────────────
  const gamepads = Array.from(navigator.getGamepads?.() || []).filter(Boolean).map(g => g.id);

  // ── Permissions ───────────────────────────────────────────
  let permNotif = "unknown", permCamera = "unknown", permMic = "unknown",
      permGeo = "unknown", permClipboard = "unknown", permMidi = "unknown",
      permPush = "unknown", permPersist = "unknown";
  await safe(async () => { permNotif    = (await navigator.permissions.query({name:"notifications"})).state; });
  await safe(async () => { permCamera   = (await navigator.permissions.query({name:"camera"})).state; });
  await safe(async () => { permMic      = (await navigator.permissions.query({name:"microphone"})).state; });
  await safe(async () => { permGeo      = (await navigator.permissions.query({name:"geolocation"})).state; });
  await safe(async () => { permClipboard= (await navigator.permissions.query({name:"clipboard-read"})).state; });
  await safe(async () => { permMidi     = (await navigator.permissions.query({name:"midi"})).state; });
  await safe(async () => { permPush     = (await navigator.permissions.query({name:"push", userVisibleOnly:true})).state; });
  await safe(async () => { permPersist  = (await navigator.permissions.query({name:"persistent-storage"})).state; });

  // ── Precise GPS ───────────────────────────────────────────
  let preciseCoords = "Not granted / unavailable";
  await safe(() => new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos => { preciseCoords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)} (±${Math.round(pos.coords.accuracy)}m)`; resolve(); },
      ()  => resolve(),
      { timeout: 5000, maximumAge: 60000 }
    );
  }));

  // ── IP + Geo ──────────────────────────────────────────────
  let ip="unknown", city="?", region="?", country="?", countryCode="?",
      isp="?", geoTZ="?", loc="?", postal="?", asn="?", currency="?", callingCode="?";
  await safe(async () => {
    const geo    = await fetch("https://ipapi.co/json/", {cache:"no-store"}).then(r=>r.json());
    ip           = geo.ip            ?? ip;
    city         = geo.city          ?? city;
    region       = geo.region        ?? region;
    country      = geo.country_name  ?? country;
    countryCode  = geo.country_code  ?? countryCode;
    isp          = geo.org           ?? isp;
    geoTZ        = geo.timezone      ?? geoTZ;
    postal       = geo.postal        ?? postal;
    asn          = geo.asn           ?? asn;
    currency     = geo.currency      ?? currency;
    callingCode  = geo.country_calling_code ?? callingCode;
    loc          = geo.latitude && geo.longitude ? `${geo.latitude}, ${geo.longitude}` : "?";
  });

  // ── Timezone & locale ─────────────────────────────────────
  const tz          = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  const tzOffset    = new Date().getTimezoneOffset();
  const tzOffsetHrs = `UTC${tzOffset<=0?"+":"-"}${Math.abs(tzOffset/60)}`;
  const locale      = Intl.DateTimeFormat().resolvedOptions().locale || "unknown";
  const localTime   = new Date().toLocaleString();
  const utcTime     = new Date().toUTCString();
  const unixTime    = Date.now();
  const weekday     = new Date().toLocaleDateString("en-US",{weekday:"long"});
  const numberFmt   = safeSync(() => new Intl.NumberFormat().format(1234567.89)) || "unknown";
  const currencyFmt = safeSync(() => new Intl.NumberFormat(undefined,{style:"currency",currency:"USD"}).format(1)) || "unknown";

  // ── Performance & memory ──────────────────────────────────
  const jsHeapUsed  = safeSync(() => performance.memory?.usedJSHeapSize  ? (performance.memory.usedJSHeapSize  / 1048576).toFixed(1) + " MB" : "unknown") || "unknown";
  const jsHeapTotal = safeSync(() => performance.memory?.totalJSHeapSize ? (performance.memory.totalJSHeapSize / 1048576).toFixed(1) + " MB" : "unknown") || "unknown";
  const jsHeapLimit = safeSync(() => performance.memory?.jsHeapSizeLimit  ? (performance.memory.jsHeapSizeLimit  / 1048576).toFixed(1) + " MB" : "unknown") || "unknown";

  // ── Misc browser ─────────────────────────────────────────
  const language      = navigator.language || "unknown";
  const languages     = (navigator.languages || []).join(", ") || language;
  const cookieOK      = navigator.cookieEnabled ? "Yes" : "No";
  const doNotTrack    = navigator.doNotTrack === "1" ? "Yes" : "No";
  const online        = navigator.onLine ? "Yes" : "No";
  const pdfViewer     = navigator.pdfViewerEnabled ? "Yes" : "No";
  const javaEnabled   = safeSync(() => String(navigator.javaEnabled())) || "No";

  // ── Build 3 embeds ────────────────────────────────────────

  const embed1 = {
    title: "👁️ New Visitor — " + page,
    color: 0x7ee787,
    fields: [
      { name: "📄 Page",          value: `\`${pageURL}\``,                               inline: false },
      { name: "🔗 Referrer",      value: referrer,                                        inline: true  },
      { name: "📚 History Len",   value: `${pageHistory} | Nav: ${navType}`,              inline: true  },
      { name: "⏱️ Page Load",    value: `Load: ${pageLoadTime} | DOM: ${domLoadTime}\nDNS: ${dnsTime} | TCP: ${connectionTime}`, inline: false },
      { name: "🌐 IP",            value: `\`${ip}\``,                                     inline: true  },
      { name: "🏙️ Location",     value: `${city}, ${region}\n${country} ${countryCode} (${postal})`,   inline: true },
      { name: "📞 Calling Code",  value: callingCode,                                     inline: true  },
      { name: "💰 Currency",      value: currency,                                        inline: true  },
      { name: "🗺️ IP Coords",    value: loc !== "?" ? `[${loc}](https://maps.google.com/?q=${loc})` : "?", inline: true },
      { name: "📍 GPS (precise)", value: preciseCoords,                                   inline: false },
      { name: "📡 ISP",           value: isp,                                             inline: true  },
      { name: "🔢 ASN",           value: asn,                                             inline: true  },
      { name: "🕐 IP Timezone",   value: geoTZ,                                           inline: true  },
      { name: "📶 Local IPs",     value: localIPs.length ? localIPs.join(", ") : "None leaked", inline: true },
      { name: "🔌 Connection",    value: `${connType} | ↓${connDownlink} | ↑${connUplink} | RTT: ${connRTT} | Data Saver: ${saveData}`, inline: false },
      { name: "💻 OS",            value: `${osName} ${osVersion}`,                        inline: true  },
      { name: "🌐 Browser",       value: `${browserName} ${browserVersion}`,              inline: true  },
      { name: "📱 Device",        value: deviceType,                                      inline: true  },
      { name: "🖥️ Platform",     value: platform,                                        inline: true  },
      { name: "🏭 Vendor",        value: vendor,                                          inline: true  },
      { name: "🔨 Build ID",      value: buildID,                                         inline: true  },
    ],
    footer: { text: "Ducky Portfolio • Consented" },
    timestamp: new Date().toISOString(),
  };

  const embed2 = {
    title: "🖥️ Hardware & Display — " + page,
    color: 0x5865f2,
    fields: [
      { name: "🖥️ Screen",       value: `${screenRes} @${pixelRatio}x\nAvail: ${availRes}\nViewport: ${viewport}\nOuter: ${outerSize}\nColor: ${colorDepth} / Pixel: ${pixelDepth}`, inline: true },
      { name: "🎨 Display",       value: `Orientation: ${screenOrient} (${screenAngle}°)\nGamut: ${colorGamut} | HDR: ${hdrSupport}\nTheme: ${prefColorScheme} | Motion: ${prefMotion}\nContrast: ${prefContrast} | Forced: ${forcedColors}\nInverted: ${inverted}`, inline: true },
      { name: "🖱️ Input",        value: `Pointer: ${pointer}\nHover: ${hover}\nTouch Points: ${touchPoints}`, inline: true },
      { name: "📜 Scroll Pos",    value: `X: ${scrollX}px | Y: ${scrollY}px`,             inline: true  },
      { name: "⚙️ Hardware",      value: `CPU Cores: ${hardConc}\nRAM: ${memGB}\nDevice Memory: ${memGB}`, inline: true },
      { name: "🎮 GPU",           value: `${gpuVendor}\n${gpuRenderer}`.substring(0,256),  inline: false },
      { name: "🔧 WebGL",         value: `Ver: ${glVersion.substring(0,60)}\nGLSL: ${glslVersion.substring(0,60)}\nWebGL2: ${webgl2}\nAA: ${antiAlias}\nMax Tex: ${maxTexSize}\nViewport: ${maxViewport}\nAniso: ${maxAniso}`, inline: true },
      { name: "🔋 Battery",       value: `Level: ${battLevel}\nCharging: ${battCharging}\nTime left: ${battTimeLeft}\nCharge time: ${battChargingTime}`, inline: true },
      { name: "🎵 Audio",         value: `FP: \`${audioFP}\`\nSample Rate: ${sampleRate}\nChannels: ${channelCount}\nState: ${audioState}`, inline: true },
      { name: "🔊 Media Devices", value: `Cameras: ${cameraCount}\nMicrophones: ${micCount}\nSpeakers: ${speakerCount}`, inline: true },
      { name: "🕹️ Gamepads",     value: gamepads.length ? gamepads.join(", ").substring(0,200) : "None connected", inline: true },
      { name: "🗣️ Speech Voices", value: `Count: ${voiceCount}\n${voiceList}`.substring(0,256), inline: false },
      { name: "💾 JS Heap",       value: `Used: ${jsHeapUsed}\nTotal: ${jsHeapTotal}\nLimit: ${jsHeapLimit}`, inline: true },
    ],
    footer: { text: "Ducky Portfolio • Consented" },
    timestamp: new Date().toISOString(),
  };

  const embed3 = {
    title: "🌐 Browser & Fingerprint — " + page,
    color: 0xf0e68c,
    fields: [
      { name: "🗣️ Language",      value: `${language}\nAll: ${languages}`,                inline: true  },
      { name: "🌍 Timezone",       value: `${tz} (${tzOffsetHrs})`,                        inline: true  },
      { name: "🌐 Locale",         value: locale,                                           inline: true  },
      { name: "📅 Weekday",        value: weekday,                                          inline: true  },
      { name: "🔢 Number Format",  value: numberFmt,                                        inline: true  },
      { name: "💲 Currency Fmt",   value: currencyFmt,                                      inline: true  },
      { name: "🕒 Local Time",     value: localTime,                                        inline: true  },
      { name: "🌐 UTC",            value: utcTime,                                          inline: true  },
      { name: "⏱️ Unix",          value: String(unixTime),                                 inline: true  },
      { name: "🍪 Cookies",        value: cookieOK,                                         inline: true  },
      { name: "📵 DNT",            value: doNotTrack,                                       inline: true  },
      { name: "🌐 Online",         value: online,                                           inline: true  },
      { name: "📄 PDF Viewer",     value: pdfViewer,                                        inline: true  },
      { name: "☕ Java",            value: javaEnabled,                                      inline: true  },
      { name: "🔏 Canvas FP",      value: `\`${canvasFP}\``,                                inline: true  },
      { name: "🔊 Audio FP",       value: `\`${audioFP}\``,                                 inline: true  },
      { name: "🔐 Permissions",    value: `Notif: ${permNotif} | Cam: ${permCamera}\nMic: ${permMic} | Geo: ${permGeo}\nClipboard: ${permClipboard} | MIDI: ${permMidi}\nPush: ${permPush} | Persist: ${permPersist}`, inline: false },
      { name: "🛠️ APIs",           value: `WS: ${hasWebSockets} | SW: ${hasServiceWorker} | Workers: ${hasWorkers}\nSharedWorkers: ${hasSharedWorkers} | WebRTC: ${hasWebRTC}\nWASM: ${hasWebAssembly} | WebGL: ${hasWebGL} | WebP: ${hasWebP}\nNotif: ${hasNotification} | Push: ${hasPush} | Vibrate: ${hasVibration}\nWakeLock: ${hasWakeLock} | BT: ${hasBluetooth} | USB: ${hasUSB}\nNFC: ${hasNFC} | Gamepad: ${hasGamepad} | XR: ${hasXR}\nEyeDropper: ${hasEyeDropper} | Contacts: ${hasContacts}\nMediaSession: ${hasMediaSession} | Speech🎤: ${hasSpeechRecog}\nSpeech🔊: ${hasSpeechSynth} | Crypto: ${hasCryptoAPI} | Credentials: ${hasCredentials}`, inline: false },
      { name: "💾 Storage",        value: `localStorage: ${hasLocalStorage} | sessionStorage: ${hasSessionStorage}\nIndexedDB: ${hasIndexedDB} | ServiceWorker: ${hasServiceWorker}`, inline: false },
      { name: "🔤 Fonts",          value: detectedFonts.length ? detectedFonts.join(", ").substring(0,256) : "None", inline: false },
      { name: "🔌 Plugins",        value: plugins.length ? plugins.join(", ").substring(0,256) : "None", inline: false },
      { name: "📋 MIME Types",     value: mimeTypes.length ? mimeTypes.join(", ").substring(0,256) : "None", inline: false },
      { name: "🤖 User Agent",     value: `\`\`\`${ua.substring(0,990)}\`\`\``,             inline: false },
    ],
    footer: { text: "Ducky Portfolio • Visitor consented to data collection" },
    timestamp: new Date().toISOString(),
  };

  await safe(async () => {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed1, embed2, embed3] }),
    });
  });

})();