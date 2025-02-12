// キャラクターパズルのデータ
export const characterPuzzles = [
  {
    name: 'どうぶつ',
    size: 5,
    characters: [
      { 
        value: 'うさぎ',
        positions: [[0, 0], [2, 2]],
        emoji: '🐰'
      },
      {
        value: 'ねこ',
        positions: [[1, 0], [1, 2]],
        emoji: '🐱'
      },
      {
        value: 'いぬ',
        positions: [[0, 1], [2, 1]],
        emoji: '🐶'
      }
    ]
  },
  {
    name: 'くだもの',
    size: 6,
    characters: [
      {
        value: 'りんご',
        positions: [[0, 0], [3, 3]],
        emoji: '🍎'
      },
      {
        value: 'みかん',
        positions: [[1, 1], [4, 1]],
        emoji: '🍊'
      },
      {
        value: 'ばなな',
        positions: [[2, 0], [2, 4]],
        emoji: '🍌'
      },
      {
        value: 'ぶどう',
        positions: [[0, 2], [5, 2]],
        emoji: '🍇'
      }
    ]
  }
];
