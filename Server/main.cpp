// Przykłądowy server w C++, faktyczny serwer będzie wyglądał trochę innaczej
//
#include <iostream>
#include <fstream>
#include <sstream>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <algorithm>
#include "Board.h"

int tie_breaker[8][8]={{4,4,4,4,4,4,4,4},{4,3,3,3,3,3,3,4},{4,3,2,2,2,2,3,4},{4,3,2,1,1,2,3,4},{4,3,2,1,1,2,3,4},{4,3,2,2,2,2,3,4},{4,3,3,3,3,3,3,4},{4,4,4,4,4,4,4,4}};

int *Red_Move_max(Board *Board_, Pawn *Pawn_, int move_forward);
int *White_Move_min(Board *Board_, Pawn *Pawn_, int move_forward);


//Generuje planszę z wiadomości
Board *Generete_Board_from_msg(string msg){
    //cout<<msg.size()<<endl;
    msg.erase( remove( msg.begin(), msg.end(), '[' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), ']' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), '{' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), '}' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), '"' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), ' ' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), '\t' ), msg.end() );
    msg.erase( remove( msg.begin(), msg.end(), '\n' ), msg.end() );
    //cout<<msg<<endl;

    int pos_row, pos_col, id_r=1, id_w=1;
	bool color, type;
	Board *receve_board = new Board();

    stringstream ss(msg);
    string token1;
    int i=0;
    while(getline(ss, token1, ',')) {
        stringstream ss2(token1);
        //cout<<endl<<"Size: "<<token1.size()<<" -> "<<token1<<endl<<" // "<<endl;
        string token2;
        while(getline(ss2, token2, ':')) {
            //token2.erase( remove( token2.begin(), token2.end(), '\n' ), token2.end() );
            //cout<<i<<" || ";
            switch( i )
            {
            case 4: //isRed
                //cout<<" -> ";
                if(token2=="true"){
                    color=1;
                }
                else{
                    color=0;
                }
                break;

            case 6: //jump
                //cout<<" -> ";
                if(token2=="true"){
                    type=1;
                }
                else{
                    type=0;
                }
                break;

            case 8: //row
                //cout<<" -> ";
                pos_row = stoi(token2);
                break;

            case 10: //col
                //cout<<" -> ";
                pos_col = stoi(token2);
                break;

            default:

                break;
            }
            //cout<<token2<<endl;
            i++;

            if(i==11){
                i=0;
                if(color){
                    //cout<<"Dodaję -> Pos row: "<<pos_row<<" Pos col: "<<pos_col<<" Id: "<<id_r<<" Type: "<<type<<" Color: "<<color<<endl;
                    receve_board->add_R_Pawn(pos_row, pos_col, id_r, type);
                    id_r++;
                }
                else{
                    //cout<<"Dodaję -> Pos row: "<<pos_row<<" Pos col: "<<pos_col<<" Id: "<<id_w<<" Type: "<<type<<" Color: "<<color<<endl;
                    receve_board->add_W_Pawn(pos_row, pos_col, id_w, type);
                    id_w++;
                }
            }
        }
    }
    return receve_board;
}

