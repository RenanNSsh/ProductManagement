using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Entities;
using ProductManagement.Persistence;
using ProductManagement.Persistence.Repositories;
using ProductManagement.Persistence.DatabaseContext;
using ProductManagement.Tests.Unit.Base;
namespace ProductManagement.Tests.Unit.Repositories
{
    public class ProductRepositoryTests : UnitTestBase, IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly ProductRepository _repository;

        public ProductRepositoryTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(_options);
            _repository = new ProductRepository(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetByIdAsync_WhenProductExists_ShouldReturnProduct()
        {
            // Arrange
            var product = new Product { Name = "Test Product", Description = "Test Description", Price = 100, StockQuantity = 10 };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(product.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Id, result.Id);
            Assert.Equal(product.Name, result.Name);
        }

        [Fact]
        public async Task GetByIdAsync_WhenProductDoesNotExist_ShouldReturnNull()
        {
            // Act
            var result = await _repository.GetByIdAsync(1);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddProductToDatabase()
        {
            // Arrange
            var product = new Product { Name = "New Product", Description = "New Description", Price = 100, StockQuantity = 10 };

            // Act
            var result = await _repository.CreateAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(product.Name, result.Name);
            Assert.True(result.Id > 0);

            var savedProduct = await _context.Products.FindAsync(result.Id);
            Assert.NotNull(savedProduct);
            Assert.Equal(product.Name, savedProduct.Name);
        }

        [Fact]
        public async Task UpdateAsync_WhenProductExists_ShouldUpdateProduct()
        {
            // Arrange
            var product = new Product { Name = "Original Product", Description = "Original Description", Price = 100, StockQuantity = 10 };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            product.Name = "Updated Product";
            product.Description = "Updated Description";
            product.Price = 150;
            product.StockQuantity = 15;

            // Act
            var result = await _repository.UpdateAsync(product);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Product", result.Name);
            Assert.Equal("Updated Description", result.Description);
            Assert.Equal(150, result.Price);
            Assert.Equal(15, result.StockQuantity);

            var updatedProduct = await _context.Products.FindAsync(product.Id);
            Assert.NotNull(updatedProduct);
            Assert.Equal("Updated Product", updatedProduct.Name);
        }

        [Fact]
        public async Task UpdateAsync_WhenProductDoesNotExist_ShouldReturnNull()
        {
            // Arrange
            var product = new Product { Id = 1, Name = "Non-existent Product", Description = "Non-existent Description" };

            // Act
            var result = await _repository.UpdateAsync(product);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_WhenProductExists_ShouldDeleteProduct()
        {
            // Arrange
            var product = new Product { Name = "Product to Delete", Description = "Product Description", Price = 100, StockQuantity = 10 };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.DeleteAsync(product.Id);

            // Assert
            Assert.True(result);
            var deletedProduct = await _context.Products.FindAsync(product.Id);
            Assert.Null(deletedProduct);
        }

        [Fact]
        public async Task DeleteAsync_WhenProductDoesNotExist_ShouldReturnFalse()
        {
            // Act
            var result = await _repository.DeleteAsync(1);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetPagedProductsAsync_ShouldReturnCorrectPage()
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
            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetPagedProductsAsync(1, 2);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("Product 1", result.First().Name);
            Assert.Equal("Product 2", result.Last().Name);
        }

        [Fact]
        public async Task GetTotalCountAsync_ShouldReturnCorrectCount()
        {
            // Arrange
            var products = new List<Product>
            {
                new() { Name = "Product 1", Description = "Description 1", Price = 100, StockQuantity = 10 },
                new() { Name = "Product 2", Description = "Description 2", Price = 200, StockQuantity = 20 },
                new() { Name = "Product 3", Description = "Description 3", Price = 300, StockQuantity = 30 }
            };
            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();

            // Act
            var count = await _repository.GetTotalCountAsync();

            // Assert
            Assert.Equal(3, count);
        }
    }
} 