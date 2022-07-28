import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "styled-components";

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
  LoadContainer,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightCardsData {
  entries: HighlightProps;
  expense: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>();
  const [highlightCardsData, setHighlightCardsData] =
    useState<HighlightCardsData>({} as HighlightCardsData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: TransactionCardProps[],
    type: "positive" | "negative"
  ) {
    const collectionFiltered = collection.filter(
      (transaction) => transaction.type === type
    );

    if (collectionFiltered.length === 0) {
      return "no date";
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expenseTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expenseTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const entriesLastTransaction = getLastTransactionDate(
      transactions,
      "positive"
    );

    const expenseLastTransaction = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalAmount = entriesTotal - expenseTotal;

    setHighlightCardsData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          entriesLastTransaction === "no date"
            ? "Não há entradas"
            : `Ultima entrada dia ${entriesLastTransaction}`,
      },
      expense: {
        amount: expenseTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          expenseLastTransaction === "no date"
            ? "Não há saídas"
            : `Ultima saída dia ${expenseLastTransaction}`,
      },
      total: {
        amount: totalAmount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: "",
      },
    });

    console.log(expenseLastTransaction);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton
                onPress={() => {
                  signOut();
                }}
              >
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightCardsData.total.amount}
              lastTransaction={highlightCardsData.total.lastTransaction}
            />
            <HighlightCard
              type="positive"
              title="Entradas"
              amount={highlightCardsData.entries.amount}
              lastTransaction={highlightCardsData.entries.lastTransaction}
            />
            <HighlightCard
              type="negative"
              title="Saídas"
              amount={highlightCardsData.expense.amount}
              lastTransaction={highlightCardsData.expense.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
