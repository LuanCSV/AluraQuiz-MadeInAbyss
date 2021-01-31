/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';

import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>AluraQuiz - Modelo Made in Abyss</title>
      </Head>
      <QuizContainer>
        <Widget>
          <Widget.Header>
            <h1>Made in Abyss</h1>
          </Widget.Header>

          <Widget.Content>
            <p>Anime mais inesperado...</p>
            <form onSubmit={(event) => {
              event.preventDefault();
              router.push(`/quiz?name=${name}`);
              console.log('Fazendo um submit');
            }}
            >
              <Input
                name="userName"
                value={name}
                placeholder="Digite teu nome"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
              <Button type="submit" disabled={name.length === 0}>
                Jogar <br />{name}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <Widget.Content>
              <h1>Quizes dos exploradores</h1>

              <p>Lorem ipsum dolor sit amet...</p>
            </Widget.Content>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/LuanCSV/AluraQuiz-MadeInAbyss" />
    </QuizBackground>
  );
}
