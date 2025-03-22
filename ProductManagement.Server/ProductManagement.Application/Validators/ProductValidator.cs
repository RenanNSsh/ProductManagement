using FluentValidation;
using ProductManagement.Domain.Entities;

namespace ProductManagement.Application.Validators
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required")
                .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters")
                .Matches("^[a-zA-Z0-9\\s-]+$").WithMessage("Product name can only contain letters, numbers, spaces, and hyphens");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative")
                .LessThanOrEqualTo(1000000).WithMessage("Price cannot exceed 1,000,000");

            RuleFor(x => x.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative")
                .LessThanOrEqualTo(10000).WithMessage("Stock quantity cannot exceed 10,000");

        }
    }
} 