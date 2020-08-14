

namespace jordanemedlock.Models {
    public class Player {
        public int PlayerID { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public Direction Direction { get; set; }

        public int GameID { get; set; }
        public ChessGame Game { get; set; }
        
    }
}