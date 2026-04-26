# Deploy su Dokploy

1. Crea una nuova applicazione di tipo **Docker Compose**.
2. Collega il repository e imposta come file Compose `docker-compose.yml`.
3. Deploya il servizio `app`.
4. Nella scheda **Domains** di Dokploy, aggiungi il dominio e collega la porta interna `3000`.
5. Se servono variabili di produzione, inseriscile nella UI di Dokploy: verranno scritte in `.env` e caricate dal Compose.

Il container avvia Next.js in modalita standalone con:

```sh
node server.js
```
