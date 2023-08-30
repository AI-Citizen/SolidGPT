FROM node:18-buster

#WORKDIR /lowdefys
WORKDIR /lowdefy

ARG INPUT_APP_PROJECT_PATH

ENV INPUT_APP_PROJECT_PATH=$INPUT_APP_PROJECT_PATH

RUN echo "INPUT_APP_PROJECT_PATH: $INPUT_APP_PROJECT_PATH"

COPY . INPUT_APP_PROJECT_PATH

# # Enable pnpm using corepack
RUN corepack enable

EXPOSE 3000

CMD /bin/sh -c "pnpx lowdefy@rc init && pnpx lowdefy@rc dev"