//Generuje wiadomość do wysłania z planszy po wykonanym ruchu
string Generete_msg_from_Board(Board *Board_){
    string msg;
    msg="[\n";

    vector<Pawn*> R_vec_buf = Board_->get_Pawn_vec_R();
    for(int i=0; i<R_vec_buf.size(); i++){
        msg+="  {\n";
        msg+="    \"piece\": {\n";
        msg+="      \"type\": \"pawn\",\n";
        msg+="      \"isRed\": true,\n";
        msg+="      \"jump\": ";
        if(R_vec_buf[i]->get_type()){
            msg+="true,\n";
        }
        else{
            msg+="false,\n";
        }
        msg+="      \"row\": ";
        msg+=to_string(R_vec_buf[i]->get_pos_row());
        msg+=",\n";
        msg+="      \"col\": ";
        msg+=to_string(R_vec_buf[i]->get_pos_col());
        msg+="\n";
        msg+="    },\n";
        msg+="  },\n";
    }

    vector<Pawn*> W_vec_buf = Board_->get_Pawn_vec_W();
    for(int i=0; i<W_vec_buf.size(); i++){
        msg+="  {\n";
        msg+="    \"piece\": {\n";
        msg+="      \"type\": \"pawn\",\n";
        msg+="      \"isRed\": true,\n";
        msg+="      \"jump\": ";
        if(W_vec_buf[i]->get_type()){
            msg+="true,\n";
        }
        else{
            msg+="false,\n";
        }
        msg+="      \"row\": ";
        msg+=to_string(W_vec_buf[i]->get_pos_row());
        msg+=",\n";
        msg+="      \"col\": ";
        msg+=to_string(W_vec_buf[i]->get_pos_col());
        msg+="\n";
        msg+="    },\n";
        msg+="  },\n";
    }
    msg+="]\n";
    return msg;
}

//Główna funkcja zaczynająca generację ruchu
Board *Generete_Red_Move(Board *Board_, int move_forward){

    Board *Board_final = new Board(*Board_);
    int final_buf[4];
    final_buf[0]=-100;  //score
    final_buf[1]=0;     //row
    final_buf[2]=0;     //col
    final_buf[3]=0;     //pawn nr


    if(move_forward==0){
        final_buf[0] = Board_->score_check();
    }
    else{
        move_forward = move_forward-1;
        vector<Pawn*> R_vec_buf = Board_->get_Pawn_vec_R();
        for(int i=0; i<R_vec_buf.size(); i++){
            int *buf=Red_Move_max( new Board(*Board_), new Pawn(*R_vec_buf[i]), move_forward );
            if(buf[0]>final_buf[0]){
                final_buf[0]=buf[0];
                final_buf[1]=buf[1];
                final_buf[2]=buf[2];
                final_buf[3]=i;
            }
            else if(buf[0]==final_buf[0]){
                int score_tie_new=buf[0]+tie_breaker[buf[1]][buf[2]];
                int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
                if(score_tie_new>score_tie_prev){
                    final_buf[0]=buf[0];
                    final_buf[1]=buf[1];
                    final_buf[2]=buf[2];
                    final_buf[3]=i;
                }
            }
        }
        int old_row=(R_vec_buf[final_buf[3]])->get_pos_row(), old_col=(R_vec_buf[final_buf[3]])->get_pos_col();
        cout<<"Komputer z ("<<old_row<<","<<old_col<<") do ("<<final_buf[1]<<","<<final_buf[2]<<")"<<endl;
        //cout<<endl<<"Komputer z ("<<old_row<<","<<old_col<<") do ("<<final_buf[1]<<","<<final_buf[2]<<")  score: "<<final_buf[0]<<"  number: "<<final_buf[3]<<endl;
        if(final_buf[1]==-1 || final_buf[2]==-1){
            return new Board();
        }
        else{

            if(abs(old_row-final_buf[1])==2){
                //cout<<"weszło "<<old_row-final_buf[1]<<" "<<final_buf[1]-(final_buf[1]-old_row)/2<<" "<<final_buf[2]-(final_buf[2]-old_col)/2;
                Board_final->clash_W_Pawn(final_buf[1]-(final_buf[1]-old_row)/2, final_buf[2]-(final_buf[2]-old_col)/2);
            }
            Board_final->change_R_Pawn_pos(final_buf[3], final_buf[1], final_buf[2]);

        }

    }
    return Board_final;
}

