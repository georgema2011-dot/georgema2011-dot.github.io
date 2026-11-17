from pathlib import Path
import re
from PIL import Image, ImageOps
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parents[1]
public = root / 'public'
src = (root / 'app/projects-data.ts').read_text()
out = root / 'output/pdf/George-Ma-Portfolio.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
font_dir = Path.home() / '.codex/skills/canvas-design/canvas-fonts'
pdfmetrics.registerFont(TTFont('Display', str(font_dir / 'BigShoulders-Bold.ttf')))
pdfmetrics.registerFont(TTFont('DisplayRegular', str(font_dir / 'BigShoulders-Regular.ttf')))
W, H = 960, 600
c = Canvas(str(out), pagesize=(W,H), pageCompression=1)
c.setTitle('Ma Shun Ngai George | Design Portfolio')
c.setAuthor('Ma Shun Ngai George')
site = 'https://georgema2011-dot.github.io'
ink, paper = HexColor('#292929'), HexColor('#fdfdfb')

def text(x,y,s,size=11,font='Helvetica'):
    c.setFont(font,size); c.drawString(x,y,s)

def block(x,y,s,width,size,font='Helvetica',leading=None):
    for line in simpleSplit(s,font,size,width):
        text(x,y,line,size,font); y -= leading or size*1.25
    return y

def rule(y,x=36,end=924):
    c.setDash(1,3); c.line(x,y,end,y); c.setDash()

def frame(label):
    c.setFillColor(paper); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(ink); c.setStrokeColor(ink)
    text(36,570,'MA / GEORGE',9,'Helvetica-Bold'); text(745,570,label,9)
    rule(554); rule(42)
    text(36,23,'SPATIAL + INDUSTRIAL DESIGN',8)
    text(896,23,f'{c.getPageNumber():02}',9)

def image(path,x,y,w,h,crop=False):
    im=Image.open(path).convert('RGB')
    im=ImageOps.fit(im,(round(w*2),round(h*2))) if crop else ImageOps.contain(im,(round(w*2),round(h*2)))
    iw,ih=im.size
    scale=min(w/iw,h/ih)
    from io import BytesIO
    data=BytesIO(); im.save(data,format='JPEG',quality=93); data.seek(0)
    c.drawImage(ImageReader(data),x+(w-iw*scale)/2,y+(h-ih*scale)/2,iw*scale,ih*scale)

projects=[]
for record in re.split(r'\{ id:',src)[1:]:
    def get(key):
        return re.search(rf'{key}:"([^"]*)"',record)[1]
    p={k:get(k) for k in ('number','title','discipline','year','statement','description')}
    p['id']=record.split('"')[1]
    p['boards']=re.findall(r'src:"([^"]+)"[^}]*caption:"([^"]+)"',record)
    if p['id']=='sca-lab':
        p['boards']=[(f'/projects/sca-lab/page-{int(n):02}.webp',cap) for n,cap in re.findall(r'page: (\d+), caption: "([^"]+)"',src) if n!='1']
    if p['id']=='nus-coop':
        p['boards']=[board for board in p['boards'] if board[0]!='/projects/nus-coop/page-2.webp']
    p['facts']=re.findall(r'label:"([^"]+)",value:"([^"]+)"',record)
    projects.append(p)
assert len(projects)==9 and len({p['id'] for p in projects})==9 and all(p['boards'] for p in projects)
for ident,ix in [('masks',2),('watergrounds',1)]:
    p=next(p for p in projects if p['id']==ident)
    p['boards'].insert(0,p['boards'].pop(ix))

frame('PORTFOLIO / 2026')
image(public/'og-portfolio.png',477,116,447,372)
text(36,463,'MA SHUN NGAI GEORGE',15,'Helvetica-Bold')
block(36,395,'SPATIAL + INDUSTRIAL DESIGN',450,72,'Display',74)
text(36,144,'INTERIORS / PRODUCTS / SERVICES',11)
text(36,115,'SINGAPORE',10)
text(36,73,'georgem2011@gmail.com',11)
c.linkURL('mailto:georgem2011@gmail.com',(35,63,225,91)); c.showPage()

frame('CONTENTS')
text(36,482,'Selected work',55,'Display')
page=3
for i,p in enumerate(projects):
    y=428-i*35
    text(36,y,p['number'],10); text(79,y,p['title'],15,'Helvetica-Bold')
    text(626,y,p['discipline'],11); text(892,y,f'{page:02}',11)
    rule(y-10)
    c.linkRect('',p['id'],(36,y-8,924,y+18),relative=0,thickness=0)
    page+=1+len(p['boards'])
text(36,71,'Design internships: SpaceLogic and M Moser Associates',11)
c.showPage()

for p in projects:
    c.bookmarkPage(p['id']); c.addOutlineEntry(p['title'],p['id'])
    frame(f"PROJECT {p['number']}")
    text(36,522,p['discipline'].upper()+' / '+p['year'].upper(),9)
    block(36,438,p['title'],570,65,'Display',70)
    y=block(650,485,p['statement'],274,24,'Display',28)-18
    y=block(650,y,p['description'],274,17,'DisplayRegular',22)-18
    for k,v in p['facts']:
        text(650,y,k.upper(),11,'Display')
        y=block(650,y-19,v,274,15,'DisplayRegular',18)-13
    if p['id']=='nus-coop':
        y=block(650,y,'Team: Ma Shun Ngai George, Ong Zhi Xing and Tew Rui En',274,15,'DisplayRegular',18)
    assert y>73, p['title']
    text(36,106,'WORK BOARDS',9,'Helvetica-Bold')
    for i,(_,caption) in enumerate(p['boards']):
        text(36+(i//4)*290,87-(i%4)*12,f'{i+1:02}  {caption}',9)
    c.linkURL(f"{site}/projects/{p['id']}/",(740,15,888,35))
    text(740,23,'VIEW ONLINE CASE STUDY',8)
    c.showPage()
    for asset,caption in p['boards']:
        path=public/asset.lstrip('/')
        with Image.open(path) as original:
            iw,ih=original.size
            h=W*ih/iw
            c.setPageSize((W,h))
            if original.format=='JPEG':
                c.drawImage(str(path),0,0,W,h)
            else:
                image(path,0,0,W,h)
        c.showPage()
    c.setPageSize((W,H))

frame('PHOTOGRAPHY / FIELD NOTES')
text(36,498,'Photography',50,'Display')
for i,(asset,label) in enumerate([('scandinavia-road.webp','NORWAY'),('copenhagen-street.webp','COPENHAGEN'),('hong-kong-courtyard.webp','CHINA')]):
    x=36+i*302
    image(public/'photo-dump/web'/asset,x,125,284,330,True)
    text(x,101,label,9)
text(36,65,'View the full photography archive online',11)
c.linkURL(site+'/#photography',(36,53,420,82)); c.showPage()
c.save()
print(out)
