using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Logging;
using ProductManagement.Application.Exceptions;
using ProductManagement.Domain.Entities;
using ProductManagement.Persistence.Repositories;
using ProductManagement.Application.Common.Models;

namespace ProductManagement.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly ILogger<ProductService> _logger;

        public ProductService(IProductRepository repository, ILogger<ProductService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<PagedResponse<Product>> GetAllProductsAsync(PaginationParameters parameters)
        {
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
            ValidateProduct(product);
            return await _repository.CreateAsync(product);
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            _logger.LogInformation("Updating product with ID: {id}", product.Id);
            ValidateProduct(product);
            var updatedProduct = await _repository.UpdateAsync(product);
            if (updatedProduct == null)
            {
                _logger.LogWarning("Product with ID {id} not found", product.Id);
                throw new NotFoundException($"Product with ID {product.Id} not found");
            }
            return updatedProduct;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            _logger.LogInformation("Deleting product with ID: {id}", id);
            return await _repository.DeleteAsync(id);
        }

        private void ValidateProduct(Product product)
        {
            if (string.IsNullOrEmpty(product.Name))
            {
                _logger.LogWarning("Product name is required");
                throw new ValidationException("Product name is required");
            }
            if (product.Price < 0)
            {
                _logger.LogWarning("Product price cannot be negative");
                throw new ValidationException("Product price cannot be negative");
            }
            if (product.StockQuantity < 0)
            {
                _logger.LogWarning("Stock quantity cannot be negative");
                throw new ValidationException("Stock quantity cannot be negative");
            }
        }
    }
} 