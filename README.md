# My Portfolio

A static portfolio site (HTML + CSS + JavaScript). All your content lives in `data.json`.

## Files

| File | What it does |
|---|---|
| `index.html` | The page |
| `styles.css` | All styling |
| `script.js` | Animations and the edit panel |
| `data.json` | Your content (name, about, skills, projects, photos, links) |
| `save.php` | Optional. Only used if you host on a PHP server. Not used on GitHub Pages. |

## Put it online with GitHub Pages

1. Create a new repository on GitHub (for example `portfolio`).
2. Click **Add file → Upload files** and drag in every file from this folder, then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.

## Editing your content

1. Open your site with `?edit` on the end, for example `https://YOUR-USERNAME.github.io/portfolio/?edit`. The **Edit content** button only shows this way, so visitors won't see it.
2. Change your details, add your photo and projects, then press **Save**. The page updates and your browser downloads a new `data.json`.
3. In your GitHub repository, click **Add file → Upload files** and upload that `data.json` (it replaces the old one). Your site updates after a minute.

## Try it on your computer first

Opening `index.html` directly works, but to load `data.json` like the real site, run this in the folder and open http://localhost:8000:

```
python -m http.server 8000
```
