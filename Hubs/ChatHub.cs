using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ChattyApp.Data;
using ChattyApp.Models;

namespace ChattyApp.Hubs;

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public ChatHub(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task SendMessage(string content)
    {
        if (Context.User?.Identity?.IsAuthenticated == true)
        {
            var user = await _userManager.GetUserAsync(Context.User);
            if (user != null)
            {
                var message = new Message
                {
                    Content = content,
                    UserId = user.Id,
                    UserName = user.UserName ?? "Unknown",
                    Timestamp = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // Send message to all connected clients
                await Clients.All.SendAsync("ReceiveMessage", message.UserName, message.Content, message.Timestamp.ToString("HH:mm"));
            }
        }
    }

    public async Task<List<Message>> GetRecentMessages(int count = 50)
    {
        return await _context.Messages
            .OrderByDescending(m => m.Timestamp)
            .Take(count)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();
    }
}