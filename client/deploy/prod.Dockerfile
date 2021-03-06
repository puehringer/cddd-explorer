# https://mherman.org/blog/dockerizing-a-react-app/
# Build in container
FROM node:12-alpine as build
RUN mkdir /frontend
WORKDIR /frontend
# Install app dependencies
COPY package.json package-lock.json[t] ./
RUN npm install
# Add app
COPY . ./
# Run the build
RUN npm run build

# NGINX production environment
FROM nginx:stable-alpine
COPY --from=build /frontend/build /usr/share/nginx/html
# Use templates to allow ENV: https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration-new-in-119
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]