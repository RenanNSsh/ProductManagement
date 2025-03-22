using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ProductManagement.Application.Common.Models;
using ProductManagement.Application.Exceptions;
using FluentValidation;

namespace ProductManagement.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var errorResponse = new ErrorResponse(
                exception.Message,
                exception.GetType().Name,
                _env.IsDevelopment() ? exception.StackTrace : null,
                GetStatusCode(exception),
                context.TraceIdentifier
            );

            _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

            response.StatusCode = errorResponse.StatusCode;

            var result = JsonSerializer.Serialize(errorResponse);
            await response.WriteAsync(result);
        }

        private static int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                NotFoundException => (int)HttpStatusCode.NotFound,
                _ => (int)HttpStatusCode.InternalServerError
            };
        }
    }
}