import React from "react";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Icon,
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: 1,
      type: "positive",
      title: "Desenvolvimento de Site",
      amount: "R$ 1000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign",
      },
      date: "14/07/2022",
    },
    {
      id: 2,
      type: "negative",
      title: "Hamburgueria",
      amount: "R$ 80,00",
      category: {
        name: "Alimentação",
        icon: "coffee",
      },
      date: "13/07/2022",
    },
    {
      id: 3,
      type: "negative",
      title: "Aluguel do Apartamento",
      amount: "R$ 1000,00",
      category: {
        name: "Casa",
        icon: "home",
      },
      date: "14/07/2022",
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/93684818?v=4",
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Marcello</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="RS 10.666,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="RS 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="RS 9.407,00"
          lastTransaction="Última saída dia 03 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
