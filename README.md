# ⚛️ Tentative TQEC visualiser
This is a preliminary concept for a JS-based environment to visualise and edit structures. The initial focus is to automatically generate 3D structures directly from PyZX data as close to correctness as possible. Subsequent steps would need to look into enable manual editing to enable human correction. The output layer has not yet been considered.

## 🚀 Launch
To jump straight into taking a look at the current progress, just:
- Clone, download, or otherwise get the repository into your local computer:
```sh
git clone https://github.com/tqec/tqec_vis.git
```
- Install all necessary dependencies
```sh
npm install
```
- Run the visualiser
```sh
npm install
```

## 🧑‍🚀 Stack
The visualiser uses a three.js engine, with an Astro Wrapper. The three.js code is portable to other frameworks besides Astro.
- Three.js code is maintained in its original vanilla-JS form to maximise the potential for contributions (if you know how to use other versions of three.js, you can easily engage with the foundational code, but not necessarily upside down).
- Astro is similar to React, except it is easier to use when there is a need to integrate vanilla-JS components with components from other frameworks, e.g., React.
- CSS is done with Tailwind.

## 📟 Schema
For now, visualisations are built directly from a JSON file adhering to the schema found in the file `./.admin/schema.json`.

In very general terms, the JSON is formed in three different stages:
- An object with wire_vertices, with {x, y, z, rot_x, rot_y, rot_z, scale_x, scale_y, scale_z} coordinates for each entry.
- An object with node_vertices, with {x, y, z, rot_x, rot_y, rot_z, scale_x, scale_y, scale_z} coordinates for each entry.
- An object with edges, with {source: str, target: str} keys refering to a wire_ or node_vertex in one of the objects above.

This may rapidly change as the schema is directly tied to the backend. 

## 🚀 Project Structure
The folder structure is as follows:

```text
/
├── ...
│   └── ... 
├── data                        # Folder to be replaced eventually
│   └── data.json               # Data for 3D visualisation
├── src/
│   ├── assets/
│   │    └── ...                # Graphics (e.g. textures)
│   ├── components/
│   │    └── ...                # Components folder
│   ├── layouts/
│   │   └── Layout.astro        # Layout to standardise pages' look
│   ├── pages/
│       └── index.astro         # Body of the homepage
│   └── scripts/
│   │   ├── animation.js        # Main animation script
│   │   └── importer.js         # Imports data
│   └── styles/
│       └── global.css          # Body of the homepage
└── package.json
```

## 🧞 Commands
All Astro commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 
...
