import React from 'react'
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import scheme from 'react-syntax-highlighter/dist/esm/languages/hljs/scheme';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import perl from 'react-syntax-highlighter/dist/esm/languages/hljs/perl';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import scala from 'react-syntax-highlighter/dist/esm/languages/hljs/scala';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import matlab from 'react-syntax-highlighter/dist/esm/languages/hljs/matlab';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import r from 'react-syntax-highlighter/dist/esm/languages/hljs/r';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';

export const languages = [
  javascript,
  python,
  xml,
  css,
  cpp,
  typescript,
  rust,
  scheme,
  java,
  kotlin,
  csharp,
  perl,
  php,
  scala,
  swift,
  matlab,
  sql,
  r,
  go,
  ruby
]

export const SupportedLang = () => {
  const languages = [
    javascript,
    python,
    xml,
    css,
    cpp,
    typescript,
    rust,
    scheme,
    java,
    kotlin,
    csharp,
    perl,
    php,
    scala,
    swift,
    matlab,
    sql,
    r,
    go,
    ruby
  ]

  languages.map(language =>(
    SyntaxHighlighter.registerLanguage((language.name), language)
  ))
  return ("")
}
