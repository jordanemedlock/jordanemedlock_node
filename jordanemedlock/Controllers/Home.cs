

using jordanemedlock.DbContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jordanemedlock.Controllers {
    public class Home : ControllerBase {
        
        private GameContext GameContext { get; set; }
        public Home(GameContext gameContext) {
            GameContext = gameContext;
        }

        [HttpGet]
        public string InitDatabase() {

            GameContext.Database.Migrate();

            return "Built database";
        }
    }
}