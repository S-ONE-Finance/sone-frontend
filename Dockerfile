FROM ubuntu:20.04

ENV TZ=Asia/Ho_Chi_Minh

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update && apt install curl -y \
    && apt install -y git \
    && apt-get install -y gnupg2 \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt update && apt install -y nodejs && apt install -y yarn \
    && apt install -y tzdata

# Create app directory
WORKDIR /app

# Install app dependencies
COPY . ./

RUN yarn --pure-lockfile && yarn

EXPOSE 3000

CMD [ "yarn", "start" ]