FROM node:12

ARG CHOSE_PROXY

# RUN mkdir /home/tmp_node_project
# COPY ./package.json /home/tmp_node_project
# RUN cd /home/tmp_node_project && npm install -D

USER root

# installing stuff
# inotify-tools - for react hot loading, Linux Filesystem Events
RUN \
    apt-get update && apt-get install -y \
        nano vim inotify-tools git

USER node

#RUN if [ $CHOSE_PROXY = "artifactory" ]; then \
#    # configure artifactory registry
#    npm config set ca null; \
#    npm config set strict-ssl false; \
#    # npm config set registry https://artifactory.ubisoft.org/api/npm/npm/; \
#    npm config set registry https://artifactory/artifactory/api/npm/npm/; \
#    npm config set http_proxy http://proxy.ubisoft.org:3128/; \
#    npm config set https-proxy http://proxy.ubisoft.org:3128/; \
#    npm config set proxy http://proxy.ubisoft.org:3128/; \
#    npm config set python "python2.7"; \
#else \
#    # configure verdaccio registry
#    npm config set ca null; \
#    npm config set strict-ssl false; \
#    npm config set registry http://verdaccio:4873; \
#    npm config set python "python2.7"; \
#fi ;

ENV PATH=${PATH}:/home/node/.npm-global/bin:/home/node/app/node_modules/.bin/