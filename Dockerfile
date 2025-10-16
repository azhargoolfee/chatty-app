# Use the official .NET 9.0 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the official .NET 9.0 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["ChattyApp.csproj", "."]
RUN dotnet restore "ChattyApp.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "ChattyApp.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "ChattyApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy the Frontend folder separately
COPY --from=build /src/Frontend ./Frontend

# Railway provides the PORT environment variable
ENV ASPNETCORE_URLS=http://+:$PORT

ENTRYPOINT ["dotnet", "ChattyApp.dll"]