//Funkcja wybierająca pionek komputera
int Red_Move(Board *Board_, int move_forward){
    int final_buf[3];
    final_buf[0]=-100;  //score
    final_buf[1]=0;     //row
    final_buf[2]=0;     //col


    if(move_forward==0){
        final_buf[0] = Board_->score_check();
    }
    else{
        move_forward = move_forward-1;
        vector<Pawn*> R_vec_buf = Board_->get_Pawn_vec_R();
        for(int i=0; i<R_vec_buf.size(); i++){
            int *buf=Red_Move_max( new Board(*Board_), new Pawn(*R_vec_buf[i]), move_forward );
            if(buf[0]>final_buf[0]){
                final_buf[0]=buf[0];
                final_buf[1]=buf[1];
                final_buf[2]=buf[2];
            }
            else if(buf[0]==final_buf[0]){
                int score_tie_new=buf[0]+tie_breaker[buf[1]][buf[2]];
                int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
                if(score_tie_new>score_tie_prev){
                    final_buf[0]=buf[0];
                    final_buf[1]=buf[1];
                    final_buf[2]=buf[2];
                }
            }
        }
    }

    return final_buf[0];
}

//Funkcja wybierająca pionek gracza
int White_Move(Board *Board_, int move_forward){
    int final_buf[3];
    final_buf[0]=100;  //score
    final_buf[1]=0;     //row
    final_buf[2]=0;     //col


    if(move_forward==0){
        final_buf[0] = Board_->score_check();
    }
    else{
        move_forward = move_forward-1;
        vector<Pawn*> W_vec_buf = Board_->get_Pawn_vec_W();
        for(int i=0; i<W_vec_buf.size(); i++){
            int *buf=White_Move_min( new Board(*Board_), new Pawn(*W_vec_buf[i]), move_forward );
            if(buf[0]<final_buf[0]){
                final_buf[0]=buf[0];
                final_buf[1]=buf[1];
                final_buf[2]=buf[2];
            }
            else if(buf[0]==final_buf[0]){
                int score_tie_new=buf[0]+tie_breaker[buf[1]][buf[2]];
                int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
                if(score_tie_new>score_tie_prev){
                    final_buf[0]=buf[0];
                    final_buf[1]=buf[1];
                    final_buf[2]=buf[2];
                }
            }
        }

    }

    return final_buf[0];
}

//Funkcja szukająca optymalnego ruchu dla pionka komutera
int *Red_Move_max(Board *Board_, Pawn *Pawn_, int move_forward){
    int *final_buf=new int[3];
    final_buf[0] = -100;  //score
    final_buf[1] = -1;     //row
    final_buf[2] = -1;     //col

    int pos_row = Pawn_->get_pos_row();
    int pos_col = Pawn_->get_pos_col();


    //up-left
    if(pos_row!=0 && pos_col!=0){
        int score = -100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row-1, pos_col-1)=='0'){
            pos_row_new = pos_row-1;
            pos_col_new = pos_col-1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row-1, pos_col-1)=='W' && pos_row-1!=0 && pos_col-1!=0 && Board_->get_ch_board_el(pos_row-2, pos_col-2)=='0'){
            pos_row_new = pos_row-2;
            pos_col_new = pos_col-2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_W_Pawn(pos_row-1, pos_col-1);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score>final_buf[0] && score != -100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != -100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //up-right
    if(pos_row!=0 && pos_col!=7){
        int score = -100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row-1, pos_col+1)=='0'){
            pos_row_new = pos_row-1;
            pos_col_new = pos_col+1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row-1, pos_col+1)=='W' && pos_row-1!=0 && pos_col+1!=0 && Board_->get_ch_board_el(pos_row-2, pos_col+2)=='0'){
            pos_row_new = pos_row-2;
            pos_col_new = pos_col+2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_W_Pawn(pos_row-1, pos_col+1);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score>final_buf[0] && score != -100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != -100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //down-left
    if(pos_row!=7 && pos_col!=0){
        int score = -100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row+1, pos_col-1)=='0'){
            pos_row_new = pos_row+1;
            pos_col_new = pos_col-1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row+1, pos_col-1)=='W' && pos_row+1!=0 && pos_col-1!=0 && Board_->get_ch_board_el(pos_row+2, pos_col-2)=='0'){
            pos_row_new = pos_row+2;
            pos_col_new = pos_col-2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_W_Pawn(pos_row+1, pos_col-1);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score>final_buf[0] && score != -100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != -100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //down-right
    if(pos_row!=7 && pos_col!=7){
        int score = -100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row+1, pos_col+1)=='0'){
            pos_row_new = pos_row+1;
            pos_col_new = pos_col+1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row+1, pos_col+1)=='W' && pos_row+1!=0 && pos_col+1!=0 && Board_->get_ch_board_el(pos_row+2, pos_col+2)=='0'){
            pos_row_new = pos_row+2;
            pos_col_new = pos_col+2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_W_Pawn(pos_row+1, pos_col+1);
            Board_buf->change_R_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = White_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score>final_buf[0] && score != -100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != -100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }

    return final_buf;
}

