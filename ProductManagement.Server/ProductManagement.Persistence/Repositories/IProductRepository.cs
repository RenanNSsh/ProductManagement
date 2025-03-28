using ProductManagement.Domain.Entities;

namespace ProductManagement.Persistence.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetPagedProductsAsync(int pageNumber, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<Product?> GetByIdAsync(Guid id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
        Task<bool> DeleteAsync(Guid id);
    }
}