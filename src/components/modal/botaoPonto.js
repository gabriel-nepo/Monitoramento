import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/Modal'
import stylesText from '../../styles/text';
import stylesComponets from '../../styles/componets';

class botaoPonto extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    ModalSet(estado){
        this.props.ModalSet(estado)
    }

    FinalizarEmbarque(){
        this.props.FinalizarEmbarque()
    }

    CancelarSemSalvar(){
        Alert.alert(
            "Cancelar embarque",
            "Você não salvou o embarque",
            [
              {
                text: "Ok",
                onPress: () => this.ModalSet(false),
                style: "cancel"
              },
              { text: "cancelar", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
    }


    render() {
        return (
            <View style = {{marginTop: 20}}>
                <View style = {{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this.FinalizarEmbarque()} style = {{flex: 1}}>
                        <View style={stylesComponets.botao}>
                            <Text style={stylesText.cabecalho}>Embarcar</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.ModalSet(false)} style = {{flex: 1}}>
                        <View style={stylesComponets.botao}>
                            <Text style={stylesText.cabecalho}>Adicionar aluno</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.CancelarSemSalvar()}>
                    <View style={stylesComponets.botao}>
                        <Text style={stylesText.cabecalho}>Cancelar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default botaoPonto;
