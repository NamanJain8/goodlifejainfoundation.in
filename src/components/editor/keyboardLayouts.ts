// Keyboard layouts for English, Hindi, and Brahmi
export const keyboardLayouts = {
  english: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      '{lock} a s d f g h j k l ; \' {enter}',
      '{shift} z x c v b n m , . / {shift}',
      '{space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {enter}',
      '{shift} Z X C V B N M < > ? {shift}',
      '{space}'
    ]
  },
  hindi: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} ौ ै ा ि ी ु ू ब ह ग द ज ड ़ ङ',
      '{lock} ो े ् ि ी ु ू प र क त च ट',
      '{shift} ै ौ ं म न व ल स , . / {shift}',
      '{space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} औ ऐ आ इ ई उ ऊ भ ङ घ ढ झ ञ ण',
      '{lock} ओ ए अ इ ई उ ऊ फ ऱ ख थ छ ठ',
      '{shift} ऐ औ ँ ण म न व ल श , . / {shift}',
      '{space}'
    ]
  },
  brahmi: {
    default: [
      '◌𑁀 𑁧 𑁨 𑁩 𑁪 𑁫 𑁬 𑁭 𑁮 𑁯 𑁦 𑀂 ◌𑀾 {bksp}',
      '{tab} ◌𑀿 ◌𑁃 ◌𑀸 ◌𑀻 ◌𑀽 𑀩 𑀳 𑀕 𑀤 𑀚 𑀟 ◌𑀹',
      '{lock} ◌𑁂 ◌𑁂 ◌𑁆 ◌𑀺 ◌𑀼 𑀧 𑀭 𑀓 𑀢 𑀘 𑀝 {enter}',
      '{shift} 𑀬 ◌𑀁 𑀫 𑀦 𑀯 𑀮 𑀲 𑁇 𑁈 {shift}',
      '{space}'
    ],
    shift: [
      '◌𑁁 𑀋 𑀌 𑀍 𑀎 𑁌 𑁋 𑁍 ◌𑀿 {bksp}',
      '{tab} 𑀒 𑀐 𑀆 𑀈 𑀊 𑀪 𑀗 𑀖 𑀥 𑀛 𑀠 𑀜',
      '{lock} 𑀑 𑀏 𑀅 𑀇 𑀉 𑀨 𑀶 𑀔 𑀣 𑀙 𑀞 {enter}',
      '{shift} 𑀖 𑀀 𑀡 𑀵 𑀷 𑀴 𑀰 𑁉 𑁊 {shift}',
      '{space}'
    ]
  }
}; 