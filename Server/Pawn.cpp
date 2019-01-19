#include "Pawn.h"

using namespace std;

Pawn::Pawn(){}

Pawn::Pawn(const Pawn &c_Pawn){
    pos_row = c_Pawn.get_pos_row();
    pos_col = c_Pawn.get_pos_col();
    id = c_Pawn.get_id();
	type = c_Pawn.get_type();
}

Pawn::Pawn(int pos_row_, int pos_col_, int id_, bool type_){
    pos_row = pos_row_;
    pos_col = pos_col_;
    id = id_;
	type = type_;
}

void Pawn::change_Pawn_pos(int pos_row_, int pos_col_){
    pos_row = pos_row_;
    pos_col = pos_col_;
    if(pos_row_==7)
        type=1;
}


int Pawn::get_pos_row(){return pos_row;}

int Pawn::get_pos_col(){return pos_col;}

int Pawn::get_id(){//cout<<"\t\t"<<id<<endl;
return id;}

bool Pawn::get_type(){return type;}


void Pawn::print(){
    cout<<" Pos row: "<<pos_row<<" Pos col: "<<pos_col<<" Id: "<<id<<" Type: "<<type;
}

