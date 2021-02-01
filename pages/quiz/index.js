/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import db from '../../db.json';
import Widget from '../../src/components/Widget';
import QuizLogo from '../../src/components/QuizLogo';
import QuizBackground from '../../src/components/QuizBackground';
import QuizContainer from '../../src/components/QuizContainer';
import AlternativesForm from '../../src/components/AlternativesForm';
import Button from '../../src/components/Button';
import BackLinkArrow from '../../src/components/BackLinkArrow';

function ResultWidget({ results }) {
  const somaAcertos = (resultados) => {
    const soma = resultados.reduce((somatoriaAtual, resultAtual) => {
      const isAcerto = resultAtual === true;
      if (isAcerto) {
        return somatoriaAtual + 1;
      }
      return somatoriaAtual;
    }, 0);

    return soma;
  };

  const renderSwitch = (result) => {
    let resultadoTexto;
    switch (result) {
      case 0:
        resultadoTexto = 'Você tem sorte...';
        break;
      case 1:
        resultadoTexto = 'Tontura e leves náuseas.';
        break;
      case 2:
        resultadoTexto = 'Náusea pesada, dor de cabeça e entorpecimento dos membros.';
        break;
      case 3:
        resultadoTexto = 'Vertigem combinada com alucinações visuais e auditivas.';
        break;
      case 4:
        resultadoTexto = 'Intensa dor no corpo inteiro e hemorragia de cada orifício do corpo';
        break;
      case 5:
        resultadoTexto = 'Perda temporária de todos os 5 sentidos, confusão e comportamento de automutilação.';
        break;
      case 6:
        resultadoTexto = 'Alterações corporais devastadoras que resultam na perda da humanidade e, muitas vezes, à morte.';
        break;
      case 7:
        resultadoTexto = 'Morte certa.';
        break;

      default:
        break;
    }
    return resultadoTexto;
  };

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        Fundo do abyss
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src="https://i.pinimg.com/originals/4d/6a/60/4d6a6002a902e90948a9ade08fb14dc3.gif"
      />
      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {/* espaco */}
          {somaAcertos(results)}
          {/* espaco */}
          &nbsp; das
          {' '}
          {results.length}
          {' '}
          perguntas!
        </p>
        <p>
          Sua maldição do abismo é:
        </p>
        <p>{renderSwitch(somaAcertos(results))}</p>
        <br />

        <p>
          Caso não tenha assistido Made in Abyss,
          recomendo de verdade, melhor anime na minha opinião.
        </p>
        {/* <ul>
          {results.map((result, index) => (
            <li key={Math.random(index)}>
              {`#${index + 1} questao: `}
              &nbsp;
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}
        </ul> */}
      </Widget.Content>
    </Widget>
  );
}
function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <img
          style={{ borderRadius: '50%', maxWidth: '250px', margin: 'auto', display: 'block' }}
          src="https://i.kym-cdn.com/photos/images/original/001/309/068/d2c.gif"
          alt="loading"
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const AlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && AlternativeStatus}
              >
                <input
                  // style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  const addResult = (result) => {
    setResults([
      ...results,
      result,
    ]);
  };
  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
    // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
