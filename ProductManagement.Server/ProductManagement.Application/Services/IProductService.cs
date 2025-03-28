using ProductManagement.Application.Common.Models;
using ProductManagement.Domain.Entities;

namespace ProductManagement.Application.Services
{
    public interface IProductService
    {
        Task<PagedResponse<Product>> GetAllProductsAsync(PaginationParameters parameters);
        Task<Product> GetProductByIdAsync(Guid id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(Guid id);
    } 
}