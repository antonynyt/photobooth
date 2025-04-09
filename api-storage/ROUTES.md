# CRUD (toutes les routes nécessites une clé)
## Booths
Create -> manual only
Read -> no
Update -> no
Delete -> no

## Images
Create -> from booth
Read -> from landing page and big screen
Update -> no
Delete -> no

# REST
## Booths
POST /api/booths -> Creates new booths et returns id (request body must contain key)

## Images
GET /api/images -> All images (empty request body)
GET /api/images/:id -> Image with given id (empty request body)

GET /api/booths/:boothID/last -> Last image from booth (empty request body)

POST /api/images -> Adds an image to DB and returns image. (request body must contain boothID, img and key. img must contain data and contentType.)