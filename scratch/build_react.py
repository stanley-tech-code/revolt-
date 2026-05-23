import os
import re

def html_to_jsx(html):
    # Basic replacements
    html = html.replace('class="', 'className="')
    html = html.replace('for="', 'htmlFor="')
    html = html.replace('tabindex="', 'tabIndex="')
    html = html.replace('<!--', '{/*').replace('-->', '*/}')
    
    # Self-closing tags
    html = re.sub(r'<(img|input|hr|br)([^>]*?)>', r'<\1\2 />', html)
    
    # Convert a tags to Link
    html = html.replace('<a ', '<Link ')
    html = html.replace('</a>', '</Link>')
    
    # Convert hrefs to 'to'
    def href_to_to(match):
        href = match.group(1)
        if href.startswith('http'):
            return f'to="{href}" target="_blank" rel="noopener noreferrer"'
        elif href == 'index.html' or href == '../../index.html':
            return 'to="/"'
        elif href.startswith('pages/') or href.startswith('../../pages/'):
            # clean up path
            path = href.replace('../../pages/', '/').replace('pages/', '/').replace('.html', '')
            return f'to="{path}"'
        else:
            return f'to="{href}"'
            
    html = re.sub(r'href="([^"]+)"', href_to_to, html)
    
    # Remove onclick attributes and similar if any (usually we handle them in React)
    html = re.sub(r'onclick="[^"]+"', '', html)
    html = re.sub(r'onsubmit="[^"]+"', 'onSubmit={(e) => e.preventDefault()}', html)
    
    # SVG fixes
    html = html.replace('stroke-linecap=', 'strokeLinecap=')
    html = html.replace('stroke-linejoin=', 'strokeLinejoin=')
    html = html.replace('stroke-width=', 'strokeWidth=')
    
    return html

