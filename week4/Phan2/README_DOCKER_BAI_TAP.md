# Docker Bai Tap Tuan 4

## Bai 1 - Node.js Hello Docker
- Thu muc: `Bai1`
- Build: `docker build -t bai1-node .`
- Run: `docker run -p 3000:3000 bai1-node`

## Bai 2 - Python Flask Hello Docker
- Thu muc: `Bai2`
- Build: `docker build -t bai2-flask .`
- Run: `docker run -p 5000:5000 bai2-flask`

## Bai 3 - React app
- Thu muc: `Bai3`
- Build: `docker build -t bai3-react .`
- Run: `docker run -p 3000:3000 bai3-react`

## Bai 4 - Static web voi Nginx
- Thu muc: `Bai4`
- Build: `docker build -t bai4-nginx .`
- Run: `docker run -p 8080:80 bai4-nginx`

## Bai 5 - Go app
- Thu muc: `Bai5`
- Build: `docker build -t bai5-go .`
- Run: `docker run -p 8080:8080 bai5-go`

## Bai 6 - Multi-stage Node.js
- Thu muc: `Bai6`
- Build: `docker build -t bai6-multistage .`
- Run: `docker run -p 3000:3000 bai6-multistage`

## Bai 7 - ENV trong Dockerfile (Python)
- Thu muc: `Bai7`
- Build: `docker build -t bai7-env .`
- Run mac dinh: `docker run bai7-env`
- Override ENV: `docker run -e APP_ENV=production bai7-env`

## Bai 8 - PostgreSQL custom + init.sql
- Thu muc: `Bai8`
- Build: `docker build -t bai8-postgres .`
- Run:
  `docker run --name bai8-pg -e POSTGRES_PASSWORD=123456 -p 5432:5432 bai8-postgres`

## Bai 9 - Redis custom config
- Thu muc: `Bai9`
- Build: `docker build -t bai9-redis .`
- Run: `docker run -p 6379:6379 bai9-redis`

## Bai 10 - PHP + Apache (mount source)
- Thu muc: `Bai10`
- Build: `docker build -t bai10-php .`
- Run voi mount code tu host:
  `docker run -p 8080:80 -v ${PWD}:/var/www/html bai10-php`
