from math import cos, pi, sin
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1736, 909
PAPER = "#f7f7f3"
INK = "#262626"
MUTED = "#6a6a66"
FONT_DIR = "/Users/gma/.codex/skills/canvas-design/canvas-fonts"

canvas = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
draw = ImageDraw.Draw(canvas)
display = ImageFont.truetype(f"{FONT_DIR}/BigShoulders-Bold.ttf", 166)
label = ImageFont.truetype(f"{FONT_DIR}/DMMono-Regular.ttf", 22)
small = ImageFont.truetype(f"{FONT_DIR}/DMMono-Regular.ttf", 18)


def dotted_line(x1, y1, x2, y2, gap=14, radius=2, fill=INK):
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    steps = max(1, int(length / gap))
    for index in range(steps + 1):
        t = index / steps
        x, y = x1 + dx * t, y1 + dy * t
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)


margin = 44
dotted_line(margin, margin, WIDTH - margin, margin)
dotted_line(margin, HEIGHT - margin, WIDTH - margin, HEIGHT - margin)
dotted_line(margin, margin, margin, HEIGHT - margin)
dotted_line(WIDTH - margin, margin, WIDTH - margin, HEIGHT - margin)
dotted_line(1095, margin, 1095, HEIGHT - margin, gap=12, radius=1.6)

draw.text((76, 70), "MA SHUN NGAI GEORGE", font=label, fill=INK)
draw.text((WIDTH - 76, 70), "PORTFOLIO / 2026", font=label, fill=INK, anchor="ra")

for text, y in [("SPATIAL +", 152), ("INDUSTRIAL", 298), ("DESIGN", 444)]:
    draw.text((72, y), text, font=display, fill=INK, stroke_width=0)

draw.text((76, 770), "INTERIORS / PRODUCTS / SERVICES", font=small, fill=MUTED)
draw.text((WIDTH - 76, 770), "SINGAPORE / 01°17'N", font=small, fill=MUTED, anchor="ra")

# Fluid, model-like mass built from a carefully tuned radial contour.
cx, cy = 1410, 436
points = []
for index in range(180):
    angle = 2 * pi * index / 180
    radius_x = 248 + 28 * sin(3 * angle + 0.4) + 19 * sin(5 * angle)
    radius_y = 285 + 23 * cos(4 * angle - 0.2) + 14 * sin(7 * angle)
    points.append((cx + radius_x * cos(angle), cy + radius_y * sin(angle)))
draw.polygon(points, fill=INK)

# Dotted material sample within the lower portion of the mass.
mask = Image.new("1", (WIDTH, HEIGHT), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.polygon(points, fill=1)
for y in range(440, 710, 18):
    for x in range(1170 + (9 if (y // 18) % 2 else 0), 1680, 18):
        if mask.getpixel((x, y)):
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=PAPER)

# Small circular voids keep the form dimensional without gradients.
draw.ellipse((1338, 264, 1458, 378), fill=PAPER)
draw.ellipse((1490, 354, 1618, 482), fill=PAPER)

canvas.save("public/og-portfolio.png", optimize=True)
