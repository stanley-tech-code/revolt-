import os
import re
import glob

def main():
    base_dir = r'c:\Users\user\OneDrive\Desktop\REVOLT\revolt-site\revolt-site'
    
    # 1. Delete all .html files except index.html
    html_files = glob.glob(os.path.join(base_dir, '*.html'))
    for f in html_files:
        if os.path.basename(f).lower() != 'index.html':
            os.remove(f)
            
    # 2. Create folders
    folders = [
        'assets', 'css', 'js', 'images', 'icons', 'components', 'sections',
        'pages/new-in', 'pages/clothing', 'pages/bras', 'pages/underwear',
        'pages/accessories', 'pages/swimwear', 'pages/help', 'pages/about',
        'pages/legal', 'pages/components', 'pages/other'
    ]
    for folder in folders:
        os.makedirs(os.path.join(base_dir, folder), exist_ok=True)
        
    # 3. Read index.html
    index_path = os.path.join(base_dir, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Mapping slug to category
    slug_map = {
        'all-new-arrivals': 'new-in',
        'the-editorial-edit': 'new-in',
        'trend-guide': 'new-in',
        'back-in-stock': 'new-in',
        'coming-soon': 'new-in',
        'pre-order': 'new-in',
        'new-in': 'new-in',
        
        'all-clothing': 'clothing',
        'two-piece-matching-sets': 'clothing',
        'clothing-guide': 'clothing',
        'dresses': 'clothing',
        'hoodies': 'clothing',
        'sweatshirts': 'clothing',
        'leggings': 'clothing',
        'maternity': 'clothing',
        'tops-bodysuits': 'clothing',
        'pants': 'clothing',
        'pajamas': 'clothing',
        'shorts': 'clothing',
        'skirts': 'clothing',
        'tees-tanks': 'clothing',
        'clothing': 'clothing',
        'shapewear': 'clothing',
        
        'all-bras': 'bras',
        'everyday-comfort': 'bras',
        'bra-fit-guide': 'bras',
        't-shirt-bras': 'bras',
        'strapless': 'bras',
        'full-coverage': 'bras',
        'lined': 'bras',
        'push-up': 'bras',
        'unlined': 'bras',
        'lightly-lined': 'bras',
        'bras': 'bras',
        
        'all-underwear': 'underwear',
        'multi-packs': 'underwear',
        'underwear-guide': 'underwear',
        'thongs': 'underwear',
        'cheeky': 'underwear',
        'seamless': 'underwear',
        'underwear': 'underwear',
        
        'all-accessories': 'accessories',
        'gifting': 'accessories',
        'the-travel-edit': 'accessories',
        'bags': 'accessories',
        'glasses-shades': 'accessories',
        'belts': 'accessories',
        'perfumes': 'accessories',
        'accessories': 'accessories',
        
        'all-swimwear': 'swimwear',
        'vacation-shop': 'swimwear',
        'swim-fit-guide': 'swimwear',
        'bikinis': 'swimwear',
        'swimsuits': 'swimwear',
        'swim-cover-ups': 'swimwear',
        'swimwear': 'swimwear',
        
        'search': 'components',
        'account': 'components',
        'wishlist': 'components',
        'cart': 'components',
        'instagram': 'components',
        'facebook': 'components',
        'tiktok': 'components',
        'pinterest': 'components',
        
        'order-tracking': 'help',
        'returns': 'help',
        'size-guide': 'help',
        'contact': 'help',
        
        'our-story': 'about',
        'sustainability': 'about',
        'press': 'about',
        'careers': 'about',
        
        'terms-conditions': 'legal',
        'privacy-policy': 'legal',
    }
    
    # 4. Find all href="slug.html" and replace with href="pages/category/slug.html"
    def link_replacer(match):
        full_match = match.group(0)
        slug = match.group(1)
        if slug == "index.html" or slug == "revolt.html" or slug.startswith("pages/"):
            return full_match
            
        base_slug = slug.replace(".html", "")
        category = slug_map.get(base_slug, "other")
        
        return full_match.replace(f'"{slug}"', f'"pages/{category}/{slug}"')
        
    # Match href="anything.html"
    new_html = re.sub(r'href="([^"]+\.html)"', link_replacer, html)
    
    # write updated index.html
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
        
    # 5. Extract header and footer to generate pages
    parts = re.split(r'<main>.*?</main>', new_html, flags=re.DOTALL | re.IGNORECASE)
    if len(parts) == 2:
        top_part = parts[0] + "<main>\n"
        bottom_part = "\n  </main>" + parts[1]
    else:
        print("Could not split by <main>")
        return

    # 6. Generate nested pages
    slugs = set()
    for match in re.finditer(r'href="pages/([^/]+)/([^"]+\.html)"', new_html):
        category = match.group(1)
        slug = match.group(2)
        slugs.add((category, slug))
        
    print(f"Generating {len(slugs)} nested pages...")
    
    for category, slug in slugs:
        page_name = slug.replace(".html", "").replace("-", " ").title()
        
        # Build page content
        page_content = top_part
        page_content += f'''    <section class="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">{page_name}</h1>
        <p class="text-cocoa">This is a placeholder page for {page_name}. Edit this file to add content.</p>
        <a href="../../index.html" class="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</a>
      </div>
    </section>'''
        page_content += bottom_part
        
        # FIX RELATIVE PATHS FOR NESTED PAGES
        # Since it's in pages/category/ (2 levels deep), prefix with ../../
        # For images:
        page_content = re.sub(r'src="images/', r'src="../../images/', page_content)
        # For index.html:
        page_content = re.sub(r'href="index\.html"', r'href="../../index.html"', page_content)
        # For pages/:
        page_content = re.sub(r'href="pages/', r'href="../../pages/', page_content)
        
        out_path = os.path.join(base_dir, 'pages', category, slug)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(page_content)

    print("Done reorganizing pages.")

if __name__ == "__main__":
    main()
