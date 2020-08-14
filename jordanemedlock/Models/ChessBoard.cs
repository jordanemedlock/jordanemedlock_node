using System.ComponentModel.DataAnnotations;

namespace jordanemedlock.Models {
    public class ChessBoard {
        [Key]
        public int BoardID { get; set; }
        public int BoardWidth { get; set; }
        public string BoardString { get; set; }


        public ChessGame Game { get; set; }
    }
}