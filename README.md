# My Portfolio

A static portfolio site (HTML + CSS + JavaScript). All your content lives in `data.json`.

## Files

| File | What it does |
|---|---|
| `index.html` | The page |
| `styles.css` | All styling |
| `script.js` | Animations and language switching |
| `data.json` | Your content (name, about, skills, projects, photos, links) |

## Put it online with GitHub Pages

1. Create a new repository on GitHub (for example `portfolio`).
2. Click **Add file → Upload files** and drag in every file from this folder, then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.

## Editing your content

Edit data.json directly, save the file, then refresh the website. You do not need the on-page editor.

## Adding pictures

Put your pictures in the images/ folder. On GitHub, use Add file → Upload files and upload them into images/, then commit the upload. Use the relative file path in data.json:

- Profile picture: set avatarImage to, for example, images/profile.jpg.
- Project picture: set that project's image to, for example, images/home-lab.jpg.

Use the actual file name and extension, including uppercase or lowercase letters as uploaded. Leave a field as an empty string ("") when you do not want a picture.

## Language menu

The site starts in English. Use **Select language** to return to English after choosing another language. The menu also offers Bahasa Melayu, Simplified Chinese, Traditional Chinese, Japanese, Korean, German, and Portuguese (Portugal). Choosing one translates portfolio text in place; the original `data.json` stays unchanged. Translations use the MyMemory service, and successful translations are cached in the browser.

## Inspiration photos

The inspiration cards read their names, quotes, and image paths from `data.json`. Add photos as `images/max-verstappen.jpg` and `images/stephen-curry.jpg`, or change the paths to match your uploaded filenames.

## Try it on your computer first

Opening `index.html` directly works, but to load `data.json` like the real site, run this in the folder and open http://localhost:8000:

```
python -m http.server 8000
```
