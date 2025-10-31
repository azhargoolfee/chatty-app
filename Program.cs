using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ChattyApp.Data;
using ChattyApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var usePostgreSQL = !string.IsNullOrWhiteSpace(databaseUrl) && databaseUrl.StartsWith("postgresql://");

string connectionString;
if (usePostgreSQL)
{
    try
    {
        var uri = new Uri(databaseUrl!);
        connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.Trim('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};";
    }
    catch (Exception)
    {
        usePostgreSQL = false;
        connectionString = "Data Source=app.db";
    }
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=app.db";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (usePostgreSQL)
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

var frontendPath = Path.Combine(builder.Environment.ContentRootPath, "Frontend");
if (Directory.Exists(frontendPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        DefaultFileNames = new List<string> { "index.html" },
        FileProvider = new PhysicalFileProvider(frontendPath)
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(frontendPath),
        RequestPath = ""
    });
}
else
{
    app.UseStaticFiles();
}

app.UseRouting();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<ChatHub>("/chatHub");

try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        int maxRetries = usePostgreSQL ? 5 : 1;
        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                context.Database.EnsureCreated();
                app.Logger.LogInformation("Database initialized successfully using {DatabaseProvider} on attempt {Attempt}", 
                    usePostgreSQL ? "PostgreSQL" : "SQLite", attempt);
                break;
            }
            catch (Exception ex) when (usePostgreSQL && attempt < maxRetries)
            {
                app.Logger.LogWarning("Database connection attempt {Attempt} failed: {Error}. Retrying in 2 seconds...", 
                    attempt, ex.Message);
                await Task.Delay(2000);
            }
        }
    }
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Failed to initialize database after all retries. Using {DatabaseProvider} with connection: {ConnectionInfo}", 
        usePostgreSQL ? "PostgreSQL" : "SQLite", 
        usePostgreSQL ? "DATABASE_URL environment variable" : connectionString);
    
    if (usePostgreSQL)
    {
        app.Logger.LogWarning("PostgreSQL connection failed, but app will continue. Database features may be limited.");
    }
    else
    {
        throw;
    }
}

app.Run();