//Funkcja szukająca optymalnego ruchu dla pionka gracza
int *White_Move_min(Board *Board_, Pawn *Pawn_, int move_forward){
    int *final_buf=new int[3];
    final_buf[0] = 100;  //score
    final_buf[1] = -1;     //row
    final_buf[2] = -1;     //col

    int pos_row = Pawn_->get_pos_row();
    int pos_col = Pawn_->get_pos_col();


    //up-left
    if(pos_row!=0 && pos_col!=0){
        int score = 100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row-1, pos_col-1)=='0'){
            pos_row_new = pos_row-1;
            pos_col_new = pos_col-1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row-1, pos_col-1)=='R' && pos_row-1!=0 && pos_col-1!=0 && Board_->get_ch_board_el(pos_row-2, pos_col-2)=='0'){
            pos_row_new = pos_row-2;
            pos_col_new = pos_col-2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_R_Pawn(pos_row-1, pos_col-1);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score<final_buf[0] && score != 100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != 100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //up-right
    if(pos_row!=0 && pos_col!=7){
        int score = 100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row-1, pos_col+1)=='0'){
            pos_row_new = pos_row-1;
            pos_col_new = pos_col+1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row-1, pos_col+1)=='R' && pos_row-1!=0 && pos_col+1!=0 && Board_->get_ch_board_el(pos_row-2, pos_col+2)=='0'){
            pos_row_new = pos_row-2;
            pos_col_new = pos_col+2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_R_Pawn(pos_row-1, pos_col+1);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score<final_buf[0] && score != 100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != 100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //down-left
    if(pos_row!=7 && pos_col!=0){
        int score = 100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row+1, pos_col-1)=='0'){
            pos_row_new = pos_row+1;
            pos_col_new = pos_col-1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row+1, pos_col-1)=='R' && pos_row+1!=0 && pos_col-1!=0 && Board_->get_ch_board_el(pos_row+2, pos_col-2)=='0'){
            pos_row_new = pos_row+2;
            pos_col_new = pos_col-2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_R_Pawn(pos_row+1, pos_col-1);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score<final_buf[0] && score != 100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != 100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }


    //down-right
    if(pos_row!=7 && pos_col!=7){
        int score = 100, pos_row_new=0, pos_col_new=0;
        if(Board_->get_ch_board_el(pos_row+1, pos_col+1)=='0'){
            pos_row_new = pos_row+1;
            pos_col_new = pos_col+1;
            Board *Board_buf = new Board(*Board_);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }
        else if(Board_->get_ch_board_el(pos_row+1, pos_col+1)=='R' && pos_row+1!=0 && pos_col+1!=0 && Board_->get_ch_board_el(pos_row+2, pos_col+2)=='0'){
            pos_row_new = pos_row+2;
            pos_col_new = pos_col+2;
            Board *Board_buf = new Board(*Board_);
            Board_buf->clash_R_Pawn(pos_row+1, pos_col+1);
            Board_buf->change_W_Pawn_pos_id(Pawn_->get_id(), pos_row_new, pos_col_new);
            score = Red_Move(Board_buf, move_forward);
            delete Board_buf;
        }

        if(score<final_buf[0] && score != 100){
            final_buf[0]=score;
            final_buf[1]=pos_row_new;
            final_buf[2]=pos_col_new;
        }
        else if(score==final_buf[0] && score != 100){
            int score_tie_new=score+tie_breaker[pos_row_new][pos_col_new];
            int score_tie_prev=final_buf[0]+tie_breaker[final_buf[1]][final_buf[2]];
            if(score_tie_new>score_tie_prev){
                final_buf[0]=score;
                final_buf[1]=pos_row_new;
                final_buf[2]=pos_col_new;
            }
        }
    }

    return final_buf;
}

