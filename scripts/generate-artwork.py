"""
VKS Film Production — procedural liquid-paint artwork generator.

Renders original, license-free fluid paint artwork (domain-warped noise with
glossy lighting) in the brand palette, exported as optimised WebP.

    python scripts/generate-artwork.py            # all assets
    python scripts/generate-artwork.py hero cta   # only matching names

Every file written here is ORIGINAL ARTWORK, not photography and not client
work. Demo project posters are clearly labelled as demo in the UI.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets"
PUBLIC = ROOT / "public"

HEX = {
    "magenta": "#FF168F",
    "cyan": "#00D9FF",
    "blue": "#335CFF",
    "violet": "#8B4DFF",
    "orange": "#FF781F",
    "yellow": "#FFD13D",
    "ink": "#0B0B12",
    "white": "#F8F7FC",
}


def rgb(name):
    h = HEX[name].lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], dtype=np.float32)


# --------------------------------------------------------------------------- noise
class Noise:
    def __init__(self, seed, n=256):
        self.n = n
        self.t = np.random.default_rng(seed).random((n, n), dtype=np.float32)

    def __call__(self, x, y):
        m = self.n - 1
        xi = np.floor(x).astype(np.int32)
        yi = np.floor(y).astype(np.int32)
        fx = x - xi
        fy = y - yi
        u = fx * fx * (3 - 2 * fx)
        v = fy * fy * (3 - 2 * fy)
        x0, x1 = xi & m, (xi + 1) & m
        y0, y1 = yi & m, (yi + 1) & m
        t = self.t
        a = t[y0, x0] + (t[y0, x1] - t[y0, x0]) * u
        b = t[y1, x0] + (t[y1, x1] - t[y1, x0]) * u
        return a + (b - a) * v


def fbm(noise, x, y, octaves=5, gain=0.47):
    total = np.zeros_like(x)
    amp, norm = 0.5, 0.0
    c, s = 0.8, 0.6
    for _ in range(octaves):
        total += amp * noise(x, y)
        norm += amp
        x, y = (c * x - s * y) * 2.02 + 3.1, (s * x + c * y) * 2.02 + 1.7
        amp *= gain
    return total / norm


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def grid(w, h, scale):
    """Noise-space coordinates (y spans `scale`, x keeps aspect)."""
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    return xs / h * scale, ys / h * scale


def norm_coords(w, h, cx=0.5, cy=0.5):
    """Coordinates where the shorter side spans [-1, 1]."""
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    m = min(w, h) / 2
    return (xs - cx * w) / m, (ys - cy * h) / m


# --------------------------------------------------------------------------- paint
def fluid(w, h, seed, scale=2.2, warp=4.0, octaves=5, flow=(0.0, 0.0)):
    nz = Noise(seed)
    x, y = grid(w, h, scale)
    x = x + flow[0] * y
    y = y + flow[1] * x
    qx = fbm(nz, x, y, octaves)
    qy = fbm(nz, x + 5.2, y + 1.3, octaves)
    rx = fbm(nz, x + warp * qx + 1.7, y + warp * qy + 9.2, octaves)
    ry = fbm(nz, x + warp * qx + 8.3, y + warp * qy + 2.8, octaves)
    f = fbm(nz, x + warp * rx, y + warp * ry, octaves)
    return (qx, qy), (rx, ry), f, scale / h


def paint(field, palette, offset=0.0, bands=1.6, depth=0.9, gloss=0.6,
          relief=0.24, low=0.22, high=0.72, sheen=0.0):
    (qx, qy), (rx, ry), f, px = field
    pal = np.stack([rgb(c) if isinstance(c, str) else np.asarray(c, np.float32) for c in palette])
    n = len(pal)

    # palette position — plateaus give "pure" paint with quick blends between pigments
    t = (qx * 1.15 + ry * 1.45 + f * 0.9) * bands + offset
    seg = (t - np.floor(t)) * n
    i = np.floor(seg).astype(np.int32)
    fr = smoothstep(0.28, 0.72, seg - i)[..., None]
    col = pal[i % n] * (1 - fr) + pal[(i + 1) % n] * fr

    # depth: folds of the fluid fall into cinematic black
    v = smoothstep(low, high, f * 0.75 + np.hypot(rx, ry) * 0.35)
    col = col * (1 - depth + depth * (v ** 1.25))[..., None]

    # glossy liquid lighting from the warped height field
    hgt = f * 0.6 + rx * 0.4
    gy, gx = np.gradient(hgt, px)
    nx, ny, nzv = -gx * relief, -gy * relief, np.ones_like(gx)
    ln = np.sqrt(nx * nx + ny * ny + 1)
    nx, ny, nzv = nx / ln, ny / ln, nzv / ln
    L = np.array([-0.45, -0.55, 0.7], np.float32)
    L /= np.linalg.norm(L)
    H = L + np.array([0, 0, 1], np.float32)
    H /= np.linalg.norm(H)
    diff = np.clip(nx * L[0] + ny * L[1] + nzv * L[2], 0, 1)
    spec = np.clip(nx * H[0] + ny * H[1] + nzv * H[2], 0, 1) ** 48
    col = col * (0.5 + 0.62 * diff)[..., None] + (spec * gloss * (0.25 + 0.75 * v))[..., None]

    if sheen:  # thin luminous filaments, like ink tendrils
        fil = smoothstep(0.965, 1.0, np.abs(np.sin(rx * 38 + qy * 9)))
        col = col + (fil * sheen * v)[..., None] * col.clip(0.2, 1)

    return np.clip(col, 0, 1)


# --------------------------------------------------------------------------- masks
def angular_spikes(a, seed, count=18, width=(0.03, 0.12), length=(0.1, 0.5)):
    rng = np.random.default_rng(seed)
    s = np.zeros_like(a)
    for _ in range(count):
        ak = rng.uniform(-math.pi, math.pi)
        wk = rng.uniform(*width)
        lk = rng.uniform(*length)
        d = np.angle(np.exp(1j * (a - ak)))
        s = np.maximum(s, lk * np.exp(-(d / wk) ** 2))
    return s


def droplets(w, h, seed, count, centre, r_range, size_range, inner=0.0):
    """Splatter dots radiating from a centre (normalised coords)."""
    rng = np.random.default_rng(seed)
    x, y = norm_coords(w, h, *centre)
    m = np.zeros((h, w), np.float32)
    for _ in range(count):
        ang = rng.uniform(-math.pi, math.pi)
        rad = rng.uniform(*r_range)
        size = rng.uniform(*size_range) * (1.2 - 0.6 * (rad - r_range[0]) / max(1e-3, r_range[1] - r_range[0]))
        dx, dy = math.cos(ang) * rad, math.sin(ang) * rad
        # elongated along the radial direction, like flung paint
        u = (x - dx) * math.cos(ang) + (y - dy) * math.sin(ang)
        v = -(x - dx) * math.sin(ang) + (y - dy) * math.cos(ang)
        d = np.sqrt((u / (size * 1.9)) ** 2 + (v / size) ** 2)
        m = np.maximum(m, smoothstep(1.0, 0.75, d))
    return m


def burst_mask(w, h, seed, centre=(0.5, 0.5), inner=0.36, outer=0.7, spikes=22,
               edge=0.012, wobble=0.12, splat=120):
    nz = Noise(seed + 99)
    x, y = norm_coords(w, h, *centre)
    gx, gy = grid(w, h, 3.0)
    d = np.hypot(x, y) + (fbm(nz, gx, gy, 4) - 0.5) * wobble
    a = np.arctan2(y, x)
    R = outer + angular_spikes(a, seed, spikes, (0.015, 0.07), (0.06, 0.3))
    R += (fbm(nz, gx * 4, gy * 4, 3) - 0.5) * 0.05
    R += (fbm(nz, np.cos(a) * 2 + 7, np.sin(a) * 2 + 3, 4) - 0.5) * 0.2
    body = smoothstep(R + edge, R - edge, d)
    if inner:
        body *= smoothstep(inner - edge, inner + edge, d)
    drops = droplets(w, h, seed + 7, splat, centre, (outer * 1.05, outer * 1.75), (0.006, 0.028))
    return np.maximum(body, drops)


def ribbon_mask(w, h, seed, points, width=0.16, edge=0.01, splat=70, taper=True):
    """A flowing paint trail through `points` (pixel-fraction coords)."""
    nz = Noise(seed + 41)
    pts = np.array(points, np.float32) * np.array([w, h], np.float32)
    # Catmull-Rom sample the path
    path = []
    P = np.vstack([pts[0], pts, pts[-1]])
    for k in range(1, len(P) - 2):
        for t in np.linspace(0, 1, 40, endpoint=False):
            p0, p1, p2, p3 = P[k - 1], P[k], P[k + 1], P[k + 2]
            t2, t3 = t * t, t * t * t
            path.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
                                + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    path.append(pts[-1])
    path = np.array(path)
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    best = np.full((h, w), 1e9, np.float32)
    along = np.zeros((h, w), np.float32)
    for idx in range(len(path) - 1):
        a, b = path[idx], path[idx + 1]
        ab = b - a
        L2 = float(ab @ ab) + 1e-6
        t = np.clip(((xs - a[0]) * ab[0] + (ys - a[1]) * ab[1]) / L2, 0, 1)
        dx = xs - (a[0] + t * ab[0])
        dy = ys - (a[1] + t * ab[1])
        d = dx * dx + dy * dy
        upd = d < best
        best = np.where(upd, d, best)
        along = np.where(upd, (idx + t) / (len(path) - 1), along)
    dist = np.sqrt(best) / min(w, h)
    gx, gy = grid(w, h, 3.5)
    wv = width * (0.65 + 0.7 * fbm(nz, gx, gy, 4))
    if taper:
        wv *= np.clip(np.sin(along * math.pi) * 1.4, 0.15, 1)
    body = smoothstep(wv + edge, wv - edge, dist)
    # flung droplets along the trail
    rng = np.random.default_rng(seed + 5)
    drops = np.zeros((h, w), np.float32)
    for _ in range(splat):
        p = path[rng.integers(0, len(path))]
        ang = rng.uniform(-math.pi, math.pi)
        off = rng.uniform(width * 1.2, width * 3.2) * min(w, h)
        cx, cy = p[0] + math.cos(ang) * off, p[1] + math.sin(ang) * off
        r = rng.uniform(0.003, 0.016) * min(w, h)
        drops = np.maximum(drops, smoothstep(r, r * 0.7, np.hypot(xs - cx, ys - cy)))
    return np.maximum(body, drops)


def blob_mask(w, h, seed, blobs, edge=0.012, splat=90):
    """Union of organic paint pools: blobs = [(cx, cy, radius), ...]."""
    nz = Noise(seed + 17)
    gx, gy = grid(w, h, 3.2)
    warpn = (fbm(nz, gx, gy, 4) - 0.5) * 0.22
    m = np.zeros((h, w), np.float32)
    for k, (cx, cy, r) in enumerate(blobs):
        x, y = norm_coords(w, h, cx, cy)
        a = np.arctan2(y, x)
        R = r + angular_spikes(a, seed + k * 13, 9, (0.05, 0.16), (0.02, r * 0.28))
        d = np.hypot(x, y) + warpn
        m = np.maximum(m, smoothstep(R + edge, R - edge, d))
        m = np.maximum(m, droplets(w, h, seed + k * 31, splat // max(1, len(blobs)),
                                   (cx, cy), (r * 1.1, r * 1.9), (0.005, 0.022)))
    return m


# --------------------------------------------------------------------------- output
def save(img, rel, sizes=None, quality=80, alpha=None):
    """img: HxWx3 float, alpha: HxW float or None. Writes WebP (+ resized variants)."""
    arr = (np.clip(img, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)
    if alpha is not None:
        a = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
        im = Image.fromarray(np.dstack([arr, a]), "RGBA")
    else:
        im = Image.fromarray(arr, "RGB")
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=quality, method=6)
    out = [path]
    for s in sizes or []:
        ratio = s / im.width
        small = im.resize((s, round(im.height * ratio)), Image.LANCZOS)
        p = path.with_name(f"{path.stem}-{s}{path.suffix}")
        small.save(p, "WEBP", quality=quality, method=6)
        out.append(p)
    for p in out:
        print(f"  {p.relative_to(ROOT)}  {p.stat().st_size // 1024} KB")


def vignette(w, h, strength=0.6, cx=0.5, cy=0.5):
    x, y = norm_coords(w, h, cx, cy)
    return (1 - strength * smoothstep(0.4, 1.9, np.hypot(x * 0.8, y)))[..., None]


PAL_FULL = ["magenta", "violet", "blue", "cyan", "yellow", "orange"]


# --------------------------------------------------------------------------- recipes
def hero():
    w = h = 1500
    col = paint(fluid(w, h, 11, scale=2.4, warp=4.2), PAL_FULL, offset=0.1, bands=1.4, sheen=0.4)
    m = burst_mask(w, h, 11, inner=0.33, outer=0.56, spikes=26, splat=160)
    save(col, "artwork/hero-burst.webp", sizes=[800], alpha=m, quality=78)


def hero_mobile():
    w, h = 900, 900
    col = paint(fluid(w, h, 12, scale=2.0, warp=4.0), PAL_FULL, offset=0.4, bands=1.3)
    m = burst_mask(w, h, 12, inner=0.34, outer=0.6, spikes=16, splat=50)
    save(col, "artwork/hero-burst-mobile.webp", alpha=m, quality=76)


def color_moment():
    w, h = 2400, 1200
    col = paint(fluid(w, h, 23, scale=1.9, warp=4.6, flow=(0.25, 0)), PAL_FULL,
                offset=0.0, bands=1.9, depth=0.75, sheen=0.6)
    save(col * vignette(w, h, 0.35), "artwork/color-moment.webp", sizes=[1280], quality=76)
    w, h = 1000, 1400
    col = paint(fluid(w, h, 24, scale=2.0, warp=4.6), PAL_FULL, bands=1.8, depth=0.75, sheen=0.5)
    save(col * vignette(w, h, 0.35), "artwork/color-moment-portrait.webp", quality=76)


def about_hero():
    w, h = 1800, 1200
    col = paint(fluid(w, h, 31, scale=2.2, warp=4.0), ["orange", "yellow", "magenta", "violet", "magenta"],
                bands=1.3, sheen=0.4)
    m = ribbon_mask(w, h, 31, [(1.05, 0.08), (0.78, 0.25), (0.55, 0.62), (0.72, 0.9), (1.02, 1.05)],
                    width=0.15, splat=90)
    m2 = ribbon_mask(w, h, 32, [(1.05, 0.55), (0.9, 0.42), (0.62, 0.3)], width=0.06, splat=30)
    save(col, "artwork/about-hero.webp", sizes=[900], alpha=np.maximum(m, m2), quality=78)


def services_hero():
    w, h = 1800, 1200
    col = paint(fluid(w, h, 41, scale=2.3, warp=4.4, flow=(0.5, 0)), ["blue", "cyan", "violet", "cyan", "yellow"],
                bands=1.5, sheen=0.5)
    m = ribbon_mask(w, h, 41, [(0.35, -0.05), (0.62, 0.3), (0.95, 0.42), (0.75, 0.75), (1.05, 1.05)],
                    width=0.12, splat=60)
    m2 = ribbon_mask(w, h, 42, [(1.05, 0.1), (0.85, 0.55), (0.55, 1.05)], width=0.07, splat=40)
    save(col, "artwork/services-hero.webp", sizes=[900], alpha=np.maximum(m, m2), quality=78)


def contact_art():
    w, h = 1100, 1400
    col = paint(fluid(w, h, 51, scale=2.1, warp=4.2), ["magenta", "violet", "cyan", "blue", "magenta", "yellow"],
                bands=1.5, sheen=0.4)
    m = blob_mask(w, h, 51, [(0.5, 0.45, 0.62)], splat=80)
    save(col, "artwork/contact-art.webp", sizes=[600], alpha=m, quality=78)


def cta():
    w, h = 2200, 1200
    col = paint(fluid(w, h, 61, scale=2.4, warp=4.2), ["magenta", "cyan", "blue", "yellow", "magenta", "violet"],
                bands=1.6, sheen=0.5)
    m = blob_mask(w, h, 61, [(0.06, 0.18, 0.42), (0.95, 0.85, 0.5), (0.9, 0.05, 0.24), (0.12, 0.98, 0.26)],
                  splat=150)
    save(col, "artwork/cta-paint.webp", sizes=[1100], alpha=m, quality=78)


def signature():
    w, h = 2200, 1100
    col = paint(fluid(w, h, 71, scale=2.0, warp=4.4, flow=(0.3, 0)), ["violet", "magenta", "orange", "yellow", "cyan"],
                bands=1.4, sheen=0.5)
    m = ribbon_mask(w, h, 71, [(-0.05, 0.75), (0.25, 0.55), (0.5, 0.72), (0.78, 0.42), (1.05, 0.3)],
                    width=0.17, splat=120)
    save(col, "artwork/signature-trail.webp", sizes=[1100], alpha=m, quality=78)


def footer():
    w, h = 2400, 760
    col = paint(fluid(w, h, 81, scale=2.0, warp=4.0, flow=(0.4, 0)), ["blue", "violet", "magenta", "orange", "cyan"],
                bands=1.3, depth=0.95)
    m = ribbon_mask(w, h, 81, [(-0.05, 0.85), (0.3, 0.6), (0.62, 0.78), (1.05, 0.4)], width=0.14, splat=60)
    save(col * 0.85, "artwork/footer-flow.webp", sizes=[1200], alpha=m, quality=76)


def framed(name, seed, palette, w=1200, h=1500, scale=2.2, offset=0.0, sizes=(640,)):
    col = paint(fluid(w, h, seed, scale=scale, warp=4.3), palette, offset=offset, bands=1.5, sheen=0.45)
    save(col * vignette(w, h, 0.45), name, sizes=list(sizes), quality=78)


def frames():
    framed("artwork/intro-frame.webp", 91, ["cyan", "blue", "violet", "magenta", "ink"])
    framed("artwork/philosophy-frame.webp", 92, ["orange", "magenta", "ink", "yellow", "violet"])
    framed("artwork/producer-frame.webp", 93, ["ink", "violet", "magenta", "ink", "cyan"], w=1000, h=1250)
    framed("artwork/canvas-frame.webp", 94, ["yellow", "orange", "magenta", "violet", "blue", "cyan"],
           w=1600, h=1000, sizes=(800,))
    for k, pal in enumerate([["magenta", "ink", "violet"], ["cyan", "ink", "blue"],
                             ["orange", "ink", "yellow"], ["violet", "ink", "cyan"]], start=1):
        framed(f"artwork/pillar-{k:02d}.webp", 100 + k, pal, w=900, h=900, sizes=(480,))


SERVICE_PALETTES = [
    ["cyan", "blue", "ink", "cyan", "white"],
    ["magenta", "violet", "ink", "magenta", "orange"],
    ["orange", "magenta", "ink", "yellow", "orange"],
    ["violet", "blue", "ink", "violet", "cyan"],
    ["yellow", "orange", "magenta", "ink", "orange"],
    ["cyan", "magenta", "ink", "violet", "cyan"],
]


def services():
    for k, pal in enumerate(SERVICE_PALETTES, start=1):
        w, h = 1400, 1000
        warm = pal[0] in ("orange", "yellow")
        col = paint(fluid(w, h, 200 + k, scale=2.3, warp=4.4, flow=(0.2 * (k % 3), 0)), pal,
                    bands=1.4, sheen=0.5, depth=0.6 if warm else 0.9)
        save(col * vignette(w, h, 0.4), f"services/service-{k:02d}.webp", sizes=[720], quality=77)


PROJECT_PALETTES = [
    ["magenta", "violet", "ink", "cyan"],
    ["orange", "yellow", "ink", "magenta"],
    ["cyan", "blue", "ink", "violet"],
    ["violet", "magenta", "ink", "orange"],
    ["yellow", "cyan", "ink", "blue"],
    ["blue", "magenta", "ink", "yellow"],
]


def posters():
    """Abstract DEMO posters — placeholders until the client supplies official artwork."""
    for k, pal in enumerate(PROJECT_PALETTES, start=1):
        w, h = 900, 1260
        col = paint(fluid(w, h, 300 + k, scale=2.0, warp=4.6), pal, bands=1.3, sheen=0.5, depth=0.95)
        # cinematic top/bottom fade for typography
        ys = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
        grad = 1 - 0.75 * smoothstep(0.55, 1.0, ys) - 0.35 * smoothstep(0.25, 0.0, ys)
        save(col * grad * vignette(w, h, 0.3), f"project-posters/demo-{k:02d}.webp", sizes=[540], quality=76)
        for g in (1, 2):
            gw, gh = 1400, 800
            gcol = paint(fluid(gw, gh, 300 + k * 10 + g, scale=2.2, warp=4.3), pal[::-1] if g == 2 else pal,
                         bands=1.5, sheen=0.4)
            save(gcol * vignette(gw, gh, 0.35), f"project-posters/demo-{k:02d}-still-{g}.webp", quality=74)


def showreel():
    w, h = 1920, 1080
    col = paint(fluid(w, h, 401, scale=2.0, warp=4.5, flow=(0.3, 0)),
                ["ink", "magenta", "violet", "ink", "cyan", "blue", "ink", "orange"],
                bands=1.2, depth=0.95, sheen=0.4)
    save(col * vignette(w, h, 0.65), "artwork/showreel-poster.webp", sizes=[960], quality=76)


def og_image():
    w, h = 1200, 630
    col = paint(fluid(w, h, 501, scale=2.2, warp=4.2), PAL_FULL, bands=1.5, sheen=0.4)
    m = burst_mask(w, h, 501, centre=(0.78, 0.5), inner=0.3, outer=0.52, spikes=18, splat=60)
    base = np.full((h, w, 3), rgb("ink"))
    img = base * (1 - m[..., None]) + col * m[..., None]
    im = Image.fromarray((img * 255).astype(np.uint8), "RGB")
    d = ImageDraw.Draw(im)
    font_dir = Path("C:/Windows/Fonts")
    try:
        big = ImageFont.truetype(str(font_dir / "bahnschrift.ttf"), 76)
        big.set_variation_by_name("Bold")
        small = ImageFont.truetype(str(font_dir / "bahnschrift.ttf"), 26)
        small.set_variation_by_name("SemiBold")
    except Exception:
        big = small = ImageFont.load_default()
    d.text((72, 220), "VKS FILM", font=big, fill=(248, 247, 252))
    d.text((72, 300), "PRODUCTION", font=big, fill=(248, 247, 252))
    d.text((76, 410), "CREATING MAGIC ON SCREEN", font=small, fill=(255, 209, 61))
    PUBLIC.mkdir(exist_ok=True)
    p = PUBLIC / "og-image.jpg"
    im.save(p, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  {p.relative_to(ROOT)}  {p.stat().st_size // 1024} KB")


RECIPES = {
    "hero": hero, "hero_mobile": hero_mobile, "color_moment": color_moment, "about_hero": about_hero,
    "services_hero": services_hero, "contact": contact_art, "cta": cta, "signature": signature,
    "footer": footer, "frames": frames, "services": services, "posters": posters,
    "showreel": showreel, "og": og_image,
}

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(RECIPES)
    for name in wanted:
        for key, fn in RECIPES.items():
            if key.startswith(name):
                print(f"[{key}]")
                fn()
