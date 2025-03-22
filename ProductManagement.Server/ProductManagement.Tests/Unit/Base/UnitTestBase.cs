using Moq;
using Microsoft.Extensions.Logging;

namespace ProductManagement.Tests.Unit.Base
{
    public abstract class UnitTestBase
    {
        protected Mock<ILogger<T>> CreateLoggerMock<T>() where T : class
        {
            return new Mock<ILogger<T>>();
        }
    }
} 