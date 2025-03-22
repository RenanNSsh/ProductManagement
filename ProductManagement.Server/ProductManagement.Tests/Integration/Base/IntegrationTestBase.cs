using Microsoft.EntityFrameworkCore;
using ProductManagement.Persistence.DatabaseContext;

namespace ProductManagement.Tests.Integration.Base
{
    public abstract class IntegrationTestBase : IDisposable
    {
        protected readonly DbContextOptions<ApplicationDbContext> Options;
        protected readonly ApplicationDbContext Context;

        protected IntegrationTestBase()
        {
            Options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            Context = new ApplicationDbContext(Options);
        }

        public virtual void Dispose()
        {
            Context.Database.EnsureDeleted();
            Context.Dispose();
        }
    }
} 