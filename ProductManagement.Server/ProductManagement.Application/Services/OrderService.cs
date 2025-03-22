using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Application.DTOs;
using ProductManagement.Domain.Entities;
using ProductManagement.Domain.Enums;
using ProductManagement.Persistence.DatabaseContext;
using Microsoft.Extensions.Logging;
using ProductManagement.Application.Exceptions;
using ProductManagement.Application.Validators;
using ProductManagement.Persistence.Repositories;
using FluentValidation;
using ProductManagement.Application.Common.Models;

namespace ProductManagement.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly ILogger<OrderService> _logger;
        private readonly IValidator<Order> _validator;
        private readonly IOrderNotificationService _notificationService;

        public OrderService(
            IOrderRepository repository,
            IProductRepository productRepository,
            ILogger<OrderService> logger,
            IValidator<Order> validator,
            IOrderNotificationService notificationService)
        {
            _repository = repository;
            _productRepository = productRepository;
            _logger = logger;
            _validator = validator;
            _notificationService = notificationService;
        }

        public async Task<OrderDto> GetOrderByIdAsync(Guid id)
        {
            _logger.LogInformation("Getting order by ID: {id}", id);
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {id} not found", id);
                throw new NotFoundException($"Order with ID {id} not found");
            }
            return MapToDto(order);
        }

        public async Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PaginationParameters parameters)
        {
            _logger.LogInformation("Getting orders with pagination. Page: {page}, Size: {size}", 
                parameters.PageNumber, parameters.PageSize);

            var totalCount = await _repository.GetTotalCountAsync();
            var orders = await _repository.GetPagedOrdersAsync(parameters.PageNumber, parameters.PageSize);

            var response = new PagedResponse<OrderDto>
            {
                Items = orders.Select(MapToDto),
                PageNumber = parameters.PageNumber,
                PageSize = parameters.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)parameters.PageSize)
            };

            return response;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            _logger.LogInformation("Creating new order");
            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderDate = DateTime.UtcNow,
                CustomerName = createOrderDto.CustomerName,
                CustomerEmail = createOrderDto.CustomerEmail,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;
            foreach (var item in createOrderDto.OrderItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    _logger.LogWarning("Product with ID {productId} not found", item.ProductId);
                    throw new NotFoundException($"Product with ID {item.ProductId} not found");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    _logger.LogWarning("Insufficient stock for product {productId}. Available: {available}, Requested: {requested}", 
                        item.ProductId, product.StockQuantity, item.Quantity);
                    throw new ValidationException($"Insufficient stock for product {product.Name}. Available: {product.StockQuantity}, Requested: {item.Quantity}");
                }

                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    TotalPrice = product.Price * item.Quantity
                };

                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.TotalPrice;

                // Update product stock
                product.StockQuantity -= item.Quantity;
                await _productRepository.UpdateAsync(product);
            }

            order.TotalAmount = totalAmount;

            var validationResult = await _validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                _logger.LogWarning("Validation failed for order: {errors}", errors);
                throw new ValidationException(validationResult.Errors);
            }

            var createdOrder = await _repository.CreateAsync(order);
            var orderDto = MapToDto(createdOrder);
            
            // Notify clients about the new order
            await _notificationService.NotifyOrderCreated(orderDto);
            
            return orderDto;
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusDto updateOrderStatusDto)
        {
            _logger.LogInformation("Updating order status for ID: {id}", id);
            var order = await _repository.GetByIdAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order with ID {id} not found", id);
                throw new NotFoundException($"Order with ID {id} not found");
            }

            var oldStatus = order.Status;
            order.Status = updateOrderStatusDto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            var validationResult = await _validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                _logger.LogWarning("Validation failed for order: {errors}", errors);
                throw new ValidationException(validationResult.Errors);
            }

            var updatedOrder = await _repository.UpdateAsync(order);
            var orderDto = MapToDto(updatedOrder);
            
            // Notify clients about the status update
            await _notificationService.NotifyOrderStatusUpdated(orderDto);
            
            return orderDto;
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(OrderStatus status)
        {
            _logger.LogInformation("Getting orders by status: {status}", status);
            var orders = await _repository.GetByStatusAsync(status);
            return orders.Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByCustomerEmailAsync(string customerEmail)
        {
            _logger.LogInformation("Getting orders by customer email: {email}", customerEmail);
            var orders = await _repository.GetByCustomerEmailAsync(customerEmail);
            return orders.Select(MapToDto);
        }

        private static OrderDto MapToDto(Order order)
        {
            if (order == null)
                return null;

            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };
        }
    }
} 