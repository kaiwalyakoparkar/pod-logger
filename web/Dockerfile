# Use the official NGINX image
FROM nginx:alpine

# Copy the static files to the NGINX html directory
COPY . /usr/share/nginx/html

# Expose port 80 to be accessible from outside the container
EXPOSE 80

# Command to run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
