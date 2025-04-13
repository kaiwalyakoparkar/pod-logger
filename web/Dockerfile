# Use the official NGINX image
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy the static files to the NGINX html directory
COPY . /usr/share/nginx/html

# Expose port 80 to be accessible from outside the container
EXPOSE 80

# Command to run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
