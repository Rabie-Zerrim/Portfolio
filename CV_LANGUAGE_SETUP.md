# CV Language Setup - English & French

Your portfolio now supports two versions of your CV/Resume - English and French!

## What Was Changed

### 1. Configuration ([src/config.js](src/config.js))

- Added `resumes` object with paths to English and French CV files

### 2. Navigation Component ([src/components/nav.js](src/components/nav.js))

- Added dropdown menu to select language (desktop view)
- Shows flag emojis: 🇬🇧 English and 🇫🇷 Français
- Dropdown appears when clicking on "Resume" button

### 3. Mobile Menu ([src/components/menu.js](src/components/menu.js))

- Added two separate buttons for English and French CVs
- Stacked vertically for easy mobile access

## Next Steps - What You Need to Do

### 1. Prepare Your CV Files

You need to create two PDF files:

- **English version**: `resume-en.pdf`
- **French version**: `resume-fr.pdf`

### 2. Add Files to Static Folder

Place both PDF files in the `static` folder:

```
static/
  ├── resume-en.pdf   ← English CV
  ├── resume-fr.pdf   ← French CV
  └── resume.pdf      ← You can keep or delete this old one
```

### 3. Test Locally

Run your development server to test:

```bash
npm run develop
```

or

```bash
gatsby develop
```

Then visit your site and:

- Click on "Resume" in the navigation bar
- Select either English or French version
- Test on mobile view as well (hamburger menu)

### 4. Deploy

Once you've added the PDF files and tested, rebuild and deploy:

```bash
npm run build
```

## File Paths

The CV files are referenced as:

- English: `/resume-en.pdf`
- French: `/resume-fr.pdf`

If your site has a path prefix (like `/Portfolio/`), the code automatically handles it using Gatsby's `withPrefix()` function.

## Customization

### Change Flag Emojis or Labels

Edit [src/components/nav.js](src/components/nav.js) and [src/components/menu.js](src/components/menu.js):

```javascript
🇬🇧 English  // Change to whatever you prefer
🇫🇷 Français
```

### Change File Names

If you want different file names, update [src/config.js](src/config.js):

```javascript
resumes: {
  en: '/your-custom-name-en.pdf',
  fr: '/your-custom-name-fr.pdf',
}
```

### Add More Languages

You can easily add more languages by:

1. Adding to the `resumes` object in config.js
2. Adding more links in the dropdown/menu components

Example for adding Spanish:

```javascript
// In config.js
resumes: {
  en: '/resume-en.pdf',
  fr: '/resume-fr.pdf',
  es: '/resume-es.pdf',
}

// In nav.js and menu.js, add:
<a
  href={withPrefix(resumes.es)}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setDropdownOpen(false)}
>
  🇪🇸 Español
</a>
```

## Features

✅ Desktop dropdown menu with smooth animations
✅ Mobile-friendly stacked buttons
✅ Flag emojis for visual identification
✅ Opens CVs in new tab
✅ Smooth hover effects and transitions
✅ Accessible (keyboard navigation supported)

Enjoy your multilingual portfolio! 🎉
