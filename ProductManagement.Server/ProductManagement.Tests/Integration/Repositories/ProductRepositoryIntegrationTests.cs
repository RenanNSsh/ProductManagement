using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Entities;
using ProductManagement.Persistence.Repositories;
using ProductManagement.Tests.Integration.Base;
using ProductManagement.Tests;

namespace ProductManagement.Tests.Integration.Repositories
{
    public class ProductRepositoryIntegrationTests : IntegrationTestBase
    {
        private readonly ProductRepository _repository;

        public ProductRepositoryIntegrationTests()
        {
            _repository = new ProductRepository(Context);
        }

        [Fact]
        public async Task CreateAndRetrieveProduct_ShouldWorkCorrectly()
        {
            // Arrange
            var product = new Product
            {
                Name = "Integration Test Product",
                Description = "This is a test product created in integration test",
                Price = 99.99m,
                StockQuantity = 100
            };

            // Act - Create
            var createdProduct = await _repository.CreateAsync(product);

            // Assert - Create
            Assert.NotNull(createdProduct);
            Assert.Equal(product.Name, createdProduct.Name);
            Assert.Equal(product.Description, createdProduct.Description);
            Assert.Equal(product.Price, createdProduct.Price);
            Assert.Equal(product.StockQuantity, createdProduct.StockQuantity);

            // Act - Retrieve
            var retrievedProduct = await _repository.GetByIdAsync(createdProduct.Id);

            // Assert - Retrieve
            Assert.NotNull(retrievedProduct);
            Assert.Equal(createdProduct.Id, retrievedProduct.Id);
            Assert.Equal(createdProduct.Name, retrievedProduct.Name);
            Assert.Equal(createdProduct.Description, retrievedProduct.Description);
            Assert.Equal(createdProduct.Price, retrievedProduct.Price);
            Assert.Equal(createdProduct.StockQuantity, retrievedProduct.StockQuantity);
        }

        [Fact]
        public async Task UpdateProduct_ShouldPersistChanges()
        {
            // Arrange
            var product = new Product
            {
                Name = "Original Product",
                Description = "Original Description",
                Price = 100,
                StockQuantity = 50
            };
            var createdProduct = await _repository.CreateAsync(product);

            // Act
            createdProduct.Name = "Updated Product";
            createdProduct.Description = "Updated Description";
            createdProduct.Price = 150;
            createdProduct.StockQuantity = 75;

            var updatedProduct = await _repository.UpdateAsync(createdProduct);

            // Assert
            Assert.NotNull(updatedProduct);
            Assert.Equal("Updated Product", updatedProduct.Name);
            Assert.Equal("Updated Description", updatedProduct.Description);
            Assert.Equal(150, updatedProduct.Price);
            Assert.Equal(75, updatedProduct.StockQuantity);

            // Verify changes persisted
            var retrievedProduct = await _repository.GetByIdAsync(createdProduct.Id);
            Assert.NotNull(retrievedProduct);
            Assert.Equal("Updated Product", retrievedProduct.Name);
            Assert.Equal("Updated Description", retrievedProduct.Description);
            Assert.Equal(150, retrievedProduct.Price);
            Assert.Equal(75, retrievedProduct.StockQuantity);
        }

        [Fact]
        public async Task DeleteProduct_ShouldRemoveFromDatabase()
        {
            // Arrange
            var product = new Product
            {
                Name = "Product to Delete",
                Description = "This product will be deleted",
                Price = 100,
                StockQuantity = 50
            };
            var createdProduct = await _repository.CreateAsync(product);

            // Act
            var deleteResult = await _repository.DeleteAsync(createdProduct.Id);

            // Assert
            Assert.True(deleteResult);

            // Verify product is deleted
            var deletedProduct = await _repository.GetByIdAsync(createdProduct.Id);
            Assert.Null(deletedProduct);
        }

        [Fact]
        public async Task GetPagedProducts_ShouldReturnCorrectPage()
        {
            // Arrange
            var products = new List<Product>
            {
                new() { Name = "Product 1", Description = "Description 1", Price = 100, StockQuantity = 10 },
                new() { Name = "Product 2", Description = "Description 2", Price = 200, StockQuantity = 20 },
                new() { Name = "Product 3", Description = "Description 3", Price = 300, StockQuantity = 30 },
                new() { Name = "Product 4", Description = "Description 4", Price = 400, StockQuantity = 40 },
                new() { Name = "Product 5", Description = "Description 5", Price = 500, StockQuantity = 50 }
            };

            foreach (var product in products)
            {
                await _repository.CreateAsync(product);
            }

            // Act
            var pagedProducts = await _repository.GetPagedProductsAsync(1, 2);
            var totalCount = await _repository.GetTotalCountAsync();

            // Assert
            Assert.Equal(2, pagedProducts.Count());
            Assert.Equal(5, totalCount);
            Assert.Equal("Product 1", pagedProducts.First().Name);
            Assert.Equal("Product 2", pagedProducts.Last().Name);
        }
    }
} 