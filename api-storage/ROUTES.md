# CRUD (toutes les routes nécessites une clé)
## Stands
Create
Read -> depuis grand écran
Update -> non
Delete -> non

## Images
Create -> depuis booth
Read -> depuis landing page
Update -> non
Delete -> Nécessaire pour RGPD. Requête manuelle.

# REST
## Stands
GET /api/stands/:id/last -> Les dérnières images du stands

POST /api/stands -> Créée un nouveau stands et retourne l'id

PATCH /api/stands/:id/last -> Change les dernières images du stand

## Images
GET /api/images -> Toutes les images
GET /api/images/:id -> Image avec l'id

POST /api/images -> Demande un corps de requête formé de : kioskID, image, clé. Ajoute et retourne l'id de l'image.

DELETE /api/images/:id -> Supprime une image