using Microsoft.EntityFrameworkCore;
using jordanemedlock.Models;
namespace jordanemedlock.DbContexts {
    public class GameContext : DbContext {
        public DbSet<Player> Players { get; set; }
        public DbSet<ChessGame> Games { get; set; }
        public DbSet<ChessBoard> Boards { get; set; }

        public GameContext(DbContextOptions<GameContext> options) : base(options) {

        }

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.Entity<ChessBoard>()
                .HasOne(b => b.Game)
                .WithOne(g => g.Board)
                .HasForeignKey<ChessGame>(b => b.BoardID);

            

            // builder.Entity<ChessGame>()
            //     .HasMany(g => g.Players)
            //     .WithOne(p => p.Game)
            //     .HasForeignKey<Player>(p => p.GameID);
        }

        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        //     optionsBuilder.UseSqlServer(@"Data Source=localhost;Initial Catalog=ChessDB;");
        // }
    }

    public static class GameContextInitializer {
        public static void Initialize(GameContext context) {
            context.Database.EnsureCreated();

            // put some test data here
        }
    }
}