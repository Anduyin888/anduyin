{\rtf1\ansi\ansicpg936\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let textResult = '';\
\
function recognize() \{\
  const file = document.getElementById('imageInput').files[0];\
  if (!file) \{\
    alert("\uc0\u35831 \u20808 \u36873 \u25321 \u19968 \u24352 \u22270 \u29255 \u65281 ");\
    return;\
  \}\
\
  Tesseract.recognize(file, 'chi_sim', \{\
    logger: m => console.log(m)\
  \}).then((\{ data: \{ text \} \}) => \{\
    document.getElementById('output').innerText = text;\
    textResult = text;\
  \});\
\}\
\
function speak() \{\
  if (!textResult) \{\
    alert("\uc0\u35831 \u20808 \u35782 \u21035 \u20986 \u25991 \u23383 \u65281 ");\
    return;\
  \}\
\
  const utterance = new SpeechSynthesisUtterance(textResult);\
  utterance.lang = 'zh-CN';\
  speechSynthesis.speak(utterance);\
\}}