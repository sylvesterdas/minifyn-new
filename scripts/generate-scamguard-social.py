from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "images" / "scamguard-social"
SCREENSHOT = PUBLIC / "images" / "scamguard-link-checker-ai.png"
LOGO = PUBLIC / "images" / "scamguard-logo.png"
FONT_REGULAR = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
FONT_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")


VARIANTS = {
    "scamguard-og-1200x630.png": (1200, 630, "wide"),
    "scamguard-square-1200x1200.png": (1200, 1200, "square"),
    "scamguard-social-1200x900.png": (1200, 900, "four_three"),
    "scamguard-twitter-1600x900.png": (1600, 900, "wide"),
}


def font(path: Path, size: int):
    return ImageFont.truetype(str(path), size)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def background(width, height):
    image = Image.new("RGB", (width, height))
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            tx, ty = x / width, y / height
            glow = max(0.0, 1.0 - (((tx - 0.82) / 0.48) ** 2 + ((ty - 0.48) / 0.72) ** 2))
            pixels[x, y] = (
                int(5 + 2 * glow),
                int(20 + 40 * glow + 6 * ty),
                int(31 + 54 * glow + 8 * tx),
            )
    return image


def add_motifs(image):
    w, h = image.size
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    cyan = (91, 202, 230, 82)
    red = (248, 113, 113, 62)
    d.ellipse((int(w*.56), int(h*.16), int(w*.98), int(h*.84)), outline=cyan, width=max(2, w // 500))
    d.line((int(w*.36), int(h*.62), int(w*.94), int(h*.39)), fill=cyan, width=max(2, w // 500))
    card_x, card_y = int(w*.42), int(h*.075)
    card_w, card_h = int(w*.23), int(h*.12)
    d.rounded_rectangle((card_x, card_y, card_x + card_w, card_y + card_h), radius=int(w*.018), fill=(69, 10, 19, 100), outline=red, width=max(2, w // 700))
    d.text((card_x + int(w*.018), card_y + int(h*.02)), "DELIVERY FAILED", font=font(FONT_BOLD, max(12, w // 78)), fill=(254, 202, 202, 180))
    d.text((card_x + int(w*.018), card_y + int(h*.062)), "Your package is on hold.", font=font(FONT_REGULAR, max(11, w // 92)), fill=(254, 226, 226, 160))
    image.paste(overlay, (0, 0), overlay)


def add_brand(image, x, y, unit):
    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((unit, unit), Image.Resampling.LANCZOS)
    image.alpha_composite(logo, (x, y))
    draw = ImageDraw.Draw(image)
    draw.text((x + unit + int(unit*.25), y + int(unit*.15)), "ScamGuard", font=font(FONT_BOLD, int(unit*.43)), fill=(245, 250, 252, 255))
    draw.text((x + unit + int(unit*.25), y + int(unit*.61)), "by MiniFyn", font=font(FONT_REGULAR, int(unit*.22)), fill=(151, 177, 188, 255))


def wrap_text(draw, text, text_font, max_width):
    words, lines, line = text.split(), [], ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=text_font)[2] <= max_width:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def add_copy(image, x, y, max_width, scale):
    draw = ImageDraw.Draw(image)
    eyebrow_font = font(FONT_BOLD, int(22 * scale))
    headline_font = font(FONT_BOLD, int(56 * scale))
    body_font = font(FONT_REGULAR, int(23 * scale))
    pill = "PAUSE. CHECK. DECIDE."
    pb = draw.textbbox((0, 0), pill, font=eyebrow_font)
    px, py = int(17*scale), int(10*scale)
    draw.rounded_rectangle((x, y, x + pb[2] + 2*px, y + pb[3] + 2*py), radius=int(18*scale), fill=(255, 176, 0, 32), outline=(255, 176, 0, 150), width=max(1, int(2*scale)))
    draw.text((x+px, y+py-2), pill, font=eyebrow_font, fill=(255, 194, 51, 255))
    y += pb[3] + 2*py + int(30*scale)
    lines = wrap_text(draw, "One convincing link could be all it takes.", headline_font, max_width)
    line_height = int(68 * scale)
    for line in lines:
        draw.text((x, y), line, font=headline_font, fill=(247, 251, 252, 255))
        y += line_height
    y += int(18*scale)
    body = "Check suspicious messages, QR codes, and unfamiliar links before you open them."
    for line in wrap_text(draw, body, body_font, max_width):
        draw.text((x, y), line, font=body_font, fill=(166, 192, 202, 255))
        y += int(34*scale)


def add_phone(image, x, y, target_height):
    screenshot = Image.open(SCREENSHOT).convert("RGB")
    target_width = int(target_height * screenshot.width / screenshot.height)
    screenshot = screenshot.resize((target_width, target_height), Image.Resampling.LANCZOS)
    bezel = max(8, target_width // 28)
    radius = max(22, target_width // 11)
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x-bezel+12, y-bezel+18, x+target_width+bezel+12, y+target_height+bezel+18), radius=radius, fill=(0, 0, 0, 175))
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(10, bezel)))
    image.alpha_composite(shadow)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((x-bezel, y-bezel, x+target_width+bezel, y+target_height+bezel), radius=radius, fill=(8, 14, 18, 255), outline=(96, 200, 226, 120), width=max(2, bezel//4))
    mask = rounded_mask((target_width, target_height), max(12, radius-bezel))
    image.paste(screenshot, (x, y), mask)


def build(name, width, height, layout):
    image = background(width, height).convert("RGBA")
    add_motifs(image)
    if layout == "wide":
        margin = int(width * .055)
        scale = width / 1200
        add_brand(image, margin, int(height*.075), int(70*scale))
        add_copy(image, margin, int(height*.27), int(width*.49), scale)
        phone_h = int(height*.94)
        phone_w = int(phone_h * 920 / 2048)
        add_phone(image, width - margin - phone_w, int(height*.09), phone_h)
    elif layout == "square":
        margin = int(width*.075)
        add_brand(image, margin, int(height*.06), 82)
        add_copy(image, margin, int(height*.22), int(width*.72), 1.05)
        phone_h = int(height*.59)
        phone_w = int(phone_h * 920 / 2048)
        add_phone(image, width - margin - phone_w, int(height*.49), phone_h)
    else:
        margin = int(width*.065)
        add_brand(image, margin, int(height*.06), 74)
        add_copy(image, margin, int(height*.25), int(width*.52), 1.0)
        phone_h = int(height*.79)
        phone_w = int(phone_h * 920 / 2048)
        add_phone(image, width - margin - phone_w, int(height*.14), phone_h)
    OUT.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(OUT / name, "PNG", optimize=True)


for filename, (width, height, layout) in VARIANTS.items():
    build(filename, width, height, layout)
    print(f"Generated {filename} ({width}x{height})")
