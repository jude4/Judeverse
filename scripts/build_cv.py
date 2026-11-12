"""Append the AI project section to the owner's original CV.
Run from the repository root with Python, reportlab and pypdf installed.
"""
import json
from io import BytesIO
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from pypdf import PdfReader, PdfWriter

root = Path(__file__).resolve().parent.parent
projects = json.loads((root / 'data/ai-projects.json').read_text())
projects.append({
    'title': 'Neural Spam Detection',
    'description': 'Academic SMS classification pipeline with text preprocessing, TF-IDF features, and a TensorFlow/Keras feedforward neural network. Includes training, prediction, and evaluation scripts.',
    'stack': ['Python', 'TensorFlow / Keras', 'scikit-learn', 'TF-IDF'],
    'github': 'https://github.com/jude4/sms-span-detection',
})
pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('DejaVu', normal='DejaVu', bold='DejaVuBold')
styles = getSampleStyleSheet()
for style in styles.byName.values():
    style.fontName = 'DejaVu'

styles.add(ParagraphStyle(name='ProjectTitle', fontName='DejaVuBold', fontSize=11, leading=14, spaceAfter=5, textColor=colors.HexColor('#173f46')))
styles.add(ParagraphStyle(name='ProjectBody', fontName='DejaVu', fontSize=9.5, leading=14, spaceAfter=5))
styles.add(ParagraphStyle(name='ProjectLink', fontName='DejaVu', fontSize=8, leading=12, spaceAfter=14))
buffer = BytesIO()
doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=44, rightMargin=44, topMargin=44, bottomMargin=44)
story = [Paragraph('Ufuoma Jude Onohwosafe', styles['Title']), Paragraph('SELECTED AI &amp; RESEARCH PROJECTS', styles['Heading2']), Paragraph('Academic and experimental work in computer vision, natural language processing, reinforcement learning and LLM-powered multi-agent systems.', styles['ProjectBody']), Spacer(1, 14)]
for project in projects:
    url = escape(project['github'])
    story.append(KeepTogether([
        Paragraph(escape(project['title']), styles['ProjectTitle']),
        Paragraph(escape(project['description']), styles['ProjectBody']),
        Paragraph('<b>Technologies:</b> ' + escape(', '.join(project['stack'])), styles['ProjectBody']),
        Paragraph(f'<link href="{url}" color="#155e75">{url}</link>', styles['ProjectLink']),
    ]))
doc.build(story)
writer = PdfWriter()
for source in [root / 'cv/base-resume.pdf', buffer]:
    if isinstance(source, BytesIO): source.seek(0)
    reader = PdfReader(source)
    for page in reader.pages: writer.add_page(page)
writer.add_metadata({'/Title': 'Ufuoma Jude Onohwosafe - CV with AI Projects', '/Author': 'Ufuoma Jude Onohwosafe'})
with (root / 'public/assets/documents/ufuoma-jude-resume.pdf').open('wb') as target: writer.write(target)
print(f'Updated CV: {len(writer.pages)} pages')
