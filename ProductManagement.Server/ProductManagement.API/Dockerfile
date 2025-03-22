# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs
RUN npm install -g @angular/cli

FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Install EF Core tools

# Copy all project files
COPY ["ProductManagement.API/ProductManagement.API.csproj", "ProductManagement.API/"]
COPY ["ProductManagement.Domain/ProductManagement.Domain.csproj", "ProductManagement.Domain/"]
COPY ["ProductManagement.Application/ProductManagement.Application.csproj", "ProductManagement.Application/"]
COPY ["ProductManagement.Infrastructure/ProductManagement.Infrastructure.csproj", "ProductManagement.Infrastructure/"]
COPY ["ProductManagement.Persistence/ProductManagement.Persistence.csproj", "ProductManagement.Persistence/"]
COPY ["ProductManagement.Identity/ProductManagement.Identity.csproj", "ProductManagement.Identity/"]

# Restore packages
RUN dotnet restore "ProductManagement.API/ProductManagement.API.csproj"

# Copy all source code
COPY . .

# Build the API project
WORKDIR "/src/ProductManagement.API"
RUN dotnet build "ProductManagement.API.csproj" -c $BUILD_CONFIGURATION -o /src/build

# Create and apply migrations
WORKDIR "/src"

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProductManagement.API.csproj" -c $BUILD_CONFIGURATION -o /src/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
WORKDIR /app
COPY --from=publish /src/publish .
COPY --from=build /src /src
COPY --from=build /root/.dotnet/tools /root/.dotnet/tools
ENV PATH="${PATH}:/root/.dotnet/tools"
ENTRYPOINT ["dotnet", "ProductManagement.API.dll"]
