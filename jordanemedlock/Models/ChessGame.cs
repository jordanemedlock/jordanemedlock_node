

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace jordanemedlock.Models {
    public class ChessGame {
        [Key]
        public int GameID { get; set; }
        public string GameCode { get; set; }


        public List<Player> Players { get; set; }

        public int BoardID { get; set; }
        public ChessBoard Board { get; set; }

    }
}