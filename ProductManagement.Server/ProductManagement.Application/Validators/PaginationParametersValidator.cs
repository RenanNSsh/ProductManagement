using FluentValidation;
using ProductManagement.Application.Common.Models;

namespace ProductManagement.Application.Validators
{
    public class PaginationParametersValidator : AbstractValidator<PaginationParameters>
    {
        public PaginationParametersValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100)
                .WithMessage("Page size cannot exceed 100 items");
        }
    }
} 