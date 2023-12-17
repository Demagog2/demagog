# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Install locales package
RUN apt-get update && apt-get install -y locales

# Generate and install the "cs_CZ" locale
RUN echo "cs_CZ.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=cs_CZ.UTF-8

ENV LANG cs_CZ.utf8