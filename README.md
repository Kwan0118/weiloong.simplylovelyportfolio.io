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

1. Open your portfolio and click **Edit content** in the top menu.
2. In GitHub, create a fine-grained personal access token for this repository. Give it **Contents: Read and write** permission.
3. In the edit panel, confirm the `owner/repository` field, paste the token, make your changes, and click **Save**. The page commits the updated `data.json` directly to GitHub; it does not download a file. GitHub Pages publishes the commit after its build finishes.

The token is cleared after each save and is not stored by the page. Do not put it in `data.json` or share it in a message.

## Language menu

The menu changes the site interface labels in English, Bahasa Melayu, Simplified Chinese, and Traditional Chinese. Portfolio text you enter remains as written.

## Try it on your computer first

Opening `index.html` directly works, but to load `data.json` like the real site, run this in the folder and open http://localhost:8000:

```
python -m http.server 8000
```