def main():
    base_dir = r'c:\Users\user\OneDrive\Desktop\REVOLT\revolt-site\revolt-site'
    legacy_index = os.path.join(base_dir, 'legacy-html', 'index.html')
    
    with open(legacy_index, 'r', encoding='utf-8') as f:
        full_html = f.read()

    # Extract sections
    announcement_match = re.search(r'(<div class="bg-ink text-canvas text-center.*?</div>)', full_html, re.DOTALL)
    header_match = re.search(r'(<header.*?</header>)', full_html, re.DOTALL)
    mobile_menu_match = re.search(r'(<div id="mobile-menu".*?</div>\s*</div>)', full_html, re.DOTALL)
    footer_match = re.search(r'(<footer.*</footer>)', full_html, re.DOTALL)
    
    # Find all unique links (pages/category/slug.html)
    routes = set()
    for match in re.finditer(r'href="pages/([^/]+)/([^"]+)\.html"', full_html):
        routes.add((match.group(1), match.group(2)))
        
    components_dir = os.path.join(base_dir, 'src', 'components')
    layout_dir = os.path.join(components_dir, 'layout')
    ui_dir = os.path.join(components_dir, 'ui')
    pages_dir = os.path.join(base_dir, 'src', 'pages')
    
    os.makedirs(layout_dir, exist_ok=True)
    os.makedirs(ui_dir, exist_ok=True)
    os.makedirs(pages_dir, exist_ok=True)
    
    # AnnouncementBar
    if announcement_match:
        jsx = html_to_jsx(announcement_match.group(1))
        content = f'''import React from 'react';
import {{ Link }} from 'react-router-dom';

export default function AnnouncementBar() {{
  return (
    {jsx}
  );
}}
'''
        with open(os.path.join(ui_dir, 'AnnouncementBar.jsx'), 'w', encoding='utf-8') as f:
            f.write(content)
            
    # Navbar
    if header_match:
        raw_html = header_match.group(1)
        # remove mobile menu button id
        raw_html = raw_html.replace('id="mobile-menu-btn"', 'onClick={onMenuToggle}')
        jsx = html_to_jsx(raw_html)
        content = f'''import React from 'react';
import {{ Link }} from 'react-router-dom';

export default function Navbar({{ onMenuToggle }}) {{
  return (
    {jsx}
  );
}}
'''
        with open(os.path.join(layout_dir, 'Navbar.jsx'), 'w', encoding='utf-8') as f:
            f.write(content)
            
    # MobileMenu
    if mobile_menu_match:
        raw_html = mobile_menu_match.group(1)
        # replace ids and add state logic
        # We need to replace the static HTML accordion with React state.
        # For simplicity, we can use a basic JSX structure and manage the open state in the component.
        
        # We will parse the accordion items and convert them.
        # But wait, parsing the mobile menu is complex. I'll write the raw JSX and just use standard classes.
        # Let's replace the accordion logic with inline React state if possible, or just keep it simple.
        # To avoid complexity in the script, I will generate the base JSX and manually fix the mobile menu state.
        jsx = html_to_jsx(raw_html)
        jsx = jsx.replace('id="mobile-menu"', '')
        jsx = jsx.replace('id="close-menu-btn"', 'onClick={onClose}')
        
        content = f'''import React, {{ useState }} from 'react';
import {{ Link }} from 'react-router-dom';

export default function MobileMenu({{ isOpen, onClose }}) {{
  const [openSections, setOpenSections] = useState({{}});
  
  const toggleSection = (section) => {{
    setOpenSections(prev => ({{ ...prev, [section]: !prev[section] }}));
  }};

  return (
    <div className={{`fixed inset-0 z-[80] bg-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${{isOpen ? 'translate-x-0' : 'translate-x-full'}}`}}>
      <div dangerouslySetInnerHTML={{{{__html: `<!-- Replace this with proper JSX structure for accordions -->`}}}} />
      {jsx}
    </div>
  );
}}
'''     
        # Since standard jsx handles it ok, I'll just output it.
        # Actually, let's fix the mobile menu in a follow-up. 
        with open(os.path.join(layout_dir, 'MobileMenu.jsx'), 'w', encoding='utf-8') as f:
            f.write(content)
            
    # Footer
    if footer_match:
        jsx = html_to_jsx(footer_match.group(1))
        content = f'''import React from 'react';
import {{ Link }} from 'react-router-dom';

export default function Footer() {{
  return (
    {jsx}
  );
}}
'''
        with open(os.path.join(layout_dir, 'Footer.jsx'), 'w', encoding='utf-8') as f:
            f.write(content)

    # Home Page
    home_content = f'''import React from 'react';
import {{ Link }} from 'react-router-dom';

export default function Home() {{
  return (
    <main>
      <section className="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">Welcome to Revolt</h1>
          <p className="text-cocoa">Engineered loungewear, shapewear and essentials.</p>
          <Link to="/clothing/all-clothing" className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Shop Now</Link>
        </div>
      </section>
    </main>
  );
}}
'''
    with open(os.path.join(pages_dir, 'Home.jsx'), 'w', encoding='utf-8') as f:
        f.write(home_content)

    # Generate Pages
    app_imports = []
    app_routes = []
    
    print(f"Generating {len(routes)} pages...")
    for category, slug in routes:
        cat_dir = os.path.join(pages_dir, category)
        os.makedirs(cat_dir, exist_ok=True)
        
        comp_name = slug.replace('-', ' ').title().replace(' ', '')
        # Ensure valid component name
        comp_name = re.sub(r'[^a-zA-Z0-9]', '', comp_name)
        
        page_content = f'''import React from 'react';
import {{ Link }} from 'react-router-dom';

export default function {comp_name}() {{
  return (
    <main>
      <section className="py-32 bg-canvas min-h-[60vh] flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-ink mb-4">{slug.replace("-", " ").title()}</h1>
          <p className="text-cocoa">This is a placeholder page for {slug.replace("-", " ").title()}.</p>
          <Link to="/" className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] border-b border-ink pb-1 hover:text-cocoa transition-colors">Return Home</Link>
        </div>
      </section>
    </main>
  );
}}
'''
        with open(os.path.join(cat_dir, f'{comp_name}.jsx'), 'w', encoding='utf-8') as f:
            f.write(page_content)
            
        app_imports.append(f"import {comp_name} from './pages/{category}/{comp_name}';")
        app_routes.append(f'        <Route path="/{category}/{slug}" element={{<{comp_name} />}} />')
        
    # Generate App.jsx
    app_jsx = f'''import React, {{ useState }} from 'react';
import {{ BrowserRouter as Router, Routes, Route, useLocation }} from 'react-router-dom';
import AnnouncementBar from './components/ui/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

{chr(10).join(app_imports)}

function Layout({{ children }}) {{
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close menu on route change
  const location = useLocation();
  React.useEffect(() => {{
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }}, [location.pathname]);

  return (
    <div className="bg-canvas text-ink min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar onMenuToggle={{() => setMobileMenuOpen(true)}} />
      <MobileMenu isOpen={{isMobileMenuOpen}} onClose={{() => setMobileMenuOpen(false)}} />
      <div className="flex-1">
        {{children}}
      </div>
      <Footer />
    </div>
  );
}}

function App() {{
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={{<Home />}} />
{chr(10).join(app_routes)}
        </Routes>
      </Layout>
    </Router>
  );
}}

export default App;
'''
    with open(os.path.join(base_dir, 'src', 'App.jsx'), 'w', encoding='utf-8') as f:
        f.write(app_jsx)
        
    print("React generation complete.")

if __name__ == "__main__":
    main()
