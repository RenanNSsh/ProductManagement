using Microsoft.Extensions.Logging;
using ProductManagement.Application.Exceptions;
using ProductManagement.Domain.Entities;
using ProductManagement.Persistence.Repositories;
using ProductManagement.Application.Common.Models;
using FluentValidation;

namespace ProductManagement.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly ILogger<ProductService> _logger;
        private readonly IValidator<Product> _validator;
        private readonly IValidator<PaginationParameters> _paginationValidator;

        public ProductService(
            IProductRepository repository, 
            ILogger<ProductService> logger, 
            IValidator<Product> validator,
            IValidator<PaginationParameters> paginationValidator)
        {
            _repository = repository;
            _logger = logger;
            _validator = validator;
            _paginationValidator = paginationValidator;
        }

        public async Task<PagedResponse<Product>> GetAllProductsAsync(PaginationParameters parameters)
        {
            var validationResult = await _paginationValidator.ValidateAsync(parameters);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                _logger.LogWarning("Validation failed for pagination parameters: {errors}", errors);
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            var totalCount = await _repository.GetTotalCountAsync();
            var items = await _repository.GetPagedProductsAsync(parameters.PageNumber, parameters.PageSize);
            
            var response = new PagedResponse<Product>
            {
                Items = items,
                PageNumber = parameters.PageNumber,
                PageSize = parameters.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)parameters.PageSize)
            };

            return response;
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            _logger.LogInformation("Getting product by ID: {id}", id);
            var product = await _repository.GetByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Product with ID {id} not found", id);
                throw new NotFoundException($"Product with ID {id} not found");
            }
            return product;
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            _logger.LogInformation("Creating new product");
            var validationResult = await _validator.ValidateAsync(product);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                _logger.LogWarning("Validation failed for product: {errors}", errors);
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            return await _repository.CreateAsync(product);
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
           
            _logger.LogInformation("Updating product with ID: {id}", product.Id);
            var validationResult = await _validator.ValidateAsync(product);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                _logger.LogWarning("Validation failed for product: {errors}", errors);
                throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            // Check if product exists
            var existingProduct = await _repository.GetByIdAsync(product.Id);
            if (existingProduct == null)
            {
                _logger.LogWarning("Product with ID {id} not found", product.Id);
                throw new NotFoundException($"Product with ID {product.Id} not found");
            }

            var updatedProduct = await _repository.UpdateAsync(product);
            return updatedProduct;
        
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            _logger.LogInformation("Deleting product with ID: {id}", id);
            var result = await _repository.DeleteAsync(id);
            if (!result)
            {
                _logger.LogWarning("Product with ID {id} not found", id);
                throw new NotFoundException($"Product with ID {id} not found");
            }
            return true;
        }
    }
} 