#include <iostream>
#include <fstream>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

using namespace std;

int main()
{
    int CreateSocket = 0,n = 0;
	char dataSending[4000];
    char dataReceived[4000];
    struct sockaddr_in ipOfServer;

    memset(dataReceived, '0' ,sizeof(dataReceived));

    if((CreateSocket = socket(AF_INET, SOCK_STREAM, 0))< 0)
    {
        printf("Socket not created \n");
        return 1;
    }

    ipOfServer.sin_family = AF_INET;
    ipOfServer.sin_port = htons(2014);
    ipOfServer.sin_addr.s_addr = inet_addr("127.0.0.1");

    if(connect(CreateSocket, (struct sockaddr *)&ipOfServer, sizeof(ipOfServer))<0)
    {
        printf("Connection failed due to port and ip problems\n");
        return 1;
    }

    ifstream in("datatosend.txt");
    string datatosend((istreambuf_iterator<char>(in)), istreambuf_iterator<char>());
    cout<<"Data to send: "<<endl<<datatosend<<endl<<endl;

    snprintf(dataSending, sizeof(dataSending), datatosend.c_str()); // Printing successful message
    write(CreateSocket, dataSending, strlen(dataSending));

    cout<<"Data sended, waiting for response..."<<endl;


    while((n = read(CreateSocket, dataReceived, sizeof(dataReceived)-1)) > 0)
    {
        dataReceived[n] = 0;
        cout<<"Data recive: "<<endl<<dataReceived<<endl<<endl;
    }

    if( n < 0)
    {
        printf("Standard input error \n");
    }

    return 0;
}
