using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProductManagement.Application.DTOs;
using ProductManagement.Application.Common.Models;
using ProductManagement.Domain.Enums;

namespace ProductManagement.Application.Services
{
    public interface IOrderService
    {
        Task<OrderDto> GetOrderByIdAsync(Guid id);
        Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PaginationParameters parameters);
        Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto);
        Task<OrderDto> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusDto updateOrderStatusDto);
        Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(OrderStatus status);
        Task<IEnumerable<OrderDto>> GetOrdersByCustomerEmailAsync(string customerEmail);
    }
} 