using Microsoft.EntityFrameworkCore;
using ProductManagement.Application.Services;
using ProductManagement.Persistence.DatabaseContext;
using ProductManagement.Persistence.Repositories;
using ProductManagement.API.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;
using ProductManagement.Application.Validators;
using ProductManagement.Domain.Entities;
using ProductManagement.Application.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<ProductValidator>());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Configure logging to show SignalR debug messages
builder.Logging.AddFilter("Microsoft.AspNetCore.SignalR", LogLevel.Debug);
builder.Logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Type")
    );
});

// Add SignalR
builder.Services.AddSignalR();

// Add DB Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Services
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderNotificationService, OrderNotificationService>();

// Register repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
    

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Important: Keep this exact middleware order
app.UseCors("AllowAll");
app.UseRouting();
app.UseHttpsRedirection();
app.UseAuthorization();

// Map endpoints after all middleware
app.MapHub<OrderHub>("/orderHub");
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
