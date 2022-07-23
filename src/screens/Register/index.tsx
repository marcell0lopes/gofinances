import React, { useState } from "react";
import {
  Container,
  Title,
  Header,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";
import { Input } from "../../components/Form/Input";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";

export function Register() {
  const [transactionType, setTransactionType] = useState("");

  function handleTransactionTypeSelect(type: "up" | "down") {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title> Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input placeholder="Nome" placeholderTextColor="#969cb2" />
          <Input placeholder="Preço" placeholderTextColor="#969cb2" />
          <TransactionsTypes>
            <TransactionTypeButton
              title="Entrada"
              type="up"
              onPress={() => handleTransactionTypeSelect("up")}
              isActive={transactionType === "up"}
            />
            <TransactionTypeButton
              title="Saída"
              type="down"
              onPress={() => handleTransactionTypeSelect("down")}
              isActive={transactionType === "down"}
            />
          </TransactionsTypes>
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  );
}
