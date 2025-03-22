using Microsoft.AspNetCore.SignalR;
using ProductManagement.Application.DTOs;
using ProductManagement.Domain.Enums;
using ProductManagement.Application.Hubs;

namespace ProductManagement.Application.Services
{
    public interface IOrderNotificationService
    {
        Task NotifyOrderCreated(OrderDto order);
        Task NotifyOrderStatusUpdated(OrderDto order);
        Task NotifyOrderDeleted(Guid orderId);
    }

    public class OrderNotificationService : IOrderNotificationService
    {
        private readonly IHubContext<OrderHub> _hubContext;

        public OrderNotificationService(IHubContext<OrderHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyOrderCreated(OrderDto order)
        {
            // Notify all users in the general orders group
            await _hubContext.Clients.Group("Orders").SendAsync("OrderCreated", order);

            // Notify users in the specific status group
            await _hubContext.Clients.Group($"OrderStatus_{order.Status}").SendAsync("OrderCreated", order);
        }

        public async Task NotifyOrderStatusUpdated(OrderDto order)
        {
            // Notify all users in the general orders group
            await _hubContext.Clients.Group("Orders").SendAsync("OrderStatusUpdated", order);

            // Notify users in both the old and new status groups
            await _hubContext.Clients.Group($"OrderStatus_{order.Status}").SendAsync("OrderStatusUpdated", order);
        }

        public async Task NotifyOrderDeleted(Guid orderId)
        {
            // Notify all users in the general orders group
            await _hubContext.Clients.Group("Orders").SendAsync("OrderDeleted", orderId);
        }
    }
} 