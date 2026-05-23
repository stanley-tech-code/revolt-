import re
import os
import re

def slugify(text):
    # Remove all non-word characters (everything except numbers and letters)
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    # Replace all runs of whitespace with a single dash
    text = re.sub(r'[\s\-]+', '-', text)
    return text

def main():
    file_path = r'c:\Users\user\OneDrive\Desktop\REVOLT\revolt-site\revolt-site\index.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # We want to replace href="about:blank" with href="slug.html"
    # To do this safely without breaking other things, let's find all tags.
    
    def replacer(match):
        pre_href = match.group(1)
        post_href = match.group(2)
        inner = match.group(3)
        
        # Determine the name from inner text or aria-label
        # strip html tags from inner
        text = re.sub(r'<[^>]+>', '', inner).strip()
        
        if not text:
            # Maybe it's an icon with aria-label
            aria_match = re.search(r'aria-label="([^"]+)"', pre_href + post_href)
            if aria_match:
                text = aria_match.group(1)
            else:
                text = "page"
                
        # If it's still empty, fallback
        if not text:
            text = "page"
            
        slug = slugify(text) + ".html"
        
        # return the reconstructed tag
        return f'<a{pre_href}href="{slug}"{post_href}>{inner}</a>'

    # Regex to match the anchor tag
    pattern = re.compile(r'<a([^>]*)href="about:blank"([^>]*)>(.*?)</a>', re.DOTALL | re.IGNORECASE)
    
    new_html = pattern.sub(replacer, html)
    
    # We also want to replace the index.html logo links if any.
    # Wait, the logo should probably point to index.html
    # The logo has text "Revolt".
    def logo_replacer(match):
        if "revolt.html" in match.group(0):
            return match.group(0).replace("revolt.html", "index.html")
        return match.group(0)
        
    new_html = re.sub(r'<a[^>]*href="revolt\.html"[^>]*>.*?</a>', logo_replacer, new_html, flags=re.IGNORECASE | re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

    print("Updated index.html links.")

    # Now we need to generate all the files!
    # Let's extract the header, mobile-menu, and footer from the updated new_html
    header_pattern = re.compile(r'(<header.*?</header>)', re.DOTALL | re.IGNORECASE)
    mobile_menu_pattern = re.compile(r'(<div id="mobile-menu".*?</div>\s*</div>)', re.DOTALL | re.IGNORECASE)
    # wait, mobile menu has nested divs. Regex for nested divs is hard.
    # We can just extract everything before <main> and everything after </main>
    
    parts = re.split(r'<main>.*?</main>', new_html, flags=re.DOTALL | re.IGNORECASE)
    if len(parts) == 2:
        top_part = parts[0] + "<main>\n"
        bottom_part = "\n  </main>" + parts[1]
    else:
        print("Could not split by <main>")
        return

    # Find all unique slugs
    slugs = set()
    for match in re.finditer(r'href="([^"]+\.html)"', new_html):
        slug = match.group(1)
        if slug != "index.html":
            slugs.add(slug)
            
    print(f"Generating {len(slugs)} pages...")
    
    for slug in slugs:
        page_name = slug.replace(".html", "").replace("-", " ").title()
        
        # Build the page content
        page_content = top_part
        page_content += f'''    <section class="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">{page_name}</h1>
        <p class="text-cocoa">This is a placeholder page for {page_name}. Edit this file to add content.</p>
        <a href="index.html" class="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</a>
      </div>
    </section>'''
        page_content += bottom_part
        
        # write the file
        out_path = os.path.join(os.path.dirname(file_path), slug)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(page_content)

    print("Done generating pages.")

if __name__ == "__main__":
    main()
