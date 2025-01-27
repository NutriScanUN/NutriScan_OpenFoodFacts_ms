# NutriScan_OpenFoodFacts_ms

## Commands to Docker Compile and Run

To build and run the Docker container, use the following commands:

```js
docker build -t nutriscanun-openfoodfacts-ms .
docker run -d -p 3004:3004 --env-file .env --name nutriscanun-openfoodfacts-ms-docker nutriscanun-store-ms
```

## Image Deploy

```js
docker tag nutriscanun-openfoodfacts-ms juanxo074/nutriscan-openfoodfacts-ms:latest
```
