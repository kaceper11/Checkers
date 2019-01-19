#include "Board.h"

using namespace std;


void Board::print(int mode){

    if(mode==0){
        cout<<endl<<"Red table: "<<endl;
        for(int i=0; i<Pawn_vec_R.size(); i++){
            Pawn_vec_R[i]->print();
            cout<<endl;}

        cout<<endl<<"White table: "<<endl;
        for(int i=0; i<Pawn_vec_W.size(); i++){
            Pawn_vec_W[i]->print();
            cout<<endl;}
    }
    else if(mode==1){
        cout<<endl<<"Board: "<<endl;
        for(int i=0; i<8; i++){
            for(int j=0; j<8; j++){
            cout<<ch_board[i][j]<<" ";}
        cout<<endl;}
    }

}

int Board::score_check(){
    int score = 0;
    for(int i=0; i<Pawn_vec_R.size(); i++){
        if(Pawn_vec_R[i]->get_type())
            score = score+2;
        else
            score = score+1;
    }


    for(int i=0; i<Pawn_vec_W.size(); i++){
        if(Pawn_vec_W[i]->get_type())
            score = score-2;
        else
            score = score-1;
    }
    return score;
}

void Board::clash_R_Pawn(int pos_row_, int pos_col_){
    for(int i=0; i<Pawn_vec_R.size(); i++){
        if(Pawn_vec_R[i]->get_pos_row()==pos_row_ && Pawn_vec_R[i]->get_pos_col()==pos_col_){
            Pawn_vec_R.erase(Pawn_vec_R.begin() + i);
            ch_board[pos_row_][pos_col_]='0';
            break;
        }
    }
}


void Board::clash_W_Pawn(int pos_row_, int pos_col_){
    for(int i=0; i<Pawn_vec_W.size(); i++){
        if(Pawn_vec_W[i]->get_pos_row()==pos_row_ && Pawn_vec_W[i]->get_pos_col()==pos_col_){
            Pawn_vec_W.erase(Pawn_vec_W.begin() + i);
            ch_board[pos_row_][pos_col_]='0';
            break;
        }
    }
}


void Board::add_R_Pawn(int pos_row_, int pos_col_, int id_, bool type_){
    Pawn_vec_R.push_back(new Pawn(pos_row_, pos_col_, id_, type_));
    ch_board[pos_row_][pos_col_]='R';
}

void Board::add_W_Pawn(int pos_row_, int pos_col_, int id_, bool type_){
    Pawn_vec_W.push_back(new Pawn(pos_row_, pos_col_, id_, type_));
    ch_board[pos_row_][pos_col_]='W';
}


/*void Board::add_R_Pawn(const Pawn& c_Pawn){
    Pawn_vec_R.push_back(new Pawn(c_Pawn));
}

void Board::add_W_Pawn(const Pawn& c_Pawn){
    Pawn_vec_W.push_back(new Pawn(c_Pawn));
}*/

void Board::change_R_Pawn_pos(int nr_, int pos_row_, int pos_col_){
    ch_board[Pawn_vec_R[nr_]->get_pos_row()][Pawn_vec_R[nr_]->get_pos_col()]='0';
    Pawn_vec_R[nr_]->change_Pawn_pos(pos_row_, pos_col_);
    ch_board[pos_row_][pos_col_]='R';
}

void Board::change_W_Pawn_pos(int nr_, int pos_row_, int pos_col_){
    ch_board[Pawn_vec_W[nr_]->get_pos_row()][Pawn_vec_W[nr_]->get_pos_col()]='0';
    Pawn_vec_W[nr_]->change_Pawn_pos(pos_row_, pos_col_);
    ch_board[pos_row_][pos_col_]='W';
}

void Board::change_R_Pawn_pos_id(int id_, int pos_row_, int pos_col_){
    //cout<<Pawn_vec_R.size()<<endl;
    for(int i=0; i<Pawn_vec_R.size(); i++){
        //cout<<"\t"<<i<<endl;
        if(Pawn_vec_R[i]->get_id()==id_){
            ch_board[Pawn_vec_R[i]->get_pos_row()][Pawn_vec_R[i]->get_pos_col()]='0';
            Pawn_vec_R[i]->change_Pawn_pos(pos_row_, pos_col_);
            ch_board[pos_row_][pos_col_]='R';
            break;
        }
    }
}

void Board::change_W_Pawn_pos_id(int id_, int pos_row_, int pos_col_){
    for(int i=0; i<Pawn_vec_W.size(); i++){
        if(Pawn_vec_W[i]->get_id()==id_){
            ch_board[Pawn_vec_W[i]->get_pos_row()][Pawn_vec_W[i]->get_pos_col()]='0';
            Pawn_vec_W[i]->change_Pawn_pos(pos_row_, pos_col_);
            ch_board[pos_row_][pos_col_]='W';
            break;
        }
    }
}

vector<Pawn*> Board::get_Pawn_vec_R(){return Pawn_vec_R;}

vector<Pawn*> Board::get_Pawn_vec_W(){return Pawn_vec_W;}

char Board::get_ch_board_el(int pos_row_, int pos_col_){return ch_board[pos_row_][pos_col_];}

void Board::rebuild_ch_board(){
    for(int i=0; i<8; i++){
            for(int j=0; j<8; j++){
                if((i+j)%2==0)
                    ch_board[i][j]='0';
                else
                    ch_board[i][j]='-';
            }
    }

    for(int i=0; i<Pawn_vec_R.size(); i++){
        ch_board[Pawn_vec_R[i]->get_pos_row()][Pawn_vec_R[i]->get_pos_col()]='R';
    }

    for(int i=0; i<Pawn_vec_W.size(); i++){
        ch_board[Pawn_vec_W[i]->get_pos_row()][Pawn_vec_W[i]->get_pos_col()]='W';
    }
}


Board::Board(){
    for(int i=0; i<8; i++){
            for(int j=0; j<8; j++){
                if((i+j)%2==0)
                    ch_board[i][j]='0';
                else
                    ch_board[i][j]='-';
            }
    }
}

Board::Board(const Board& c_Board){

    vector<Pawn*> R_vec_buf = c_Board.get_Pawn_vec_R();
    for(int i=0; i<R_vec_buf.size(); i++){
        Pawn_vec_R.push_back(new Pawn(*R_vec_buf[i]));
    }

    vector<Pawn*> W_vec_buf = c_Board.get_Pawn_vec_W();
    for(int i=0; i<W_vec_buf.size(); i++){
        Pawn_vec_W.push_back(new Pawn(*W_vec_buf[i]));
    }

    rebuild_ch_board();
}


Board::~Board(){
    for(int i=0; i<Pawn_vec_R.size(); i++){
        delete (Pawn_vec_R[i]);
    }

    for(int i=0; i<Pawn_vec_W.size(); i++){
        delete (Pawn_vec_W[i]);
    }

}

