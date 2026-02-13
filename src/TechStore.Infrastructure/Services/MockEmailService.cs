using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using TechStore.Core.Interfaces.Services;

namespace TechStore.Infrastructure.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogInformation($"[MockEmailService] Sending email to {to}");
            _logger.LogInformation($"Subject: {subject}");
            // _logger.LogInformation($"Body: {body}"); // Body might be too long
            return Task.CompletedTask;
        }
    }
}
