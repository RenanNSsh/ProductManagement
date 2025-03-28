using Moq;
using ProductManagement.Application.Services;
using ProductManagement.Domain.Entities;
using ProductManagement.Persistence.Repositories;
using ProductManagement.Application.Common.Models;
using ProductManagement.Application.Exceptions;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using ProductManagement.Tests.Unit.Base;
using FluentValidation;
using FluentValidation.Results;

namespace ProductManagement.Tests.Unit.Services
{
    public class ProductServiceTests : UnitTestBase
    {
        private readonly Mock<IProductRepository> _repositoryMock;
        private readonly Mock<ILogger<ProductService>> _loggerMock;
        private readonly Mock<IValidator<Product>> _productValidatorMock;
        private readonly Mock<IValidator<PaginationParameters>> _paginationValidatorMock;
        private readonly ProductService _service;

        public ProductServiceTests()
        {
            _repositoryMock = new Mock<IProductRepository>();
            _loggerMock = new Mock<ILogger<ProductService>>();
            _productValidatorMock = new Mock<IValidator<Product>>();
            _paginationValidatorMock = new Mock<IValidator<PaginationParameters>>();
            _service = new ProductService(
                _repositoryMock.Object,
                _loggerMock.Object,
                _productValidatorMock.Object,
                _paginationValidatorMock.Object
            );

            // Setup default validation success for all tests
            _productValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<Product>(), default))
                .ReturnsAsync(new FluentValidation.Results.ValidationResult());
            _paginationValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<PaginationParameters>(), default))
                .ReturnsAsync(new FluentValidation.Results.ValidationResult());
        }

        [Fact]
        public async Task GetAllProductsAsync_ShouldReturnPagedResponse()
        {
            // Arrange
            var parameters = new PaginationParameters { PageNumber = 1, PageSize = 10 };
            var products = new List<Product>
            {
                new() { Id = new Guid(), Name = "Test Product 1", Price = 100, StockQuantity = 10 },
                new() { Id = new Guid(), Name = "Test Product 2", Price = 200, StockQuantity = 20 }
            };

            _repositoryMock.Setup(r => r.GetTotalCountAsync()).ReturnsAsync(2);
            _repositoryMock.Setup(r => r.GetPagedProductsAsync(1, 10)).ReturnsAsync(products);

            // Act
            var result = await _service.GetAllProductsAsync(parameters);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.TotalCount);
            Assert.Equal(1, result.PageNumber);
            Assert.Equal(10, result.PageSize);
            Assert.Equal(2, result.Items.Count());
        }

        [Fact]
        public async Task GetProductByIdAsync_WhenProductExists_ShouldReturnProduct()
        {
            // Arrange
            var productId = new Guid();
            var product = new Product { Id = productId, Name = "Test Product", Price = 100, StockQuantity = 10 };
            _repositoryMock.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync(product);

            // Act
            var result = await _service.GetProductByIdAsync(productId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(productId, result.Id);
        }

        [Fact]
        public async Task GetProductByIdAsync_WhenProductDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var productId = new Guid();
            _repositoryMock.Setup(r => r.GetByIdAsync(productId)).ReturnsAsync((Product?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.GetProductByIdAsync(productId));
        }

        [Fact]
        public async Task CreateProductAsync_WithValidProduct_ShouldCreateProduct()
        {
            // Arrange
            var product = new Product { Name = "New Product", Price = 100, StockQuantity = 10 };
            _repositoryMock.Setup(r => r.CreateAsync(product)).ReturnsAsync(product);

            // Act
            var result = await _service.CreateProductAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Name, result.Name);
            _repositoryMock.Verify(r => r.CreateAsync(product), Times.Once);
        }

        [Fact]
        public async Task CreateProductAsync_WithInvalidProduct_ShouldThrowValidationException()
        {
            // Arrange
            var product = new Product { Name = "", Price = -100, StockQuantity = -10 };
            var validationResult = new FluentValidation.Results.ValidationResult(new List<ValidationFailure>
            {
                new("Name", "Name is required"),
                new("Price", "Price must be greater than 0"),
                new("StockQuantity", "Stock quantity must be greater than 0")
            });
            _productValidatorMock.Setup(v => v.ValidateAsync(product, default))
                .ReturnsAsync(validationResult);

            // Act & Assert
            await Assert.ThrowsAsync<FluentValidation.ValidationException>(() => _service.CreateProductAsync(product));
        }

        [Fact]
        public async Task UpdateProductAsync_WhenProductExists_ShouldUpdateProduct()
        {
            // Arrange
            var product = new Product { Id = new Guid(), Name = "Updated Product", Price = 150, StockQuantity = 15 };
            _repositoryMock.Setup(r => r.GetByIdAsync(product.Id)).ReturnsAsync(product);
            _repositoryMock.Setup(r => r.UpdateAsync(product)).ReturnsAsync(product);

            // Act
            var result = await _service.UpdateProductAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Name, result.Name);
            Assert.Equal(product.Price, result.Price);
            Assert.Equal(product.StockQuantity, result.StockQuantity);
        }

        [Fact]
        public async Task UpdateProductAsync_WhenProductDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var product = new Product { Id = new Guid(), Name = "Test Product", Price = 100, StockQuantity = 10 };
            _repositoryMock.Setup(r => r.GetByIdAsync(product.Id)).ReturnsAsync((Product?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateProductAsync(product));
        }

        [Fact]
        public async Task DeleteProductAsync_ShouldReturnTrue()
        {
            // Arrange
            var productId = new Guid();
            _repositoryMock.Setup(r => r.DeleteAsync(productId)).ReturnsAsync(true);

            // Act
            var result = await _service.DeleteProductAsync(productId);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.DeleteAsync(productId), Times.Once);
        }
    }
} 