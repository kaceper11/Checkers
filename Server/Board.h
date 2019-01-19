#include <iostream>
#include <vector>
#include "Pawn.h"

using namespace std;

class Board
{
    private:
    vector<Pawn*> Pawn_vec_R;
	vector<Pawn*> Pawn_vec_W;
	char ch_board[8][8];
	public:
    void print(int mode);
	void rebuild_ch_board();
	int score_check();
	void clash_R_Pawn(int pos_row_, int pos_col_);
	void clash_W_Pawn(int pos_row_, int pos_col_);

    void add_R_Pawn(int pos_row_, int pos_col_, int id_, bool type_);
	void add_W_Pawn(int pos_row_, int pos_col_, int id_, bool type_);
	void add_R_Pawn(const Pawn& c_Pawn);
	void add_W_Pawn(const Pawn& c_Pawn);

	void change_R_Pawn_pos(int nr_, int pos_row_, int pos_col_);
	void change_W_Pawn_pos(int nr_, int pos_row_, int pos_col_);
	void change_R_Pawn_pos_id(int id_, int pos_row_, int pos_col_);
	void change_W_Pawn_pos_id(int id_, int pos_row_, int pos_col_);

	string conv_Board_to_s();
	string conv_Pawn_vec_R_to_s();
	string conv_Pawn_vec_W_to_s();

	vector<Pawn*> get_Pawn_vec_R();
	vector<Pawn*> get_Pawn_vec_W();
	char get_ch_board_el(int pos_row_, int pos_col_);

    Board();
	Board(const Board& c_Board);
    ~Board();
};

