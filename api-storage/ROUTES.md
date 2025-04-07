# CRUD (toutes les routes nécessites une clé)
## Booths
Create
Read -> depuis grand écran
Update -> non
Delete -> non

## Images
Create -> depuis booth
Read -> depuis landing page
Update -> non
Delete -> non

# REST
## Booths
POST /api/booths -> Créée un nouveau booths et retourne l'id

## Images
GET /api/images -> Toutes les images
GET /api/images/:id -> Image avec l'id

GET /api/booths/:boothID/last -> Les dérnières images du booth

POST /api/images -> Demande un corps de requête formé de : kioskID, image, clé. Ajoute et retourne l'id de l'image.