FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["ChattyApp.csproj", "."]
RUN dotnet restore "ChattyApp.csproj"

COPY . .
RUN dotnet build "ChattyApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ChattyApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/Frontend ./Frontend

ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "ChattyApp.dll"]