Board *Generete_test_Board(){
    Board *test_board = new Board();

    test_board->add_R_Pawn(0, 0, 1, 0);
    test_board->add_R_Pawn(0, 2, 2, 0);
    test_board->add_R_Pawn(0, 4, 3, 0);
    test_board->add_R_Pawn(0, 6, 4, 0);
    test_board->add_R_Pawn(1, 1, 5, 0);
    test_board->add_R_Pawn(1, 3, 6, 0);
    test_board->add_R_Pawn(1, 5, 7, 0);
    test_board->add_R_Pawn(1, 7, 8, 0);
    test_board->add_R_Pawn(2, 0, 9, 0);
    test_board->add_R_Pawn(2, 2, 10, 0);
    test_board->add_R_Pawn(2, 4, 11, 0);
    test_board->add_R_Pawn(2, 6, 12, 0);


    test_board->add_W_Pawn(5, 1, 1, 0);
    test_board->add_W_Pawn(5, 3, 2, 0);
    test_board->add_W_Pawn(5, 5, 3, 0);
    test_board->add_W_Pawn(5, 7, 4, 0);
    test_board->add_W_Pawn(6, 0, 5, 0);
    test_board->add_W_Pawn(6, 2, 6, 0);
    test_board->add_W_Pawn(6, 4, 7, 0);
    test_board->add_W_Pawn(6, 6, 8, 0);
    test_board->add_W_Pawn(7, 1, 9, 0);
    test_board->add_W_Pawn(7, 3, 10, 0);
    test_board->add_W_Pawn(7, 5, 11, 0);
    test_board->add_W_Pawn(7, 7, 12, 0);

    return test_board;
}


int main()
{
    char dataSending[4000];
	char dataReceived[4000];
    int clintListn = 0, clintConnt = 0, n =0;
	struct sockaddr_in ipOfServer;
	clintListn = socket(AF_INET, SOCK_STREAM, 0); // creating socket
	memset(&ipOfServer, '0', sizeof(ipOfServer));
	memset(dataSending, '0', sizeof(dataSending));
	ipOfServer.sin_family = AF_INET;
	ipOfServer.sin_addr.s_addr = htonl(INADDR_ANY);
	ipOfServer.sin_port = htons(2014); 		// this is the port number of running server
	bind(clintListn, (struct sockaddr*)&ipOfServer , sizeof(ipOfServer));
	listen(clintListn , 20);

	while(1)
	{
        cout<<"Nasłuchiwanie..."<<endl<<endl;
		clintConnt = accept(clintListn, (struct sockaddr*)NULL, NULL);
		n = read(clintConnt, dataReceived, sizeof(dataReceived)-1);
		dataReceived[n] = 0;

		string msg(dataReceived);
        cout<<"Dane otrzymane: "<<endl;
        Board *recevied_board = Generete_Board_from_msg(msg);
        recevied_board->print(1);

        cout<<endl<<"Dane przetwarzane..."<<endl<<endl;
        cout<<"Otrzymany wynik: "<<endl;
        Board *result_board = Generete_Red_Move(recevied_board, 3);
        string new_msg = Generete_msg_from_Board(result_board);
        result_board->print(1);

		snprintf(dataSending, sizeof(dataSending), new_msg.c_str());
		write(clintConnt, dataSending, strlen(dataSending));
        cout<<endl<<"Dane wysłane. "<<endl<<endl;

        close(clintConnt);
        sleep(1);
     }

    /*Board *test_board = Generete_test_Board();
    //test_board->print(0);
    test_board->print(1);

    Board *result_board = Generete_Red_Move(test_board, 3);
    //result_board->print(0);
    result_board->print(1);*/

    return 0;
}
