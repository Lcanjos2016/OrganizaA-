import 'package:flutter/material.dart';

void main() => runApp(MaterialApp(home: MinhaTela()));

class MinhaTela extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 1. A barra do topo (AppBar)
      appBar: AppBar(title: Text("OrganizaAÊ - Login")), 
      
      // 2. O corpo da tela
      body: Column( 
        children: [
          Text("Bem-vinda de volta!"), // Um texto simples
          
          TextField( // Um campo de entrada (Input)
            decoration: InputDecoration(labelText: "E-mail"),
          ),
          
          ElevatedButton( //  botão
            onPressed: () { 
              print("Botão apertado!"); 
            },
            child: Text("Entrar"),
          ),
        ],
      ),
    );
  }
}