import re
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

root = Path(__file__).resolve().parent.parent
output = root / 'public/george-ma-portfolio.pdf'
c = canvas.Canvas(str(output), pagesize=(960, 600))
c.setTitle('Ma Shun Ngai George - Spatial and Industrial Design Portfolio')
c.setAuthor('Ma Shun Ngai George')

def base(label):
    c.setFillColor(HexColor('#fdfdfb')); c.rect(0, 0, 960, 600, fill=1, stroke=0)
    c.setFillColor(HexColor('#292929')); c.setFont('Helvetica', 10)
    c.drawString(32, 570, label)
    c.drawRightString(928, 20, f'GEORGE MA / {c.getPageNumber():02d}')
    c.linkURL('https://georgema2011-dot.github.io/', (32, 14, 300, 30))
    c.drawString(32, 20, 'georgema2011-dot.github.io')

base('PORTFOLIO / SINGAPORE')
c.setFont('Helvetica-Bold', 48)
c.drawString(32, 430, 'Ma Shun Ngai George')
c.setFont('Helvetica', 30); c.drawString(32, 370, 'Spatial + Industrial Designer')
c.setFont('Helvetica', 17)
c.drawString(32, 285, 'Interiors, products and services around real behaviour.')
c.drawString(32, 230, 'Design internships: SpaceLogic and M Moser Associates')
c.drawString(32, 185, 'georgem2011@gmail.com')
c.showPage()
source = (root / 'app/projects-data.ts').read_text()
entries = re.split(r'\{ id:', source)[1:]
for entry in entries:
    def field(name):
        match = re.search(rf'{name}:"([^"]*)"', entry)
        return match.group(1) if match else ''
    title, discipline, description = field('title'), field('discipline'), field('description')
    base(f'{field("number")} / {discipline.upper()}')
    c.setFont('Helvetica-Bold', 32)
    y = 490
    for line in simpleSplit(title, 'Helvetica-Bold', 32, 880):
        c.drawString(32, y, line); y -= 39
    c.setFont('Helvetica', 18); y -= 30
    for line in simpleSplit(description, 'Helvetica', 18, 820):
        c.drawString(32, y, line); y -= 28
    c.setFont('Helvetica', 12)
    c.drawString(32, 80, 'View the complete case study online')
    c.linkURL(f'https://georgema2011-dot.github.io/projects/{field("id")}/', (32, 65, 360, 105))
    c.showPage()
    images = re.findall(r'src:"([^"]+)"', entry)
    if field('id') == 'sca-lab':
        images = [f'/projects/sca-lab/page-{n:02d}.webp' for n in [4, 5, 7, 13, 15]]
    for image in images:
        path = root / 'public' / image.lstrip('/')
        base(title)
        c.drawImage(ImageReader(str(path)), 24, 48, width=912, height=494, preserveAspectRatio=True, anchor='c')
        c.showPage()
c.save()
print(output)
