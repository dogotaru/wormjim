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
        # python python-dev python3-dev

# use the latest stable release
# RUN \
#    cd /home/node \
#    && git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1 \
#    && cd watchman && ./autogen.sh && ./configure && make \
#    && make install

# COPY /usr/local/bin/watchman* /usr/local/bin/

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