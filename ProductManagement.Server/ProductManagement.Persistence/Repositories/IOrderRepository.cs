using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Enums;

namespace ProductManagement.Persistence.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> GetByIdAsync(Guid id);
        Task<IEnumerable<Order>> GetPagedOrdersAsync(int pageNumber, int pageSize);
        Task<int> GetTotalCountAsync();
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateAsync(Order order);
        Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status);
        Task<IEnumerable<Order>> GetByCustomerEmailAsync(string customerEmail);
    }
} 