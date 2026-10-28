"""Generate responsive, content-addressed WebP derivatives. Run after changing photos.
Requires Pillow. Source photos are never overwritten; generated outputs are committed
only to the hosted source repository, not the public GitHub source mirror.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json
root=Path(__file__).resolve().parent.parent
names=['green-cover-styled', 'dining-set-styled', 'fan-bag-styled', 'bouquet-styled', 'tulip-cream', 'tulip-pink', 'bookmark-styled', 'owl-styled', 'tissue-styled', 'whale-styled', 'tooth-styled', 'table-rose-preview', 'table-coastal-preview', 'cover-lilac-preview', 'cover-oat-preview', 'phone-crossbody-styled', 'bow-keyring-styled', 'earth-tone-shoulder-styled', 'cactus-crossbody-styled', 'bunting-styled', 'marigold-gajra-styled', 'rose-gajra-styled', 'two-flower-tissue-v2', 'phone-sage-preview', 'earth-pastel-preview', 'cactus-teal-preview', 'marigold-blush-preview', 'rose-lilac-preview', 'two-flower-oat-preview', 'mocha-bow-tote-product-v2', 'tote-sage-product-v2', 'fan-bag-hero-v2', 'bunting-full-layout']
manifest={}
for name in names:
    src=root/'public/assets'/f'{name}.webp'
    im=ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    variants=[]
    for width in [160,320,480,768,1120]:
        if width>im.width: continue
        out=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
        import io
        buf=io.BytesIO();out.save(buf,format='WEBP',quality=76,method=6)
        data=buf.getvalue();digest=hashlib.sha256(data).hexdigest()[:16]
        url=f'/assets/pcs-{digest}-{width}.webp'
        (root/'public'/url.lstrip('/')).write_bytes(data)
        variants.append({'src':url,'width':width,'bytes':len(data)})
    manifest[f'/assets/{name}.webp']={'width':im.width,'height':im.height,'variants':variants}
(root/'lib/image-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Optimised {len(manifest)} photos into {sum(len(x["variants"]) for x in manifest.values())} responsive variants.')
for name in ['green-cover-styled','owl-styled']:
    m=manifest[f'/assets/{name}.webp'];v=next(x for x in m['variants'] if x['width']==480)
    original=(root/'public/assets'/f'{name}.webp').stat().st_size
    print(f'{name}: {original:,} → {v["bytes"]:,} bytes at 480px ({round(100*(1-v["bytes"]/original))}% less)')
