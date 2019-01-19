#include <iostream>


using namespace std;

class Pawn
{
    private:
    int pos_row, pos_col, id;
	bool type;

    public:
    Pawn();
	Pawn(const Pawn &c_Pawn);
    Pawn(int pos_row_, int pos_col_, int id_, bool type_);
    void change_Pawn_pos(int pos_row_, int pos_col_);
    int get_pos_row();
    int get_pos_col();
    int get_id();
    bool get_type();
    void print();
    ~Pawn() {};
};

