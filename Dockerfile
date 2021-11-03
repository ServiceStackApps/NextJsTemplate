FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build

RUN apt-get update -yq \
    && apt-get -yq install curl gnupg ca-certificates \
    && curl -L https://deb.nodesource.com/setup_lts.x | bash \
    && apt-get update -yq \
    && apt-get install -yq \
       nodejs

WORKDIR /app

COPY ./ui ./ui
COPY ./api ./api

WORKDIR /app/ui
RUN npm install && npm run publish

WORKDIR /app/api
RUN dotnet restore

WORKDIR /app/api/MyApp
RUN dotnet publish -c release -o /out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS runtime
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet", "MyApp.dll"]
