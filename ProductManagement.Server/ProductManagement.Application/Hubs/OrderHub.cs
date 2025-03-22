using Microsoft.AspNetCore.SignalR;
using ProductManagement.Application.DTOs;
using ProductManagement.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ProductManagement.Application.Hubs
{
    public class OrderHub : Hub
    {
        private readonly ILogger<OrderHub> _logger;

        public OrderHub(ILogger<OrderHub> logger)
        {
            _logger = logger;
        }

        public async override Task OnConnectedAsync()
        {
            _logger.LogDebug("SignalR Hub - Client connected with ID: {ConnectionId}", Context.ConnectionId);
            await base.OnConnectedAsync();
            _logger.LogDebug("SignalR Hub - OnConnectedAsync completed for {ConnectionId}", Context.ConnectionId);
        }

        public async override  Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogDebug("SignalR Hub - Client disconnected: {ConnectionId}", Context.ConnectionId);
            if (exception != null)
            {
                _logger.LogError("SignalR Hub - Client disconnected with error: {Error}", exception.Message);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinOrderGroup(string groupName)
        {
            _logger.LogDebug("SignalR Hub - Client {ConnectionId} attempting to join group: {GroupName}", Context.ConnectionId, groupName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserJoined", Context.ConnectionId);
            _logger.LogDebug("SignalR Hub - Client {ConnectionId} successfully joined group: {GroupName}", Context.ConnectionId, groupName);
        }

        public async Task LeaveOrderGroup(string groupName)
        {
            _logger.LogDebug("SignalR Hub - Client {ConnectionId} leaving group: {GroupName}", Context.ConnectionId, groupName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserLeft", Context.ConnectionId);
        }

        public async Task JoinOrderStatusGroup(OrderStatus status)
        {
            var groupName = $"OrderStatus_{status}";
            _logger.LogDebug("SignalR Hub - Client {ConnectionId} joining status group: {GroupName}", Context.ConnectionId, groupName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserJoinedStatus", Context.ConnectionId, status);
        }

        public async Task LeaveOrderStatusGroup(OrderStatus status)
        {
            var groupName = $"OrderStatus_{status}";
            _logger.LogDebug("SignalR Hub - Client {ConnectionId} leaving status group: {GroupName}", Context.ConnectionId, groupName);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserLeftStatus", Context.ConnectionId, status);
        }

        // Add a test method to verify hub is working
        public async Task Echo(string message)
        {
            _logger.LogDebug("SignalR Hub - Received Echo message: {Message} from {ConnectionId}", message, Context.ConnectionId);
            await Clients.Caller.SendAsync("EchoResponse", $"Server received: {message}");
        }
    }
} 