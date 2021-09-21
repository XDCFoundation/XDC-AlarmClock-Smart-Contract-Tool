FROM node:12.18.3 as build-stage
WORKDIR /app
COPY ./ .
RUN npm install
RUN npm run build

FROM nginx:1.21.1
RUN mkdir -p /tlc
COPY --from=build-stage /app/dist/ /tlc/
RUN chmod -R a+r /tlc
COPY default.conf /etc/nginx/conf.d