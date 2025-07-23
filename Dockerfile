FROM node:20 AS build-react

WORKDIR /app
COPY . .


# Install dependencies and build the React app
RUN npm install && npm run build

# Use the latest stable Nginx Alpine image
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy the built React app from the previous stage
COPY --from=build-react /app/build .

# Install envsubst and update vulnerable package
RUN apk update && apk upgrade libxml2 && apk --no-cache add gettext && rm -rf /var/cache/apk/*

# Move config.json to a template file
RUN mv /usr/share/nginx/html/config.json /usr/share/nginx/html/config.template.json

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 80

# Set the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

