/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

export default function QuizDaGalera({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen
        externalQuestions={dbExterno.questions}
        externalBG={dbExterno.bg}
      />
    </ThemeProvider>
  // {/* <pre style={{ color: 'black' }}>
  // {JSON.stringify(dbExterno.questions, null, 4)}
  // </pre> */}

  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');

  try {
    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((resServer) => {
        if (resServer.ok) {
          return resServer.json();
        }

        throw new Error('Falha em pegar os dados');
      })
      .then((responseInObject) => (responseInObject))
      .catch((err) => {
        console.log(err);
      });

    // console.log('DbExterno: ', dbExterno);
    // console.log('Infos que o next da pra nois: ', context.query.id);

    return {
      props: {
        dbExterno,
      },
    };
  } catch (err) {
    // redirect
    throw new Error(err);
  }
}
