using Microsoft.EntityFrameworkCore.Storage;
using TechStore.Core.Interfaces.Repositories;
using TechStore.Infrastructure.Data;

namespace TechStore.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public IProductRepository Products { get; }
    public ICategoryRepository Categories { get; }
    public IOrderRepository Orders { get; }
   public IUserRepository Users { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IOrderRepository orderRepository,
        IUserRepository userRepository)
    {
        _context = context;
        Products = productRepository;
        Categories = categoryRepository;
        Orders = orderRepository;
        Users = userRepository;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        return new Repository<T>(_context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
