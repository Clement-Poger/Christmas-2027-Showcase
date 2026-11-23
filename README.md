# La hotte à gratter

Une petite page web interactive sur le thème de Noël. Six cartes cadeaux masquées peuvent être révélées en les grattant avec la souris ou le doigt.

## Fonctionnalités

- Six cartes cadeaux à révéler
- Effet de grattage réalisé avec Canvas
- Compteur indiquant le nombre de cadeaux révélés
- Message final lorsque toutes les cartes ont été découvertes
- Interface responsive pour ordinateur, tablette et mobile
- Respect de la préférence `prefers-reduced-motion`

## Aperçu

Ouvrir `index.html` dans un navigateur permet d'afficher directement la page.

## Lancement local

Depuis la racine du projet :

```bash
python -m http.server 8000
```

Puis ouvrir <http://localhost:8000> dans le navigateur.

## Structure du projet

```text
.
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
```

## Technologies

- HTML5
- CSS3
- JavaScript
- Canvas 2D
