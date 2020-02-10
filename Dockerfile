# Set NodeJS version
FROM oraclelinux:7-slim

# Install Required Plugin
# RUN yum update -y && \
# 	yum install -y oracle-release-el7 && \
# 	yum install -y oracle-nodejs-release-el7 && \
# 	yum install -y nodejs && \
# 	yum install -y oracle-instantclient19.3-basic.x86_64 && \
# 	yum clean all && \
# 	node --version && \
# 	npm --version && \
# 	npm install oracledb && \
# 	echo Installed

RUN yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
    yum-config-manager --disable ol7_developer_EPEL --enable ol7_oracle_instantclient && \
    yum -y install nodejs oracle-instantclient19.5-basiclite && \
    rm -rf /var/cache/yum

# User Setup
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app

# Install required packages
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Setup port
EXPOSE 4015

# Running command
CMD [ "node", "server.js" ]